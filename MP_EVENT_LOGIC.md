# Main Paper 金票活动 (Billete Dorado) - 商家核销业务逻辑拆解

基于活动 PDF 说明文件，以下是 Main Paper 2026 “Vuelta al Cole” (返校季) 金票抽奖活动的线下商家核销流程拆解。此文档将作为开发指南，指导我们如何构建核销系统的前端交互。

## 1. 业务背景 (Background)
Main Paper 在 2026 返校季活动中引入了“金票 (Billete Dorado)”抽奖环节。消费者在参与互动后，可能获得一张带有二维码的电子代金券（如 5€、2€ 等）。线下合作文具店（商家）需要能够通过手机扫描该二维码，来核销消费者的优惠券并抵扣货款。

## 2. 核心参与者 (Actors)
- **消费者 (Customer)**: 参与活动获得电子代金券，并在实体门店内向店员出示二维码。
- **商家/店员 (Merchant)**: 使用个人或店铺手机扫描二维码，登录核销系统并确认核销。
- **业务员 (Sales Rep)**: 负责给线下合作商家分配核销系统的登录账号和密码。

---

## 3. 页面与交互流程拆解 (Workflow Breakdown)

### 步骤 1：出示二维码 (Customer Side - Prize Display)
- **触发场景**: 消费者在门店结账时，向店员出示中奖页面。
- **视觉特征**: 经典的红金配色，带有“¡ENHORABUENA!” (恭喜) 和“BILLETE DORADO” (金票) 字样。
- **核心信息**: 
  - 明确的金额（例如 `CHEQUE DE: 5€`）。
  - 一个清晰的二维码，供商家扫描。
- **业务规则**: 优惠券仅限购买 MP (Main Paper) 产品可用，且有明确的使用截止日期（例如：`VÁLIDO HASTA EL 10/10/2026`）。

### 步骤 2：扫码与商家鉴权 (Merchant Authentication)
- **操作**: 店员直接使用手机自带相机扫描消费者出示的二维码。
- **跳转**: 浏览器会自动打开一个特定的核销链接（例如 `vueltaalcoleconmp.com/canje/...`），链接中带有该代金券的唯一标识符。
- **页面状态 1 - 未登录 (ACCESO COMERCIO)**:
  - 顶部显示 `VALIDACIÓN DE CUPÓN` (优惠券验证)。
  - 需要输入 `Usuario` (用户名) 和 `Contraseña` (密码)。
  - 按钮：`ENTRAR Y VALIDAR CUPÓN` (登录并验证优惠券)。
- **技术细节**: 登录状态必须持久化存储在手机本地（Local Storage / Cookies），做到“下次扫码无需再次登录”，以提高线下收银效率。

### 步骤 3：核销确认 (Redemption Confirmation)
- **页面状态 2 - 已登录/验证结果 (CUPÓN VÁLIDO)**:
  - 登录成功后，系统自动校验二维码对应的优惠券有效性。
  - 顶部显示绿色的打勾图标和文字 `CUPÓN VÁLIDO` (优惠券有效)。
  - 巨大且醒目的红色字体显示优惠券金额（例如 `2 EUR`）。
  - **单据详情**:
    - `CÓDIGO` (优惠码唯一编号，如 `CP-SMN3BYY1HKUN`)。
    - `ESTADO` (状态，例如 `Válido` 表示有效)。
    - `PREMIO` (奖品详情，例如 `Cupon 2 EUR`)。
    - `TICKET` (关联的购物小票号，如 `MP-0913-774E-45BA`)。
- **核心操作**: 店员核对无误后，点击底部的红色大按钮 `CONFIRMAR CANJE` (确认核销)。
- **后端逻辑预期**: 点击后，数据库将该优惠码状态更新为已核销 (Canjeado)，防止截图二次使用。前端应给出一个“核销成功”的最终确认弹窗或页面跳转。

---

## 4. 前端开发需求清单与 Tailwind 映射 (Frontend Requirements)

为了配合当前的地图项目风格，核销页面应当保持品牌的红黄配色，但要更偏向于工具类页面的简洁清晰。

### 4.1 商家登录页 (Merchant Login Component)
*   **布局**: 居中卡片式布局。
*   **UI 组件**:
    *   标题：粗体红色 `text-red-600 font-bold text-xl`。
    *   输入框：带边框，圆角，聚焦时变色 `border-2 border-gray-300 rounded-lg p-3 focus:border-red-500`。
    *   提交按钮：马里奥风格红色按钮 `.mario-button` (在 index.css 中已定义) `w-full py-3 uppercase font-bold text-white`。

### 4.2 核销确认页 (Validation Component)
*   **状态展示**: 绿色成功图标 `text-green-500`。
*   **金额数字**: 超大字号，红色字体 `text-5xl font-black text-red-600 my-4`。
*   **信息列表**: 灰底圆角框，内部使用键值对排版 `bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3`。
    *   键 (Label)：小字号灰色 `text-xs font-bold text-gray-500 uppercase`。
    *   值 (Value)：加粗深色 `text-sm font-bold text-gray-900`。
*   **核销按钮**: 底部固定或大尺寸红色操作按钮 `.mario-button w-full py-4 text-lg`。

## 5. 与现有地图 App 的结合 (Project Integration)
在目前的地图找店 App 中，地图上每个店铺的详情弹窗（Store Detail Modal）内，已经预留了 `¡Sorteo Main Paper!` (Main Paper 抽奖) 的入口。
**整体用户旅程闭环**:
1. 用户在地图上找到附近卖 MP 产品的文具店，导航过去。
2. 线下购买完 MP 产品后，用户在地图 App 中点击店铺详情里的抽奖入口（或扫描店里的实体海报二维码）参与活动。
3. 用户抽中金票 (Billete Dorado)。
4. 用户当场向店员出示二维码。
5. 店员用手机扫码，走本文件拆解的 `ACCESO COMERCIO` -> `CONFIRMAR CANJE` 流程完成核销抵扣。
