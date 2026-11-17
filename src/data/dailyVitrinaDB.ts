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
