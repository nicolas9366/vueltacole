# MISSION: STITCH REDESIGN
1. **Visual**: 严格参考 `stitch设计.md`。使用 20周年红金配色 (#DC2626, #FBBF24, Slate-900)。
2. **Framework**: 引入 Swiper.js。将活动内容 (Activities) 转化为左右滑动的“Stitch 模块卡片”。
3. **Data-Driven**: 
   - 严禁硬编码文案。文案必须存在 `CONFIG.i18n` 字典中。
   - 自动适配语言：检测系统语言，自动切换 [中文/简体] 和 [Español]。
4. **ROI Logic**: 必须包含 ROI 算账对比表 (€2000 订单 -> €3100+ 价值)。
5. **UI Style**: 执行 ui-ux-pro-max (大圆角 `rounded-[3rem]`, 玻璃拟态, 呼吸感布局)。