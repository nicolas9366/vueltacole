export interface DailyVitrinaImage {
  src: string;
  labelZh: string;
  labelEs: string;
}

export interface DailyVitrinaVideo {
  src: string;
  titleZh: string;
  titleEs: string;
  tagZh: string;
  tagEs: string;
  poster: string;
}

export interface DailyVitrinaEntry {
  id: string;
  date: string;
  sku: string;
  ean: string;
  packInfo: string;
  titleZh: string;
  titleEs: string;
  taglineZh: string;
  taglineEs: string;
  highlightsZh: string[];
  highlightsEs: string[];
  heroImage: string;
  images: DailyVitrinaImage[];
  videos: DailyVitrinaVideo[];
  shareTextB2B: string;
  shareTextB2C: string;
}

export const DAILY_VITRINA_ITEMS: DailyVitrinaEntry[] = [
  {
    id: '2026-11-18-pe517',
    date: '2026-11-18',
    sku: 'PE517',
    ean: '8435250904600',
    packInfo: '6支吸塑超值装 ｜ 12 挂板/包 · 144 挂板/箱',
    titleZh: 'MP* 马卡龙柔色荧光笔 6支超值装',
    titleEs: 'MP* Marcador Pastel 6 Uds. Pack Ahorro',
    taglineZh: '6种马卡龙柔色 · 1–3 mm 斜头可粗可细 · 水性不晕纸 · 13.5 cm 便携笔身',
    taglineEs: '6 tonos pastel · Punta biselada 1–3 mm · Tinta base agua sin traspasar · 13,5 cm',
    highlightsZh: [
      '奶油黄、薄荷绿、天空蓝、香芋紫、樱花粉、蜜桃橘 6 色柔和护眼不刺眼',
      '1–3 mm 耐磨斜头设计，横划重点、竖勾细线一本笔记全搞定',
      '欧标挂孔吸塑超值 6 支装，西班牙学生党与办公族高复购爆款，陈列即走量',
    ],
    highlightsEs: [
      '6 tonos pastel suaves que protegen la vista y dejan apuntes estéticos',
      'Punta biselada de 1 a 3 mm para subrayar títulos o trazar líneas finas',
      'Blíster Pack Ahorro de 6 uds con eurocolgador, top ventas escolar y oficina',
    ],
    heroImage: '/daily/2026-11-18/pe517_scene_01.jpg',
    images: [
      {
        src: '/daily/2026-11-18/pe517_scene_01.jpg',
        labelZh: '俯拍书桌笔记与6色平铺',
        labelEs: 'Vista cenital apuntes y 6 tonos',
      },
      {
        src: '/daily/2026-11-18/pe517_scene_02.jpg',
        labelZh: '手持周计划本划重点场景',
        labelEs: 'Subrayando en agenda semanal',
      },
      {
        src: '/daily/2026-11-18/pe517_scene_03.jpg',
        labelZh: '桌面陈列与学习便签搭配',
        labelEs: 'Display de escritorio y notas',
      },
      {
        src: '/daily/2026-11-18/pe517_detail_01.jpg',
        labelZh: '1–3mm斜头粗细笔触微距',
        labelEs: 'Detalle punta biselada 1–3 mm',
      },
    ],
    videos: [
      {
        src: '/daily/2026-11-18/pe517_b2b_drama.mp4',
        titleZh: '百元店老板选品短剧《柔色荧光笔破局》',
        titleEs: 'Corto B2B: Por qué PE517 vuela del lineal',
        tagZh: 'B2B 百元店推销版',
        tagEs: 'B2B Bazares',
        poster: '/daily/2026-11-18/pe517_scene_03.jpg',
      },
      {
        src: '/daily/2026-11-18/pe517_b2c_drama.mp4',
        titleZh: '西班牙语学习种草短剧《笔记大变身》',
        titleEs: 'Spot España: Apuntes bonitos con PE517',
        tagZh: 'B2C 西语消费版',
        tagEs: 'B2C España',
        poster: '/daily/2026-11-18/pe517_scene_02.jpg',
      },
    ],
    shareTextB2B:
      '🔥【明日主推预告｜MP* PE517 马卡龙柔色荧光笔 6支超值装】\n' +
      '还在卖刺眼老荧光笔吗？西班牙学生和白领都在抢这款 6 色马卡龙：\n' +
      '✅ 奶油黄/薄荷绿/香芋紫等 6 种高颜值柔色，久看笔记不刺眼\n' +
      '✅ 1–3 mm 斜头可粗可细，水性配方不透纸背\n' +
      '✅ 12挂板/包 · 144挂板/箱，自带欧标挂孔和 Pack Ahorro 醒目标识，文具店高周转单品\n' +
      '👉 效果图、双语宣传短剧与详情：https://vueltacole.com/vitrina.html\n' +
      '需要补货试销的老板直接私信我留货！',
    shareTextB2C:
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
    packInfo: '12色 6盒/包·96盒/箱 ｜ 24色 6盒/包·48盒/箱 ｜ 36色 6盒/包·36盒/箱',
    titleZh: 'MP* STYLE 直液丙烯软头马克笔',
    titleEs: 'MP* STYLE Rotulador Acrílico Punta Pincel',
    taglineZh: '弹性软毛刷头 1.5–6mm · 直液控墨视窗 · 黑底高遮盖 · 干后防水耐光',
    taglineEs: 'Punta pincel flexible 1,5–6 mm · Tinta directa · Extra opaco multisuperficie · Impermeable',
    highlightsZh: [
      '直液控墨鳍片视窗，无需按压摇晃，出墨均匀不断水',
      '黑卡纸、黑色陶瓷杯、石头、原木、牛仔布、金属水壶一笔盖色',
      '干透后防水耐光，欧标挂孔彩盒自带多材质使用示例图，陈列即成交',
    ],
    highlightsEs: [
      'Regulador de tinta directa con ventana transparente, flujo continuo sin agitar',
      'Máxima cobertura extra opaca sobre cartulina negra, cerámica, piedra, madera, tela y metal',
      'Resistente al agua y a la luz al secar; caja con eurocolgador lista para lineal',
    ],
    heroImage: '/daily/2026-11-17/pp948_scene_03.jpg',
    images: [
      {
        src: '/daily/2026-11-17/pp948_scene_01.jpg',
        labelZh: '俯拍桌面平铺创意工坊',
        labelEs: 'Vista cenital mesa creativa',
      },
      {
        src: '/daily/2026-11-17/pp948_scene_02.jpg',
        labelZh: '手持软头笔点绘鹅卵石',
        labelEs: 'Pintando sobre piedra natural',
      },
      {
        src: '/daily/2026-11-17/pp948_scene_03.jpg',
        labelZh: '牛仔布·木片·石头·金属壶多材质展示',
        labelEs: 'Aplicación en tela, madera, piedra y metal',
      },
      {
        src: '/daily/2026-11-17/pp948_detail_02.jpg',
        labelZh: '黑瓷盘防水凝珠与笔触细节',
        labelEs: 'Detalle impermeable y trazo 1,5–6 mm',
      },
    ],
    videos: [
      {
        src: '/daily/2026-11-17/pp948_b2b_drama.mp4',
        titleZh: '百元店老板选品短剧《老王的逆袭》',
        titleEs: 'Corto B2B para Bazares: El éxito de PP948',
        tagZh: 'B2B 百元店推销版',
        tagEs: 'B2B Bazares',
        poster: '/daily/2026-11-17/pp948_scene_01.jpg',
      },
      {
        src: '/daily/2026-11-17/pp948_b2c_drama.mp4',
        titleZh: '西班牙语消费种草短剧《Lucía 的礼物急救》',
        titleEs: 'Spot TV España: Lucía salva el regalo con PP948',
        tagZh: 'B2C 西语消费版',
        tagEs: 'B2C España',
        poster: '/daily/2026-11-17/pp948_scene_02.jpg',
      },
    ],
    shareTextB2B:
      '🔥【今日热卖主推｜MP* PP948 直液丙烯软头马克笔】\n' +
      '做文具和百元店的老板注意啦！这款 12/24/36 色软头丙烯笔全西班牙都在走量：\n' +
      '✅ 直液控墨视窗，不用摇不用按，下笔流畅不断墨\n' +
      '✅ 黑卡纸、石头、木片、黑陶瓷、牛仔布一笔高遮盖，干后防水不晕染\n' +
      '✅ 12色 6盒/包·96盒/箱，彩盒自带挂孔与多材质效果图，挂上货架自己会卖货\n' +
      '👉 查看全套效果图、宣传短剧与规格：https://vueltacole.com/vitrina.html\n' +
      '需要补货试单的老板直接私信我安排！',
    shareTextB2C:
      '🎨 ¡Transforma cualquier objeto en 5 minutos con MP* STYLE PP948!\n' +
      'Rotuladores acrílicos punta pincel (1,5–6 mm) con tinta directa y cobertura extra opaca:\n' +
      '✨ Pintan sobre piedra, madera, cerámica negra, tela vaquera y botellas metálicas\n' +
      '💧 Resistentes al agua al secar y colores súper vibrantes (12, 24 y 36 colores)\n' +
      '👉 Mira los vídeos y resultados aquí: https://vueltacole.com/vitrina.html',
  },
];
