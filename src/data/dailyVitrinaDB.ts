export interface DailyVitrinaImage {
  src: string;
  downloadUrl: string;
  labelZh: string;
  labelEn: string;
  labelEs: string;
}

export interface DailyVitrinaVideo {
  embedUrl: string;
  downloadUrl: string;
  titleZh: string;
  titleEn: string;
  titleEs: string;
  tagZh: string;
  tagEn: string;
  tagEs: string;
}

export interface DailyVitrinaEntry {
  id: string;
  date: string;
  sku: string;
  ean: string;
  packInfoZh: string;
  packInfoEn: string;
  packInfoEs: string;
  titleZh: string;
  titleEn: string;
  titleEs: string;
  taglineZh: string;
  taglineEn: string;
  taglineEs: string;
  highlightsZh: string[];
  highlightsEn: string[];
  highlightsEs: string[];
  heroImage: string;
  images: DailyVitrinaImage[];
  videos: DailyVitrinaVideo[];
  shareTextZh: string;
  shareTextEn: string;
  shareTextEs: string;
}

const gdImg = (id: string) => `https://lh3.googleusercontent.com/d/${id}=w1200`;
const gdDl = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`;
const gdVid = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

export const DAILY_VITRINA_ITEMS: DailyVitrinaEntry[] = [
  {
    id: '2026-11-18-pe517',
    date: '2026-11-18',
    sku: 'PE517',
    ean: '8435250904600',
    packInfoZh: '6支吸塑超值装 ｜ 12 挂板/包 · 144 挂板/箱',
    packInfoEn: 'Blister 6 Pcs Value Pack ｜ 12 packs/inner · 144 packs/carton',
    packInfoEs: 'Blíster 6 Uds. Pack Ahorro ｜ 12 packs/bolsa · 144 packs/caja',
    titleZh: 'MP* 马卡龙柔色荧光笔 6支超值装',
    titleEn: 'MP* Pastel Highlighters 6-Pack Value Set',
    titleEs: 'MP* Marcador Pastel 6 Uds. Pack Ahorro',
    taglineZh: '6种马卡龙柔色 · 1–3 mm 斜头可粗可细 · 水性不晕纸 · 13.5 cm 便携笔身',
    taglineEn: '6 aesthetic pastel tones · 1–3 mm chisel tip · Water-based no-bleed ink · 13.5 cm',
    taglineEs: '6 tonos pastel · Punta biselada 1–3 mm · Tinta base agua sin traspasar · 13,5 cm',
    highlightsZh: [
      '奶油黄、薄荷绿、天空蓝、香芋紫、樱花粉、蜜桃橘 6 色柔和护眼不刺眼',
      '1–3 mm 耐磨斜头设计，横划重点、竖勾细线一本笔记全搞定',
      '欧标挂孔吸塑超值 6 支装，西班牙学生党与办公族高复购爆款，陈列即走量',
    ],
    highlightsEn: [
      '6 soft eye-friendly pastel shades: butter yellow, mint, sky blue, lilac, blush pink & peach',
      'Durable 1–3 mm beveled chisel tip for wide highlights and crisp 1 mm underlines',
      'Retail-ready Euro-hook blister 6-pack with fast sell-through for school & office',
    ],
    highlightsEs: [
      '6 tonos pastel suaves que protegen la vista y dejan apuntes estéticos',
      'Punta biselada de 1 a 3 mm para subrayar títulos o trazar líneas finas',
      'Blíster Pack Ahorro de 6 uds con eurocolgador, top ventas escolar y oficina',
    ],
    heroImage: '/daily/2026-11-18/pe517_scene_01.jpg',
    images: [
      {
        src: gdImg('1WWEVsxgV9ouaQ8z9MvB8RFJIF887KoEd'),
        downloadUrl: gdDl('1WWEVsxgV9ouaQ8z9MvB8RFJIF887KoEd'),
        labelZh: '俯拍书桌笔记与6色平铺',
        labelEn: 'Overhead study desk flat-lay',
        labelEs: 'Vista cenital apuntes y 6 tonos',
      },
      {
        src: gdImg('1ktl9r3OqOS_4xj-CXw18guXLtcXVBSCu'),
        downloadUrl: gdDl('1ktl9r3OqOS_4xj-CXw18guXLtcXVBSCu'),
        labelZh: '手持周计划本划重点场景',
        labelEn: 'Weekly planner highlighting',
        labelEs: 'Subrayando en agenda semanal',
      },
      {
        src: gdImg('1hF81qrV0aTtSY_-WzmcZwieOr-ZFnQ2I'),
        downloadUrl: gdDl('1hF81qrV0aTtSY_-WzmcZwieOr-ZFnQ2I'),
        labelZh: '桌面陈列与学习便签搭配',
        labelEn: 'Desk display & pastel notes',
        labelEs: 'Display de escritorio y notas',
      },
      {
        src: gdImg('13-IeOBtbuZuTEI7sOTklTRGBg5MZUwSB'),
        downloadUrl: gdDl('13-IeOBtbuZuTEI7sOTklTRGBg5MZUwSB'),
        labelZh: '1–3mm斜头粗细笔触微距',
        labelEn: '1–3 mm chisel tip macro',
        labelEs: 'Detalle punta biselada 1–3 mm',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1NpSIP_2l1RG4UvNzGsU9z8ZcZml329vg'),
        downloadUrl: gdDl('1NpSIP_2l1RG4UvNzGsU9z8ZcZml329vg'),
        titleZh: '百元店老板选品短剧《柔色荧光笔破局》',
        titleEn: 'B2B Retail Short: Why PE517 Sells Fast',
        titleEs: 'Corto B2B: Por qué PE517 vuela del lineal',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1xY9iNZW-lEQZs8Z4fNzl_TnER6i7Jrim'),
        downloadUrl: gdDl('1xY9iNZW-lEQZs8Z4fNzl_TnER6i7Jrim'),
        titleZh: '西班牙语学习种草短剧《笔记大变身》',
        titleEn: 'Consumer Spot: Aesthetic Notes with PE517',
        titleEs: 'Spot España: Apuntes bonitos con PE517',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '🔥【明日主推｜MP* PE517 马卡龙柔色荧光笔 6支超值装】\n' +
      '还在卖刺眼老荧光笔吗？西班牙学生和白领都在抢这款 6 色马卡龙：\n' +
      '✅ 奶油黄/薄荷绿/香芋紫等 6 种高颜值柔色，久看笔记不刺眼\n' +
      '✅ 1–3 mm 斜头可粗可细，水性配方不透纸背\n' +
      '✅ 12挂板/包 · 144挂板/箱，自带欧标挂孔和 Pack Ahorro 醒目标识，文具店高周转单品\n' +
      '👉 效果图、宣传短剧与详情：https://vueltacole.com/vitrina.html',
    shareTextEn:
      '✨ Upgrade your study & office notes with MP* PE517 Pastel Highlighters (6-Pack)!\n' +
      '🖍️ 6 soft eye-friendly pastel shades with 1–3 mm beveled chisel tip\n' +
      '📄 Smooth water-based ink that will not bleed through notebook pages\n' +
      '👉 See gallery & videos here: https://vueltacole.com/vitrina.html',
    shareTextEs:
      '✨ ¡Tus apuntes más bonitos y sin cansar la vista con MP* PE517!\n' +
      'Pack ahorro de 6 subrayadores en tonos pastel súper suaves:\n' +
      '🖍️ Punta biselada 1–3 mm para títulos anchos y subrayado fino\n' +
      '📄 Tinta base agua que no traspasa el papel\n' +
      '👉 Mira las fotos y el vídeo aquí: https://vueltacole.com/vitrina.html',
  },
  {
    id: '2026-11-17-pp948',
    date: '2026-11-17',
    sku: 'PP948-1 / PP948-2 / PP948-3',
    ean: '8435721054384',
    packInfoZh: '12色 6盒/包·96盒/箱 ｜ 24色 6盒/包·48盒/箱 ｜ 36色 6盒/包·36盒/箱',
    packInfoEn: '12c: 6/pack · 96/ctn ｜ 24c: 6/pack · 48/ctn ｜ 36c: 6/pack · 36/ctn',
    packInfoEs: '12 col: 6/pack · 96/caja ｜ 24 col: 6/pack · 48/caja ｜ 36 col: 6/pack · 36/caja',
    titleZh: 'MP* STYLE 直液丙烯软头马克笔',
    titleEn: 'MP* STYLE Liquid-Ink Acrylic Brush Markers',
    titleEs: 'MP* STYLE Rotulador Acrílico Punta Pincel',
    taglineZh: '弹性软毛刷头 1.5–6mm · 直液控墨视窗 · 黑底高遮盖 · 干后防水耐光',
    taglineEn: 'Flexible 1.5–6 mm brush tip · Direct ink regulator · Extra opaque · Waterproof dry finish',
    taglineEs: 'Punta pincel flexible 1,5–6 mm · Tinta directa · Extra opaco multisuperficie · Impermeable',
    highlightsZh: [
      '直液控墨鳍片视窗，无需按压摇晃，出墨均匀不断水',
      '黑卡纸、黑色陶瓷杯、石头、原木、牛仔布、金属水壶一笔盖色',
      '干透后防水耐光，欧标挂孔彩盒自带多材质使用示例图，陈列即成交',
    ],
    highlightsEn: [
      'Visible direct-ink regulator window: smooth steady flow without shaking or pumping',
      'Extra-opaque coverage on black paper, ceramic, river stone, wood, denim & metal',
      'Waterproof & lightfast once dry; Euro-hook display box shows multi-surface examples',
    ],
    highlightsEs: [
      'Regulador de tinta directa con ventana transparente, flujo continuo sin agitar',
      'Máxima cobertura extra opaca sobre cartulina negra, cerámica, piedra, madera, tela y metal',
      'Resistente al agua y a la luz al secar; caja con eurocolgador lista para lineal',
    ],
    heroImage: '/daily/2026-11-17/pp948_scene_03.jpg',
    images: [
      {
        src: gdImg('17WNX9C7ubQp16eI4lg1P3rGChfmYMC_i'),
        downloadUrl: gdDl('17WNX9C7ubQp16eI4lg1P3rGChfmYMC_i'),
        labelZh: '俯拍桌面平铺创意工坊',
        labelEn: 'Overhead creative desk flat-lay',
        labelEs: 'Vista cenital mesa creativa',
      },
      {
        src: gdImg('1g-07Ls_IOWReMuwlJG9eDbzUHet04F7x'),
        downloadUrl: gdDl('1g-07Ls_IOWReMuwlJG9eDbzUHet04F7x'),
        labelZh: '手持软头笔点绘鹅卵石',
        labelEn: 'Brush painting on river stone',
        labelEs: 'Pintando sobre piedra natural',
      },
      {
        src: gdImg('1wVhegMwisr7n_SkOx7j-Ty5AWhLZL0pC'),
        downloadUrl: gdDl('1wVhegMwisr7n_SkOx7j-Ty5AWhLZL0pC'),
        labelZh: '牛仔布·木片·石头·金属壶多材质展示',
        labelEn: 'Denim, wood, stone & metal showcase',
        labelEs: 'Aplicación en tela, madera, piedra y metal',
      },
      {
        src: gdImg('16vGz21xYRBIm_ukYB2aTVFwGoiH5PWDr'),
        downloadUrl: gdDl('16vGz21xYRBIm_ukYB2aTVFwGoiH5PWDr'),
        labelZh: '黑瓷盘防水凝珠与笔触细节',
        labelEn: 'Waterproof droplets & brush macro',
        labelEs: 'Detalle impermeable y trazo 1,5–6 mm',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1eyrlWRUZOUUm35O_cKgoSdZ_HFQ7jSiE'),
        downloadUrl: gdDl('1eyrlWRUZOUUm35O_cKgoSdZ_HFQ7jSiE'),
        titleZh: '百元店老板选品短剧《老王的逆袭》',
        titleEn: 'B2B Retail Short: PP948 Bestseller',
        titleEs: 'Corto B2B para Bazares: El éxito de PP948',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1tLuZyPC-M6a_gfTOnJPFevNFC7DD9zkw'),
        downloadUrl: gdDl('1tLuZyPC-M6a_gfTOnJPFevNFC7DD9zkw'),
        titleZh: '西班牙语消费种草短剧《Lucía 的礼物急救》',
        titleEn: 'Consumer Spot: Lucía DIY Rescue',
        titleEs: 'Spot TV España: Lucía salva el regalo con PP948',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '🔥【今日热卖主推｜MP* PP948 直液丙烯软头马克笔】\n' +
      '做文具和百元店的老板注意啦！这款 12/24/36 色软头丙烯笔全西班牙都在走量：\n' +
      '✅ 直液控墨视窗，不用摇不用按，下笔流畅不断墨\n' +
      '✅ 黑卡纸、石头、木片、黑陶瓷、牛仔布一笔高遮盖，干后防水不晕染\n' +
      '✅ 12色 6盒/包·96盒/箱，彩盒自带挂孔与多材质效果图，挂上货架自己会卖货\n' +
      '👉 查看全套效果图、宣传短剧与规格：https://vueltacole.com/vitrina.html',
    shareTextEn:
      '🎨 Transform any surface in minutes with MP* STYLE PP948 Acrylic Brush Markers!\n' +
      '✨ Direct liquid-ink regulator + extra-opaque coverage on black paper, stone, wood, ceramic, denim & metal\n' +
      '💧 Waterproof once dry · Available in 12, 24 & 36 vibrant colors\n' +
      '👉 Watch the showcase & videos: https://vueltacole.com/vitrina.html',
    shareTextEs:
      '🎨 ¡Transforma cualquier objeto en 5 minutos con MP* STYLE PP948!\n' +
      'Rotuladores acrílicos punta pincel (1,5–6 mm) con tinta directa y cobertura extra opaca:\n' +
      '✨ Pintan sobre piedra, madera, cerámica negra, tela vaquera y botellas metálicas\n' +
      '💧 Resistentes al agua al secar y colores súper vibrantes (12, 24 y 36 colores)\n' +
      '👉 Mira los vídeos y resultados aquí: https://vueltacole.com/vitrina.html',
  },
];
