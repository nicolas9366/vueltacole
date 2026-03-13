#!/bin/bash

# ==========================================
# 中汇 2026 学汛战役 - 前端工程化初始脚本
# 角色：营销全域创意总监定制
# ==========================================

PROJECT_NAME="Zaragoza-Campaign-2026"

echo "🔥 正在为你启动全域营销引擎，初始化项目目录: $PROJECT_NAME..."

# 1. 创建核心目录结构
mkdir -p $PROJECT_NAME/src/locales
mkdir -p $PROJECT_NAME/src/pages
mkdir -p $PROJECT_NAME/assets/images
cd $PROJECT_NAME

# 2. 生成 README.md 说明文档
cat << 'EOF' > README.md
# 🎯 Zaragoza 2026 学汛战役 (A/B 测试作战室)
## 项目愿景
利用“中汇20周年”与“50%代金券”核武器，结合本地 IT 业务员的数字化赋能，对 Aragon 地区百元店进行降维打击。

## 目录结构
- `/src/locales/`: 核心营销文案配置库 (JSON)，修改这里的文字即可同步全站。
- `/src/pages/`: 4 大视觉方案的 HTML/UI 落地页。
- `/assets/images/`: 存放 Antigravity 生成的视觉图和官方 Logo。
EOF

# 3. 生成公用营销核武器文案 (JSON)
cat << 'EOF' > src/locales/text-common-promo.json
{
  "core_hook": "史无前例！全场国际大牌 50% 代金券返还！",
  "earning_period": "🔥 抢券期：2026.05.26 - 06.20",
  "spending_period": "💰 用券期：2026.06.21 - 07.21",
  "tech_barrier": "⚠️ 注意：此特权仅限 APP/WEB/PDA 系统下单专享。扫码联系您的专属 IT 业务员一键开通！",
  "trust_badge": "中汇 20 周年官方认证"
}
EOF

# 4. 生成备选讨论中心主页文案 (JSON)
cat << 'EOF' > src/locales/text-home.json
{
  "page_title": "2026 学汛战役 A/B 测试作战室",
  "subtitle": "中汇 20 周年 Aragon 地区专属数字营销方案评估",
  "instruction": "请点击下方四种不同心智模式的视觉方案，预览最终落地页效果。所有方案均已嵌入 50% 返券核心逻辑。"
}
EOF

# 5. 生成各个方案的专属文案 (JSON)
cat << 'EOF' > src/locales/text-concept1.json
{
  "concept": "高级质感矩阵",
  "main_title": "中汇 20 载，铸就财富基石",
  "sub_title": "2026 学汛国际大牌破价特惠。PN331 抄底价搭配高级品牌，打造全客层流量收割机。"
}
EOF

cat << 'EOF' > src/locales/text-concept2.json
{
  "concept": "复古波普",
  "main_title": "爆单预警！学汛底价已激活！",
  "sub_title": "老外只认这些牌子！Oxford / Pilot 特批放价，手慢无，别让对街同行抢了先！"
}
EOF

cat << 'EOF' > src/locales/text-concept3.json
{
  "concept": "未来赛博",
  "main_title": "门店数字化升级：您的专属 D2C 订货引擎",
  "sub_title": "不仅提供底价好货，更送你一套“扫码即卖”的学生家长引流系统。"
}
EOF

cat << 'EOF' > src/locales/text-concept4.json
{
  "concept": "丰收插画",
  "main_title": "开学季，把利润装进您的钱袋子！",
  "sub_title": "20周年感恩大回馈，高频走量款 PN331 + 高利润国际大牌一次配齐。"
}
EOF

# 6. 生成基础的 HTML 入口页面（预留图片展示位）
for PAGE in DiscussionHub Concept1_Matrix Concept2_PopArt Concept3_Cyber Concept4_Autumn; do
cat << EOF > src/pages/${PAGE}.html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${PAGE} - 2026 学汛战役</title>
    </head>
<body>
    <h1>${PAGE} 视觉方案展示</h1>
    <p>💡 请将 Antigravity 生成的图片和 locales 中的 JSON 文案结合在此处。</p>
    </body>
</html>
EOF
done

# 7. 自动化 Git 版本控制初始化
echo "📦 正在初始化 Git 仓库并进行首次提交..."
git init
git add .
git commit -m "feat(init): 🚀 初始化 2026 学汛战役 A/B 测试框架与核心文案库"

echo "✅ 完美！总监提示：项目目录构建完毕，Git 初始化成功！"
echo "👉 下一步：进入 $PROJECT_NAME/ 文件夹，打开你的代码编辑器 (VS Code) 开始工作吧！"