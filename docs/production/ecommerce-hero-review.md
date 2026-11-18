# 电商首图修订与技能调研

原四图流程以场景照片开头，缺少零售包装、套装数量及完整颜色的验收。本次以包装首图替换 heroImage，保留已有场景图。包规和箱规分别表达，单品加陈列盒的摆拍不代表零售附赠一盒。

- PE224-1：蓝黑两支零售套装。
- PE140A-12：12支蓝色圆珠笔。用户明确指定首图只用完整原包装，同色装无需外排十二支；十二散件版本废弃。
- PP633-1：75ml金色单管，六管陈列盒作为批发包装参考。
- PP948-1：12色套装，生成图须逐支数目和逐色检查。

## 对照资料

- https://github.com/Bria-AI/bria-skill
  提供商品摄影、抠图、蒙版和结构化 JSON 控制，执行层依赖 Bria API key。仅审阅文档，未安装或实测。
- https://github.com/feariangod/packaging-product-visuals
  references/ecommerce-assets.md 将包装身份、SKU、可见物件数量、用途、裁切与整套一致性纳入验收。适合补充原技能的商品定义与主图检查。
- https://github.com/liangdabiao/ecom-details-image
  已有 hero、packaging、multi-product、multi-angle 模板。首图与套装图应明确使用对应模板角色。

本地 flagship-sku-studio 已补充包装首图、颜色与数量、销售单位验收，并纠正按动笔使用方式。副本见同目录 flagship-sku-studio.md。
