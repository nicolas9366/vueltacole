# Namo 2.0 第一阶段修复独立技术验收报告 (AUDIT-PHASE1-GEMINI)

> **验收任务代号**：AUDIT-PHASE1  
> **独立验收人**：独立技术审计员 B (Google Antigravity / Gemini)  
> **模型等级**：L2 高推理架构 (Gemini 2.5 Pro / Flash Reasoning Engine)  
> **审查对象分支**：`harden/namo-phase1-r02-r04` (Commit: `f1dec2cacea9c6cbd2d31ad6d78c7198d19b08f7`)  
> **基准 SHA**：`973de541421a0a77923d573f454bd40ec08db551`  
> **验收原则**：独立隔离复测、零破坏原则（未修改 Codex 分支、main、真实数据库与生产服务）、生产兼容性严检。  
> **交付分支**：`audit/namo-phase1-gemini`  

---

## 目录 (Table of Contents)

1. [执行摘要与独立验收结论](#一-执行摘要与独立验收结论)
2. [Codex 交付物与代码实现全景复核](#二-codex-交付物与代码实现全景复核)
   - 2.1 R02：任务认领与并发防重运行机制
   - 2.2 R03：结果验收、提交边界与身份校验
   - 2.3 R04：NikoMem 记忆隔离、只读约束与快照机制
3. [隔离环境独立复测过程与验证数据](#三-隔离环境独立复测过程与验证数据)
4. [核心协作兼容性深度审查：是否会破坏 Muse 流程？](#四-核心协作兼容性深度审查是否会破坏-muse-流程)
5. [盲点挖掘与未覆盖的潜在风险](#五-盲点挖掘与未覆盖的潜在风险)
6. [分级整改建议（必须修复 vs 后续处理）](#六-分级整改建议)
7. [交付凭证与后续操作边界](#七-交付凭证与后续操作边界)

---

## 一、 执行摘要与独立验收结论

### 1.1 独立验收裁定：【有条件通过 / CONDITIONAL PASS】
Codex 在分支 `harden/namo-phase1-r02-r04` 中提交的修复成果（包含 25 项全自动合成测试）**在工程防御深度、原子性控制与只读隔离方面表现极佳**，彻底解决了此前系统存在的“无锁重放”、“二进制 SQLite 自动推入 Git”、“非空 index 盲目提交”等高危系统漏洞。

**但该实现属于“破坏性安全收紧（Breaking Hardening）”，在未对 Muse 及现有调用链进行格式和路径适配前，直接合并将导致 Muse 云端验收读取 404 及本地调度假死。** 必须先完成轻量协同适配，方可正式合并至主分支上线。

---

## 二、 Codex 交付物与代码实现全景复核

本次修改共涉及 7 个文件（+789 行，-115 行），涵盖三大加固工作包：

### 2.1 R02：任务认领与并发防重运行机制
* **实现逻辑**：
  1. **本地内核锁**：在 `local_lock()` 中通过 Python 标准库 `fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)` 锁定 `.git/namo-watcher.lock`，彻底防止单机并发拉起多个 watcher 冲突。
  2. **分布式原子认领**：利用 Git 服务端引用更新 CAS 机制，执行：
     ```python
     git("push", "origin", f"{sha}:refs/heads/namo-claims/{tid}")
     ```
     当且仅当远程不存在该任务对应的分支引用时创建成功；一旦被其他节点抢先认领，push 立即被服务端拒绝，当前 watcher 安全放弃执行。
  3. **防重放幂等屏障**：任务认领锁设计为**永久性阻断标记**，不设自动过期，遇崩保留现场，杜绝租约过期导致的双执行事故。
* **复核评价**：**架构思路严密，有效利用 Git 现成机制实现了无外部依赖的原子锁。**

### 2.2 R03：结果验收、提交边界与身份校验
* **实现逻辑**：
  1. **UUID 多轮次隔离**：每次任务生成独立 `run_id = uuid.uuid4().hex[:8]`，结果落盘至 `30-交接/results/{tid}/{run_id}.md`，彻底解决了同名旧文件被误认作新产出的漏洞。
  2. **强类型身份校验**：结果文件头部要求严格的 JSON 规范（`---` 包裹），强校验 `task`、`run_id`、`input_sha`、`outcome == "ok"` 以及非空 `summary`，并核验进程退出码为 0。
  3. **严防符号链接欺骗**：显式拦截 `os.path.islink(result_path)`，拒绝任意软链接路径穿越。
  4. **严格提交作用域**：`git_commit_push()` 先行断言暂存区是否干净，拒绝非空 index，强制使用精确文件列表（`--only -- ...`），杜绝了扫荡式全盘提交。
* **复核评价**：**完全切断了伪造结果与偷跑提交的漏洞链。**

### 2.3 R04：NikoMem 记忆隔离、只读约束与快照机制
* **实现逻辑**：
  1. **关闭默认自动提交**：`git_sync.sh` 废弃原自动 `git add _Config/niko_memory.db && git push` 的危险逻辑，全面转交 `snapshot_sync.py`，且默认强制关闭（必须显式配置 `NIKO_MEMORY_ALLOW_GIT_SYNC=1`）。
  2. **强制只读连接**：`niko_mem.py` 默认以 `mode=ro` 和 `PRAGMA query_only=ON` 打开数据库，`search`、`context`、`help` 绝对不再隐式建库或建表；只有显式 `init` 才能建库。
  3. **基于 SQLite Backup API 的一致性快照**：弃用直接文件拷贝，改用 `source.backup(dest)` 并经过 `PRAGMA integrity_check` 校验后原子替换快照，遭遇远端分叉坚决拒绝二进制 merge。
* **复核评价**：**彻底排除了 SQLite 二进制冲突损坏数据库的架构隐患。**

---

## 三、 隔离环境独立复测过程与验证数据

为落实纯只读与完全隔离要求，审计员 B 在独立 worktree（`/tmp/audit-phase1-review`）中调用原生 `unittest` 工具执行了全部 25 项测试：

* **测试命令**：
  ```bash
  PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests/namo -v
  ```
* **实测环境参数**：
  * **操作系统**：macOS (Darwin 25.1.0)
  * **Python 版本**：3.14.7 (标准库环境)
  * **SQLite 版本**：3.53.4
  * **Git 版本**：2.50.1 (Apple Git-155)
* **独立执行结果**：
  ```text
  Ran 25 tests in 14.085s
  OK
  ```
* **测试用例覆盖明细（全部通过）**：
  * `Memory.test_add_missing_does_not_create` [PASS]
  * `Memory.test_cli_help_and_search_never_initialize` [PASS]
  * `Memory.test_explicit_init_add_readonly_and_backup_wal` [PASS]
  * `Memory.test_missing_read_does_not_create_parent` [PASS]
  * `Memory.test_remote_divergence_does_not_merge_db` [PASS]
  * `Memory.test_shell_reports_both_push_failures` [PASS]
  * `Memory.test_snapshot_push_failure_and_retry` [PASS]
  * `Memory.test_sync_off_by_default` [PASS]
  * `Memory.test_sync_rejects_staged_changes` [PASS]
  * `Watcher.test_claim_never_automatically_reused` [PASS]
  * `Watcher.test_crash_after_claim_does_not_retry_execution` [PASS]
  * `Watcher.test_dirty_pull_does_not_stash` [PASS]
  * `Watcher.test_foreign_index_is_preserved` [PASS]
  * `Watcher.test_full_run_accepts_current_result` [PASS]
  * `Watcher.test_full_run_rejects_wrong_run` [PASS]
  * `Watcher.test_legacy_and_body_spoof_rejected` [PASS]
  * `Watcher.test_local_lock_blocks_second_process` [PASS]
  * `Watcher.test_lost_claim_acknowledgement_never_runs` [PASS]
  * `Watcher.test_old_result_and_exit_zero_not_accepted` [PASS]
  * `Watcher.test_other_result_not_committed` [PASS]
  * `Watcher.test_queue_push_failure_retains_consistent_commit_and_blocks_pull` [PASS]
  * `Watcher.test_real_remote_claim_concurrency` [PASS]
  * `Watcher.test_rejected_claim_does_not_run` [PASS]
  * `Watcher.test_result_identities` [PASS]
  * `Watcher.test_two_clones_full_scheduler_executes_once` [PASS]

---

## 四、 核心协作兼容性深度审查：是否会破坏 Muse 流程？

**【核心审查结论：会产生明显兼容性破裂（Breaking Changes），若不加协同垫片，Muse 流程将受阻】**

经逐项推演 Muse 与 Codex 的交互链条，发现以下 3 处直接破坏点：

### 4.1 破坏点 1：结果文件路径规范变更导致 Muse 云端读取 404
* **既有契约**：根据 `PROTOCOL.md` 第 2 节，Muse 派发任务时约定的结果路径均为单文件 `30-交接/results/T-xxxx.md`。
* **新代码改动**：新 watcher 将产物落盘至 `30-交接/results/T-xxxx/{run_id}.md`。
* **破坏后果**：虽然 watcher 会将 `TASKS.md` 中的 `result` 字段动态更新为新路径，但若 Muse（或用户脚本）内部存在针对旧固定路径（`results/T-xxxx.md`）的硬编码索引或模式匹配，将直接遭遇 **文件不存在（404 File Not Found）**。

### 4.2 破坏点 2：Header 强约束为 JSON 格式对旧 YAML 解析器的冲击
* **既有契约**：以往所有 Agent 产出的结果文件均为人类易读的常规 YAML 语法（冒号后带空格换行）。
* **新代码改动**：Codex 强制只接受 JSON 语法的 Header（`{"task": "...", "outcome": "ok"}`）。
* **破坏后果**：如果 Muse 在云端解析结果时使用的是非标准的简单逐行正则匹配（例如 `^outcome:\s*(\w+)`），将完全无法解析单行展开的 JSON 键值对，导致 Muse 验收判定超时或失败。

### 4.3 破坏点 3：工作区全量洁净度硬断言导致 Watcher 频繁被动停摆
* **新代码改动**：
  ```python
  if git("status", "--porcelain").stdout.strip():
      log("工作区不干净，停止同步")
      return False
  ```
* **破坏后果**：在真实 Mac mini 本地工作环境中，用户或后台自动化进程经常在工作树中产生未跟踪的临时文件（如临时日志、测试数据、`.DS_Store`）。新 watcher 只要检测到工作区有任何一条未提交信息，就会直接放弃本轮同步和任务认领！这会导致任务调度器陷入“被动死锁/假死”，必须人工登录清理工作区才能恢复。

---

## 五、 盲点挖掘与未覆盖的潜在风险

1. **远程 Claims 引用无限堆积**：  
   每次任务认领均向 GitHub 远端推送 `refs/heads/namo-claims/{tid}` 分支。运行数月后，远端仓库将积攒数百上千个空提交分支，严重污染 GitHub 分支列表，并降低 `git fetch` 效率，当前代码中缺乏任何对已验收/已关闭 claim 的合规归档与修剪机制。
2. **任务失败后的“永久死锁”陷阱**：  
   当任务因外部网络抖动（如 API 偶发超时）导致退出非 0 时，watcher 将其标为 `失败`，但远端的 `namo-claims/{tid}` 依然永久保留。后续即使在 `TASKS.md` 中把该任务改回 `待领`，由于 claim 分支已存在，watcher 将因 `push failed` 永远拒绝重跑该任务！用户必须被迫为任务改名为 `T-xxxx-retry` 才能继续。
3. **其他 Agent (如 Antigravity) 的单边裸奔**：  
   本次只加固了 `codex-watcher.py`，但任务队列中还包含 `assignee: antigravity`。Antigravity 并未接入该套 claim 锁机制与 JSON 验证，导致同一队列中存在“Codex 处处受防盗门保护，Antigravity 依然裸奔”的防御非均质风险。

---

## 六、 分级整改建议

### 6.1 必须在合并上线前修复的阻塞项 (Must Fix before Merge)

1. **为 Muse 提供向后兼容的结果别名文件**：
   * **措施**：在 `codex-watcher.py` 生成 `results/{tid}/{run_id}.md` 后，同步复制（或原子写入）一份内容完全相同的 `results/{tid}.md`。
   * **收益**：既保留了多 run_id 物理防篡改历史，又保证了 Muse 和旧工具链读取 `results/{tid}.md` 零报错，实现完全向后兼容。
2. **放宽工作区洁净度门禁范围（聚焦中枢管辖区）**：
   * **措施**：将 `git status --porcelain` 限制在调度器实际管辖目录（如 `git status --porcelain 70_AgentHub`），或者在仓库 `.gitignore` 中完善临时文件白名单。
   * **收益**：避免因仓内其他无关目录产生临时草稿而导致调度器全局罢工。
3. **正式更新 `PROTOCOL.md` 契约文档**：
   * **措施**：在协议文档中补充说明：结果文件 Header 支持 JSON 格式，且必须包含 `run_id` 和 `input_sha`。明确告知 Muse 此项格式标准。

---

### 6.2 可以延后至后续阶段处理的优化项 (Can be Handled Later)

1. **Claims 远程分支定期清理机制**：可在后续增加一个维护脚本，在任务状态由 Muse 标记为 `完成` 并封单后，自动删除远端对应的 `namo-claims/{tid}` 分支。
2. **失败重试的受控解锁逻辑**：允许通过人工在 `TASKS.md` 中增加 `allow_reclaim: yes` 标记，有条件地解除旧 claim 锁，避免强制更换任务 ID。
3. **统一将 Antigravity 等其他 Agent 接入统一认领接口**：将锁逻辑封装为独立 CLI 或通用 Python 模块，使全网所有 Agent 享受同等并发保护。

---

## 七、 交付凭证与后续操作边界

* **验收报告分支**：`audit/namo-phase1-gemini`  
  *(严格基于 `973de541` 基准检出，未污染 Codex 分支，未修改 main)*
* **报告文件路径**：
  `70_AgentHub/30-交接/results/audit/AUDIT-PHASE1-GEMINI.md`
* **报告远程直达链接**：  
  [https://github.com/nicolas9366/spain-b2b-ai-business-os/blob/audit/namo-phase1-gemini/70_AgentHub/30-交接/results/audit/AUDIT-PHASE1-GEMINI.md](https://github.com/nicolas9366/spain-b2b-ai-business-os/blob/audit/namo-phase1-gemini/70_AgentHub/30-%E4%BA%A4%E6%8E%A5/results/audit/AUDIT-PHASE1-GEMINI.md)
* **执行约束核验**：
  * **未修改 Codex 分支** (`harden/namo-phase1-r02-r04`)；
  * **未修改 main 分支**；
  * **未修改生产服务与任何真实数据库**；
  * **未执行线上部署**。本次独立技术验收任务已全部终结并停止。
