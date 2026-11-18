import top100Raw from './top100PromoDB.json';

export type VitrinaCategory = 'writing' | 'art' | 'office' | 'paper';

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
  rank: number;
  sku: string;
  ean: string;
  catKey: VitrinaCategory;
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

function detectCategory(cat: string, subcat: string, namees: string): VitrinaCategory {
  const txt = `${cat} ${subcat} ${namees}`.toUpperCase();
  if (
    txt.includes('ACRÍLIC') ||
    txt.includes('TÉMPERA') ||
    txt.includes('PINTURA') ||
    txt.includes('PINCEL') ||
    txt.includes('ACUARELA') ||
    txt.includes('PLASTILINA') ||
    txt.includes('ARCILLA') ||
    txt.includes('美术') ||
    txt.includes('颜料')
  ) {
    return 'art';
  }
  if (
    txt.includes('CUADERNO') ||
    txt.includes('BLOC') ||
    txt.includes('CARPETA') ||
    txt.includes('AGENDA') ||
    txt.includes('ARCHIVADOR') ||
    txt.includes('CARTULINA') ||
    txt.includes('本') ||
    txt.includes('纸')
  ) {
    return 'paper';
  }
  if (
    txt.includes('MARCADOR') ||
    txt.includes('ROTULADOR') ||
    txt.includes('BOLÍGRAFO') ||
    txt.includes('LÁPIZ') ||
    txt.includes('PORTAMINA') ||
    txt.includes('SUBRAYADOR') ||
    txt.includes('笔')
  ) {
    return 'writing';
  }
  return 'office';
}

const FLAGSHIP_ITEMS: Record<string, DailyVitrinaEntry> = {
  "PE224-1": {
  "id": "pe224-1",
  "rank": 23,
  "sku": "PE224-1",
  "ean": "8435250996988",
  "catKey": "writing",
  "heroImage": "https://lh3.googleusercontent.com/d/1QMotsIU6khZ-Wx9d4vH9A2I2pxz1FQTL=w1200",
  "images": [
{
  "src": "https://lh3.googleusercontent.com/d/1pYsyOAVdUEF2lbFud7sOF_E6myl9Cx7F=w1200",
  "downloadUrl": "https://drive.google.com/uc?export=download&id=1pYsyOAVdUEF2lbFud7sOF_E6myl9Cx7F",
  "labelZh": "产品与包装展示",
  "labelEn": "Product and packaging",
  "labelEs": "Producto y envase"
},
    {
      "src": "https://lh3.googleusercontent.com/d/1QMotsIU6khZ-Wx9d4vH9A2I2pxz1FQTL=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1QMotsIU6khZ-Wx9d4vH9A2I2pxz1FQTL",
      "labelZh": "桌面平铺",
      "labelEn": "Desk flat-lay",
      "labelEs": "Vista cenital"
    },
    {
      "src": "https://lh3.googleusercontent.com/d/1JFZsBSwBka0hWzXuGizsHss-QtqnR2Q7=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1JFZsBSwBka0hWzXuGizsHss-QtqnR2Q7",
      "labelZh": "日常使用",
      "labelEn": "In use",
      "labelEs": "En uso"
    },
    {
      "src": "https://lh3.googleusercontent.com/d/1cYM7Q56NOXaQsVRxFMmMGucZLVULYlk5=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1cYM7Q56NOXaQsVRxFMmMGucZLVULYlk5",
      "labelZh": "场景陈列",
      "labelEn": "Product display",
      "labelEs": "Presentación"
    },
    {
      "src": "https://lh3.googleusercontent.com/d/10dTcfTD9KchxRqku1LhmRF_89BaWBlmF=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=10dTcfTD9KchxRqku1LhmRF_89BaWBlmF",
      "labelZh": "结构微距",
      "labelEn": "Detail macro",
      "labelEs": "Detalle macro"
    }
  ],
  "videos": [
    {
      "embedUrl": "https://drive.google.com/file/d/1LmNbJ91x1KY_uoPZWF0_6iDiCyGD1A2d/preview",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1LmNbJ91x1KY_uoPZWF0_6iDiCyGD1A2d",
      "titleZh": "中文门店选品介绍",
      "titleEn": "Chinese retail product introduction",
      "titleEs": "Presentación comercial en chino",
      "tagZh": "B2B中文",
      "tagEn": "B2B Chinese",
      "tagEs": "B2B chino"
    },
    {
      "embedUrl": "https://drive.google.com/file/d/161v1SfJOju8zyOwrUPWS5OyU-OQKRwna/preview",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=161v1SfJOju8zyOwrUPWS5OyU-OQKRwna",
      "titleZh": "西语日常使用介绍",
      "titleEn": "Spanish everyday use introduction",
      "titleEs": "Presentación de uso en español",
      "tagZh": "B2C西语",
      "tagEn": "B2C Spanish",
      "tagEs": "B2C español"
    }
  ],
  "packInfoZh": "2支/份 · 12份/包 · 324份/箱",
  "titleZh": "0.7mm蓝黑中性笔双支装",
  "taglineZh": "透明笔杆 · 螺纹握区 · 按动结构",
  "highlightsZh": [
    "蓝、黑两色搭配，适合日常记事",
    "0.7mm笔尖，按动伸缩",
    "透明笔杆与螺纹握区"
  ],
  "shareTextZh": "0.7mm蓝黑中性笔双支装 · 透明笔杆 · 螺纹握区 · 按动结构",
  "packInfoEn": "2 pens/set · 12 sets/pack · 324 sets/carton",
  "titleEn": "0.7 mm Gel Pens · Blue & Black Pair",
  "taglineEn": "Clear barrel · Ribbed grip · Retractable tip",
  "highlightsEn": [
    "Blue and black ink pair for daily notes",
    "Retractable 0.7 mm ballpoint",
    "Clear barrel with ribbed grip"
  ],
  "shareTextEn": "0.7 mm Gel Pens · Blue & Black Pair · Clear barrel · Ribbed grip · Retractable tip",
  "packInfoEs": "2 bolígrafos/juego · 12 juegos/pack · 324 juegos/caja",
  "titleEs": "Bolígrafos de gel 0,7 mm · azul y negro",
  "taglineEs": "Cuerpo transparente · Agarre estriado · Punta retráctil",
  "highlightsEs": [
    "Juego de tinta azul y negra para notas diarias",
    "Punta de 0,7 mm con mecanismo retráctil",
    "Cuerpo transparente y agarre estriado"
  ],
  "shareTextEs": "Bolígrafos de gel 0,7 mm · azul y negro · Cuerpo transparente · Agarre estriado · Punta retráctil"
},
  "PE140A-12": {
  "id": "pe140a-12",
  "rank": 24,
  "sku": "PE140A-12",
  "ean": "8435464149750",
  "catKey": "writing",
  "heroImage": "https://lh3.googleusercontent.com/d/13rpYsqN_AZWEMu93KgBT2i_qoOjRPLTw=w1200",
  "images": [
{
  "src": "https://lh3.googleusercontent.com/d/13vvw8A0RfENnzsX9M5_sD00ZdplYwaJR=w1200",
  "downloadUrl": "https://drive.google.com/uc?export=download&id=13vvw8A0RfENnzsX9M5_sD00ZdplYwaJR",
  "labelZh": "原包装",
  "labelEn": "Retail packaging",
  "labelEs": "Envase original"
},
    {
      "src": "https://lh3.googleusercontent.com/d/13rpYsqN_AZWEMu93KgBT2i_qoOjRPLTw=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=13rpYsqN_AZWEMu93KgBT2i_qoOjRPLTw",
      "labelZh": "桌面平铺",
      "labelEn": "Desk flat-lay",
      "labelEs": "Vista cenital"
    },
    {
      "src": "https://lh3.googleusercontent.com/d/1HRiGQK_IsW4X2rLjOGsxESVUUeJLwWA2=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1HRiGQK_IsW4X2rLjOGsxESVUUeJLwWA2",
      "labelZh": "日常使用",
      "labelEn": "In use",
      "labelEs": "En uso"
    },
    {
      "src": "https://lh3.googleusercontent.com/d/1kddd20dbpWX3Hkzl6DAoP0Zs_yQ_lC6u=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1kddd20dbpWX3Hkzl6DAoP0Zs_yQ_lC6u",
      "labelZh": "场景陈列",
      "labelEn": "Product display",
      "labelEs": "Presentación"
    },
    {
      "src": "https://lh3.googleusercontent.com/d/1QhlMBWucx_HZRNiR30mVqsQ6ORPejCrF=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1QhlMBWucx_HZRNiR30mVqsQ6ORPejCrF",
      "labelZh": "结构微距",
      "labelEn": "Detail macro",
      "labelEs": "Detalle macro"
    }
  ],
  "videos": [
    {
      "embedUrl": "https://drive.google.com/file/d/1MnxsDdCp9P6K28yumS9XEVm2uHwD9gu3/preview",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1MnxsDdCp9P6K28yumS9XEVm2uHwD9gu3",
      "titleZh": "中文门店选品介绍",
      "titleEn": "Chinese retail product introduction",
      "titleEs": "Presentación comercial en chino",
      "tagZh": "B2B中文",
      "tagEn": "B2B Chinese",
      "tagEs": "B2B chino"
    },
    {
      "embedUrl": "https://drive.google.com/file/d/1DO97twNQ1lf-NMaV8Rc1TCmiYisXX9kU/preview",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1DO97twNQ1lf-NMaV8Rc1TCmiYisXX9kU",
      "titleZh": "西语日常使用介绍",
      "titleEn": "Spanish everyday use introduction",
      "titleEs": "Presentación de uso en español",
      "tagZh": "B2C西语",
      "tagEn": "B2C Spanish",
      "tagEs": "B2C español"
    }
  ],
  "packInfoZh": "12支/份 · 12份/包 · 144份/箱",
  "titleZh": "1.0mm蓝色圆珠笔12支装",
  "taglineZh": "透明笔杆 · 深蓝握套 · 按动式",
  "highlightsZh": [
    "12支蓝色圆珠笔，供日常书写使用",
    "1.0mm笔尖与按动结构",
    "透明笔杆，深蓝握套和塑料笔夹"
  ],
  "shareTextZh": "1.0mm蓝色圆珠笔12支装 · 透明笔杆 · 深蓝握套 · 按动式",
  "packInfoEn": "12 pens/set · 12 sets/pack · 144 sets/carton",
  "titleEn": "1.0 mm Blue Ballpoint Pens · Set of 12",
  "taglineEn": "Clear barrel · Navy grip · Retractable",
  "highlightsEn": [
    "Twelve blue ballpoints for daily writing",
    "1.0 mm retractable tips",
    "Clear barrel, navy grip and plastic clip"
  ],
  "shareTextEn": "1.0 mm Blue Ballpoint Pens · Set of 12 · Clear barrel · Navy grip · Retractable",
  "packInfoEs": "12 bolígrafos/juego · 12 juegos/pack · 144 juegos/caja",
  "titleEs": "Bolígrafos azules 1,0 mm · 12 unidades",
  "taglineEs": "Cuerpo transparente · Agarre azul · Retráctil",
  "highlightsEs": [
    "Doce bolígrafos azules para escritura diaria",
    "Puntas de 1,0 mm retráctiles",
    "Cuerpo transparente, agarre azul y clip de plástico"
  ],
  "shareTextEs": "Bolígrafos azules 1,0 mm · 12 unidades · Cuerpo transparente · Agarre azul · Retráctil"
},
  "PP633-1": {
  "id": "pp633-1",
  "rank": 25,
  "sku": "PP633-1",
  "ean": "8435250985210",
  "catKey": "art",
  "heroImage": "https://lh3.googleusercontent.com/d/1M6M1SmM2k46qykABZTQLlxqgZQOJLpi-=w1200",
  "images": [
{
  "src": "https://lh3.googleusercontent.com/d/1I9MRNQYh-PuwGU-Fg1xYhNOW7i_edurk=w1200",
  "downloadUrl": "https://drive.google.com/uc?export=download&id=1I9MRNQYh-PuwGU-Fg1xYhNOW7i_edurk",
  "labelZh": "产品与包装展示",
  "labelEn": "Product and packaging",
  "labelEs": "Producto y envase"
},
    {
      "src": "https://lh3.googleusercontent.com/d/1M6M1SmM2k46qykABZTQLlxqgZQOJLpi-=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1M6M1SmM2k46qykABZTQLlxqgZQOJLpi-",
      "labelZh": "桌面平铺",
      "labelEn": "Desk flat-lay",
      "labelEs": "Vista cenital"
    },
    {
      "src": "https://lh3.googleusercontent.com/d/1H8R12ExnSCUneuzzQNXacjXwzwXhyFSA=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1H8R12ExnSCUneuzzQNXacjXwzwXhyFSA",
      "labelZh": "日常使用",
      "labelEn": "In use",
      "labelEs": "En uso"
    },
    {
      "src": "https://lh3.googleusercontent.com/d/1ZptB5iO0K3fOY04BPk2coYvx8WfF0qwh=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1ZptB5iO0K3fOY04BPk2coYvx8WfF0qwh",
      "labelZh": "场景陈列",
      "labelEn": "Product display",
      "labelEs": "Presentación"
    },
    {
      "src": "https://lh3.googleusercontent.com/d/1frLtirTeSm6L2a2FaBM_Ac7rHkZP3Cvo=w1200",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1frLtirTeSm6L2a2FaBM_Ac7rHkZP3Cvo",
      "labelZh": "结构微距",
      "labelEn": "Detail macro",
      "labelEs": "Detalle macro"
    }
  ],
  "videos": [
    {
      "embedUrl": "https://drive.google.com/file/d/1rnV30T1bFIByaBJ9mHG1TRjsSlEdbB1s/preview",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1rnV30T1bFIByaBJ9mHG1TRjsSlEdbB1s",
      "titleZh": "中文门店选品介绍",
      "titleEn": "Chinese retail product introduction",
      "titleEs": "Presentación comercial en chino",
      "tagZh": "B2B中文",
      "tagEn": "B2B Chinese",
      "tagEs": "B2B chino"
    },
    {
      "embedUrl": "https://drive.google.com/file/d/1JaUdWWWGKomNOLVwK6ILnP800Dqmmf14/preview",
      "downloadUrl": "https://drive.google.com/uc?export=download&id=1JaUdWWWGKomNOLVwK6ILnP800Dqmmf14",
      "titleZh": "西语日常使用介绍",
      "titleEn": "Spanish everyday use introduction",
      "titleEs": "Presentación de uso en español",
      "tagZh": "B2C西语",
      "tagEn": "B2C Spanish",
      "tagEs": "B2C español"
    }
  ],
  "packInfoZh": "75ml/支 · 6支/包 · 96支/箱",
  "titleZh": "Artix金属金色丙烯颜料75ml",
  "taglineZh": "金属金色 · 软管包装 · 画笔创作",
  "highlightsZh": [
    "金属金色丙烯颜料，适合绘画与手工创作",
    "75ml软管，挤入调色盘后用画笔上色",
    "黑金包装，带挂孔封口"
  ],
  "shareTextZh": "Artix金属金色丙烯颜料75ml · 金属金色 · 软管包装 · 画笔创作",
  "packInfoEn": "75 ml/tube · 6 tubes/pack · 96 tubes/carton",
  "titleEn": "Artix Metallic Gold Acrylic Paint · 75 ml",
  "taglineEn": "Metallic gold · Squeeze tube · Brush painting",
  "highlightsEn": [
    "Metallic gold acrylic for painting and craft projects",
    "75 ml tube; dispense onto a palette and use a brush",
    "Black-and-gold packaging with hanging slot"
  ],
  "shareTextEn": "Artix Metallic Gold Acrylic Paint · 75 ml · Metallic gold · Squeeze tube · Brush painting",
  "packInfoEs": "75 ml/tubo · 6 tubos/pack · 96 tubos/caja",
  "titleEs": "Pintura acrílica Artix oro metalizado · 75 ml",
  "taglineEs": "Oro metalizado · Tubo flexible · Pintura con pincel",
  "highlightsEs": [
    "Acrílico oro metalizado para pintura y manualidades",
    "Tubo de 75 ml; aplica con pincel desde la paleta",
    "Envase negro y dorado con orificio para colgar"
  ],
  "shareTextEs": "Pintura acrílica Artix oro metalizado · 75 ml · Oro metalizado · Tubo flexible · Pintura con pincel"
},
  PP948: {
    id: 'pp948',
    rank: 0,
    sku: 'PP948-1 / PP948-2 / PP948-3',
    ean: '8435721054384',
    catKey: 'art',
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
    heroImage: "https://lh3.googleusercontent.com/d/13vvw8A0RfENnzsX9M5_sD00ZdplYwaJR=w1200",
    images: [
{
  "src": "https://lh3.googleusercontent.com/d/1T7JAd6snTKUVKnHQAbBdgmDhmjLereNS=w1200",
  "downloadUrl": "https://drive.google.com/uc?export=download&id=1T7JAd6snTKUVKnHQAbBdgmDhmjLereNS",
  "labelZh": "12色与原盒",
  "labelEn": "12 colours and original box",
  "labelEs": "12 colores y caja original"
},
      {
        src: gdImg('1vHb77nyphoS6AAU_J-KEj6ELtU9_OTFD'),
        downloadUrl: gdDl('1vHb77nyphoS6AAU_J-KEj6ELtU9_OTFD'),
        labelZh: '西班牙消费者上镜展示 1',
        labelEn: 'Spanish Creator Showcase 1',
        labelEs: 'Creadora en España 1',
      },
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
        src: gdImg('1t9FUX4-HwUFYSl3AhjFWSAJvdz2cL7UU'),
        downloadUrl: gdDl('1t9FUX4-HwUFYSl3AhjFWSAJvdz2cL7UU'),
        labelZh: '西班牙消费者上镜展示 2',
        labelEn: 'Spanish Creator Showcase 2',
        labelEs: 'Creadora en España 2',
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
      '最近店里走得特别快的一款直液丙烯软头笔，型号 PP948，12、24、36色都齐。\n' +
      '不用摇也不用按压，直接在石头、黑卡纸、牛仔布、木片或者水壶上画，遮盖力很强，干透之后碰水也不花。\n' +
      '盒面自带使用效果图，挂在文具区很吸引人，有需要备货的老板随时联系。',
    shareTextEn:
      'Loving how versatile these MP* PP948 acrylic brush markers are. Smooth liquid-ink flow, rich coverage even on black paper, stone, denim, and ceramic, and waterproof once dry.',
    shareTextEs:
      'Así quedan los rotuladores acrílicos punta pincel MP* PP948 sobre piedra, madera, tela vaquera o cerámica negra. Tinta fluida, súper cubriente y resistente al agua al secar.',
  },
  PE517: {
    id: 'pe517',
    rank: 8,
    sku: 'PE517',
    ean: '8435250904600',
    catKey: 'writing',
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
      '这两年学生和办公族都偏爱柔和一点的色调，这款 MP* PE517 马卡龙六色荧光笔一直很稳。\n' +
      '斜头 1 到 3 毫米，划重点或者勾细线都顺手，水性墨水不透纸背，长期看笔记不刺眼，整板 6 支装陈列很醒目。',
    shareTextEn:
      'Soft pastel highlighters that make study notes much easier on the eyes. MP* PE517 comes in 6 calm shades with a 1–3 mm chisel tip and clean no-bleed ink.',
    shareTextEs:
      'Seis tonos pastel suaves que no cansan la vista y dejan los apuntes súper limpios. Punta biselada de 1 a 3 mm y tinta al agua que no traspasa el papel.',
  },
  'PP631-01': {
    id: 'pp631-01',
    rank: 1,
    sku: 'PP631-01',
    ean: '8435250982110',
    catKey: 'art',
    packInfoZh: '75 ml 钛白丙烯颜料 ｜ 6 支/包 · 96 支/箱',
    packInfoEn: '75 ml Titanium White Acrylic ｜ 6 tubes/pack · 96 tubes/carton',
    packInfoEs: 'Pintura Acrílica Blanca 75 ml ｜ 6 uds/pack · 96 uds/caja',
    titleZh: 'Artix 专业丙烯颜料 75 ml 钛白色',
    titleEn: 'Artix Paints Titanium White Acrylic 75 ml',
    titleEs: 'Pintura Acrílica Blanca Titanio 75 ml Artix',
    taglineZh: 'TOP 1 冠军单品 · 高浓度奶油膏体 · 缎面哑光 · 干后防水耐晒',
    taglineEn: '#1 Bestseller · Rich creamy body · Satin-matte finish · Waterproof once dry',
    taglineEs: 'Top #1 en ventas · Textura cremosa cubriente · Acabado satinado · Impermeable',
    highlightsZh: [
      '西班牙畅销榜第 1 名单品，深色画布一笔高遮盖不发灰',
      '奶油级厚涂质感，画笔平涂与刮刀肌理都能轻松驾驭',
      '6支一包、96支一箱，美术生、画室与百元店高频复购常青款',
    ],
    highlightsEn: [
      '#1 bestselling fine-arts SKU: high-opacity white over dark canvas',
      'Thick creamy impasto body ideal for both brush and palette knife',
      'Fast-drying waterproof satin finish; wholesale pack 6 / carton 96',
    ],
    highlightsEs: [
      'Referencia #1 en ventas: blanco titanio de alta opacidad sobre fondos oscuros',
      'Cuerpo cremoso ideal para pincel y textura con espátula',
      'Secado rápido e impermeable al secar; 6 uds/pack · 96 uds/caja',
    ],
    heroImage: gdImg('1tWtiTQan2oLZRHurc6jeq4WIvIW2RsIr'),
    images: [
      {
        src: gdImg('1tWtiTQan2oLZRHurc6jeq4WIvIW2RsIr'),
        downloadUrl: gdDl('1tWtiTQan2oLZRHurc6jeq4WIvIW2RsIr'),
        labelZh: '俯拍画室调色盘与75ml开盖场景',
        labelEn: 'Studio flat-lay with wooden palette',
        labelEs: 'Vista cenital con paleta de madera',
      },
      {
        src: gdImg('1U-6EHUl5cqwNH8Mlcp0oUMi6MjhK16Wc'),
        downloadUrl: gdDl('1U-6EHUl5cqwNH8Mlcp0oUMi6MjhK16Wc'),
        labelZh: '手持挤出奶油膏体与深蓝画布上色',
        labelEn: 'Squeezing creamy white onto palette',
        labelEs: 'Aplicando blanco sobre lienzo oscuro',
      },
      {
        src: gdImg('1X9Ctv-sn9AVx5dlqR8SnVmEflPUd-tEi'),
        downloadUrl: gdDl('1X9Ctv-sn9AVx5dlqR8SnVmEflPUd-tEi'),
        labelZh: '画架成品与陶罐画笔桌景陈列',
        labelEn: 'Tabletop easel & studio setup',
        labelEs: 'Caballete de estudio y acabado',
      },
      {
        src: gdImg('1L-Xeonqmtzi-nmYBQCWNSYI0i7tCk_0e'),
        downloadUrl: gdDl('1L-Xeonqmtzi-nmYBQCWNSYI0i7tCk_0e'),
        labelZh: '黑底刮刀厚涂遮盖力微距',
        labelEn: 'Palette knife opacity macro',
        labelEs: 'Macro de opacidad con espátula',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1OK3vXbDv-AuMZBt4MK04H_Bbr6w9nKz6'),
        downloadUrl: gdDl('1OK3vXbDv-AuMZBt4MK04H_Bbr6w9nKz6'),
        titleZh: '百元店选品短剧《第一名白色丙烯》',
        titleEn: 'B2B Retail Short: #1 White Acrylic',
        titleEs: 'Corto B2B: El blanco acrílico #1',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1VNuoiIL1F3mY2cc8n1prZZ1H5irpT18A'),
        downloadUrl: gdDl('1VNuoiIL1F3mY2cc8n1prZZ1H5irpT18A'),
        titleZh: '西班牙语美术种草短剧《一笔高遮盖》',
        titleEn: 'Consumer Spot: High Opacity White',
        titleEs: 'Spot España: Blanco Titanio Artix',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '画室和美术生日常消耗最大的就是白色丙烯。这款 Artix PP631-01 75ml 钛白色膏体很厚实，刷在深色画布上一笔就能盖住，干后防水耐晒，销量一直排在前面。',
    shareTextEn:
      'A reliable studio staple: Artix PP631-01 Titanium White Acrylic in 75 ml. Rich creamy body with strong opacity over dark canvas and a waterproof satin finish.',
    shareTextEs:
      'Un básico imprescindible de estudio: Acrílico Blanco Titanio 75 ml Artix PP631-01. Textura cremosa de alta opacidad sobre fondos oscuros y secado resistente al agua.',
  },
  'PE486-1': {
    id: 'pe486-1',
    rank: 2,
    sku: 'PE486-1',
    ean: '8435250993307',
    catKey: 'writing',
    packInfoZh: '单支吸塑永不干涸黑色记号笔 ｜ 12 支/包 · 480 支/箱',
    packInfoEn: 'No-Dry Black Permanent Marker ｜ 12 pcs/pack · 480 pcs/carton',
    packInfoEs: 'Marcador Permanente No Dry Negro ｜ 12 uds/pack · 480 uds/caja',
    titleZh: 'MP* 永不干涸黑色永久记号笔',
    titleEn: 'MP* No-Dry Black Permanent Marker',
    titleEs: 'MP* Marcador Permanente Negro No Dry',
    taglineZh: 'TOP 2 爆款 · 防干笔头配方 · 纸箱/塑料/金属/玻璃全通吃 · 速干防水',
    taglineEn: 'Top #2 Bestseller · Cap-off No-Dry ink · Cardboard, plastic, metal & glass · Waterproof',
    taglineEs: 'Top #2 en ventas · Tinta No Dry · Cartón, plástico, metal y vidrio · Resistente al agua',
    highlightsZh: [
      '西班牙畅销榜第 2 名，防干笔头久置开盖不易干涸',
      '快递纸箱、塑料袋、玻璃瓶、金属盒都能清晰书写，遇水不晕染',
      '12支/包、480支/箱，仓库打包、百元店与家庭日常刚需单品',
    ],
    highlightsEn: [
      '#2 bestselling marker: No-Dry formula resists drying out if left uncapped',
      'Writes bold crisp black on cardboard, plastic bags, glass & metal',
      'Instant-dry waterproof ink; wholesale 12 pcs/pack, 480 pcs/carton',
    ],
    highlightsEs: [
      'Top #2 en ventas: fórmula No Dry que aguanta destapado sin secarse',
      'Escribe negro intenso sobre cartón, plástico, vidrio y metal',
      'Secado rápido resistente al agua; 12 uds/pack · 480 uds/caja',
    ],
    heroImage: gdImg('1Lopdshh_l0oZPbQvIR0Bz3xJfiAdcJyn'),
    images: [
      {
        src: gdImg('1Lopdshh_l0oZPbQvIR0Bz3xJfiAdcJyn'),
        downloadUrl: gdDl('1Lopdshh_l0oZPbQvIR0Bz3xJfiAdcJyn'),
        labelZh: '仓库桌面平铺与标签书写场景',
        labelEn: 'Warehouse desk flat-lay & labels',
        labelEs: 'Mesa de almacén y etiquetas',
      },
      {
        src: gdImg('1g0rYFwA1NouMZp8Bj58bBKOV8SxrNfCw'),
        downloadUrl: gdDl('1g0rYFwA1NouMZp8Bj58bBKOV8SxrNfCw'),
        labelZh: '手持纸箱与塑料袋编号实写',
        labelEn: 'Writing on cardboard & plastic pouch',
        labelEs: 'Rotulando cajas y bolsas plásticas',
      },
      {
        src: gdImg('1jKGY5HsSKQdr4gdzTZANyHqV0ckZTZtK'),
        downloadUrl: gdDl('1jKGY5HsSKQdr4gdzTZANyHqV0ckZTZtK'),
        labelZh: '玻璃瓶/铁盒/木牌/塑料多材质展示',
        labelEn: 'Glass, metal tin, wood & plastic showcase',
        labelEs: 'Vidrio, metal, madera y plástico',
      },
      {
        src: gdImg('1BQKwgfVirnocfGwpyb774GfHhlePjPxf'),
        downloadUrl: gdDl('1BQKwgfVirnocfGwpyb774GfHhlePjPxf'),
        labelZh: '纤维笔头黑亮墨迹防水珠微距',
        labelEn: 'Waterproof ink & tip macro',
        labelEs: 'Macro punta resistente al agua',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1awjj3wwexzwpALpQild5huJwAZSJEjJc'),
        downloadUrl: gdDl('1awjj3wwexzwpALpQild5huJwAZSJEjJc'),
        titleZh: '百元店选品短剧《永不干涸记号笔》',
        titleEn: 'B2B Retail Short: No-Dry Marker',
        titleEs: 'Corto B2B: Marcador No Dry PE486-1',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1OTFXm7i-by1xmxjYTTdlZ59YxY5n3rLh'),
        downloadUrl: gdDl('1OTFXm7i-by1xmxjYTTdlZ59YxY5n3rLh'),
        titleZh: '西班牙语多材质短剧《一笔搞定包装》',
        titleEn: 'Consumer Spot: Multi-Surface Marker',
        titleEs: 'Spot España: Permanente No Dry PE486-1',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '门店、仓库打包最怕记号笔忘盖帽就干了。这款 MP* PE486-1 永不干涸黑色记号笔开盖放置也很耐用，纸箱、塑料袋、玻璃和铁盒上都能一笔黑亮快干，遇水不糊。',
    shareTextEn:
      'Everyday warehouse and shop essential: MP* PE486-1 No-Dry Black Permanent Marker. Writes bold waterproof black on cardboard, plastic, metal, and glass without drying out.',
    shareTextEs:
      'Imprescindible en almacén y tienda: marcador permanente MP* PE486-1 No Dry. Negro intenso de secado rápido y resistente al agua sobre cartón, plástico, vidrio y metal.',
  },
  'PP162-01': {
    id: 'pp162-01',
    rank: 3,
    sku: 'PP162-01',
    ean: '8435250994441',
    catKey: 'art',
    packInfoZh: '6色经典水粉颜料 ｜ 6 盒/包 · 72 盒/箱',
    packInfoEn: '6 Classic Tempera Paint Pots ｜ 6 sets/pack · 72 sets/carton',
    packInfoEs: 'Témpera 6 Colores Clásicos ｜ 6 uds/pack · 72 uds/caja',
    titleZh: 'MP* 6色经典水粉颜料套装',
    titleEn: 'MP* Tempera 6 Classic Colors Paint Set',
    titleEs: 'MP* Témpera 6 Colores Clásicos',
    taglineZh: 'TOP 3 爆款 · 红黄蓝绿黑白 6 大正色 · 细腻易洗 · 学校手工刚需',
    taglineEn: 'Top #3 Bestseller · 6 classic primary shades · Smooth & washable · School favorite',
    taglineEs: 'Top #3 en ventas · 6 colores clásicos cubrientes · Lavable con agua · Uso escolar',
    highlightsZh: [
      '西班牙畅销榜第 3 名，红黄蓝绿黑白 6 大高频正色一盒配齐',
      '水粉膏体细腻顺滑、色彩饱满，水溶性配方沾手衣物易清洗',
      '6盒/包、72盒/箱，返校季与日常儿童手作区高周转常青单品',
    ],
    highlightsEn: [
      '#3 bestselling school & craft SKU with 6 vibrant classic colors',
      'Smooth opaque tempera texture that washes easily with water',
      'Wholesale pack 6 sets/pack · 72 sets/carton for fast retail turnover',
    ],
    highlightsEs: [
      'Top #3 escolar y manualidades con 6 tonos clásicos muy cubrientes',
      'Textura suave lista para pincel y lavable fácilmente con agua',
      'Formato mayorista: 6 uds/pack · 72 uds/caja',
    ],
    heroImage: gdImg('16k6gFuUM0HiBB1SaJYB7DnB48U2q1zxF'),
    images: [
      {
        src: gdImg('16k6gFuUM0HiBB1SaJYB7DnB48U2q1zxF'),
        downloadUrl: gdDl('16k6gFuUM0HiBB1SaJYB7DnB48U2q1zxF'),
        labelZh: '俯拍手工桌6色水粉与调色盘',
        labelEn: 'Overhead craft desk flat-lay',
        labelEs: 'Vista cenital mesa creativa',
      },
      {
        src: gdImg('1FAHwsaFCWzm81DNMCfwDERYyg9_dDzaZ'),
        downloadUrl: gdDl('1FAHwsaFCWzm81DNMCfwDERYyg9_dDzaZ'),
        labelZh: '手持蘸取红色颜料彩绘场景',
        labelEn: 'Dipping brush & painting flowers',
        labelEs: 'Pintando con pincel en papel',
      },
      {
        src: gdImg('1ZQYdZYtCwyoRJb8lZ0-B5pLbPUTL-nhg'),
        downloadUrl: gdDl('1ZQYdZYtCwyoRJb8lZ0-B5pLbPUTL-nhg'),
        labelZh: '画室桌面包装与木艺成品陈列',
        labelEn: 'Studio display with painted crafts',
        labelEs: 'Exposición en taller escolar',
      },
      {
        src: gdImg('194YHcsDhImyEGVobS5zqkMnxk_DjVeHW'),
        downloadUrl: gdDl('194YHcsDhImyEGVobS5zqkMnxk_DjVeHW'),
        labelZh: '四原色厚实哑光笔触微距',
        labelEn: 'Velvet matte pigment macro',
        labelEs: 'Macro textura mate cubriente',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('10Aaovm2Zd0H2MyTXaJPsLKKC3QcU9IYp'),
        downloadUrl: gdDl('10Aaovm2Zd0H2MyTXaJPsLKKC3QcU9IYp'),
        titleZh: '百元店选品短剧《六色经典水粉》',
        titleEn: 'B2B Retail Short: #3 Tempera Set',
        titleEs: 'Corto B2B: Témpera Clásica PP162-01',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1AnCxws1Qu7ydQFqHb4MYgb3qVQrDpO_Y'),
        downloadUrl: gdDl('1AnCxws1Qu7ydQFqHb4MYgb3qVQrDpO_Y'),
        titleZh: '西班牙语校园种草短剧《水粉色彩》',
        titleEn: 'Consumer Spot: Washable Tempera',
        titleEs: 'Spot España: Témperas MP* PP162-01',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '学校美术课和小朋友在家画画都很实用的一盒 6 色水粉颜料，型号 PP162-01。\n' +
      '红黄蓝绿黑白六大经典正色，膏体细腻容易调色，水溶性配方沾到手上也很好洗。',
    shareTextEn:
      'Classic 6-color tempera set MP* PP162-01 for school and kids crafts. Smooth opaque colors that wash off easily with water.',
    shareTextEs:
      'Témperas escolares MP* PP162-01 en los 6 colores clásicos. Textura suave muy cubriente y lavable fácilmente con agua.',
  },
  PE411: {
    id: 'pe411',
    rank: 4,
    sku: 'PE411',
    ean: '8435464171973',
    catKey: 'writing',
    packInfoZh: '细头黑色 CD/塑料记号笔 ｜ 18 支/包 · 432 支/箱',
    packInfoEn: 'Fine-Tip Black CD & Plastic Marker ｜ 18 pcs/pack · 432 pcs/carton',
    packInfoEs: 'Marcador CD Punta Fina Negro ｜ 18 uds/pack · 432 uds/caja',
    titleZh: 'MP* 细头黑色 CD 永久记号笔',
    titleEn: 'MP* Fine-Tip Black CD & Plastic Marker',
    titleEs: 'MP* Marcador CD Punta Fina Negro',
    taglineZh: 'TOP 4 爆款 · 精密金属包头细笔尖 · 速干防水 · 光盘/塑料袋/标签专用',
    taglineEn: 'Top #4 Bestseller · Precision fine needle tip · Quick-dry waterproof on discs & plastic',
    taglineEs: 'Top #4 en ventas · Punta fina precisa · Secado rápido resistente al agua',
    highlightsZh: [
      '西班牙畅销榜第 4 名，细字精准不糊边，小标签与光盘书写清晰利落',
      '光盘、透明文件袋、玻璃器皿、PVC 卡片与塑料包装袋一笔附着',
      '18支/包、432支/箱，办公文具柜台与百元店收银台高频补货单品',
    ],
    highlightsEn: [
      '#4 bestselling fine-tip permanent marker for crisp small labels',
      'Instant-dry waterproof black ink safe for optical discs & glossy plastic',
      'Wholesale pack 18 pcs/pack · 432 pcs/carton',
    ],
    highlightsEs: [
      'Top #4 en ventas: punta fina ideal para rotular etiquetas pequeñas y CDs',
      'Tinta negra permanente de secado instantáneo y resistente al agua',
      'Formato mayorista: 18 uds/pack · 432 uds/caja',
    ],
    heroImage: gdImg('1oh_NGUNHjcsVYvh1_OmNWDqZY7GIdUyO'),
    images: [
      {
        src: gdImg('1oh_NGUNHjcsVYvh1_OmNWDqZY7GIdUyO'),
        downloadUrl: gdDl('1oh_NGUNHjcsVYvh1_OmNWDqZY7GIdUyO'),
        labelZh: '俯拍办公桌面与光盘档案袋标注',
        labelEn: 'Overhead office desk flat-lay',
        labelEs: 'Mesa de oficina y archivos',
      },
      {
        src: gdImg('12TaGXayVLpFcyKOJXFdIOVd5nZ4RGt2O'),
        downloadUrl: gdDl('12TaGXayVLpFcyKOJXFdIOVd5nZ4RGt2O'),
        labelZh: '手持细笔头光盘与透明袋实写',
        labelEn: 'Fine-tip labeling on disc & sleeve',
        labelEs: 'Rotulando CD y funda plástica',
      },
      {
        src: gdImg('1inztH9VFRWE31fWQVS1_i9Vowmv1Iyc-'),
        downloadUrl: gdDl('1inztH9VFRWE31fWQVS1_i9Vowmv1Iyc-'),
        labelZh: '玻璃瓶/PVC卡/拉链袋多材质展示',
        labelEn: 'Glass, PVC card & zip pouch showcase',
        labelEs: 'Vidrio, tarjeta PVC y bolsa zip',
      },
      {
        src: gdImg('1MFrVk1KqtRhT4DfhYJ7ejonkO_2K5167'),
        downloadUrl: gdDl('1MFrVk1KqtRhT4DfhYJ7ejonkO_2K5167'),
        labelZh: '精密细头防水细线微距实测',
        labelEn: 'Fine needle tip waterproof macro',
        labelEs: 'Macro punta fina resistente al agua',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1i9X9eiyLZvvAIDAKxyKiUaVWqUlWun_Q'),
        downloadUrl: gdDl('1i9X9eiyLZvvAIDAKxyKiUaVWqUlWun_Q'),
        titleZh: '百元店选品短剧《细头 CD 记号笔》',
        titleEn: 'B2B Retail Short: #4 Fine CD Marker',
        titleEs: 'Corto B2B: Marcador CD PE411',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1DBemJWZPm85jj6YjkP5d0BxMIsrZQQvO'),
        downloadUrl: gdDl('1DBemJWZPm85jj6YjkP5d0BxMIsrZQQvO'),
        titleZh: '西班牙语办公种草短剧《精细标注》',
        titleEn: 'Consumer Spot: Precision Marker',
        titleEs: 'Spot España: Precisión PE411',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '写光盘、文件袋或者小标签时最需要细头记号笔。这款 MP* PE411 笔尖精细不糊边，写完即干还不怕沾水。',
    shareTextEn:
      'Fine-tip permanent marker MP* PE411 for clean labeling on optical discs, plastic sleeves, and small tags. Quick-dry and waterproof.',
    shareTextEs:
      'Marcador de punta fina MP* PE411 ideal para rotular discos, fundas de plástico y etiquetas pequeñas con trazo limpio y secado rápido.',
  },
  'PA457-04': {
    id: 'pa457-04',
    rank: 5,
    sku: 'PA457-04',
    ean: '8435721028569',
    catKey: 'office',
    packInfoZh: '5mm × 20m 加长修正带 ｜ 12 个/包 · 288 个/箱',
    packInfoEn: '5mm × 20m Long Correction Tape ｜ 12 pcs/pack · 288 pcs/carton',
    packInfoEs: 'Corrector de Cinta 5mm × 20m ｜ 12 uds/pack · 288 uds/caja',
    titleZh: 'MP* 5mm × 20m 超长容量修正带',
    titleEn: 'MP* 5mm × 20m Long-Life Correction Tape',
    titleEs: 'MP* Corrector de Cinta 5mm × 20m',
    taglineZh: 'TOP 5 爆款 · 20 米超长容量 · 顺滑不卡带 · 即涂即写无等待',
    taglineEn: 'Top #5 Bestseller · 20m extra-long tape · Smooth jam-free glide · Instant rewrite',
    taglineEs: 'Top #5 en ventas · Cinta larga de 20m · Deslizamiento suave sin atascos · Escritura inmediata',
    highlightsZh: [
      '20 米加长带芯，单只抵普通修正带两倍以上用量，高年级与办公高频消耗王',
      '高遮盖哑光白带，覆盖清晰不反光，复印扫描不留黑影',
      '12个/包、288个/箱，百元店与传统书店常年热销走量单品',
    ],
    highlightsEn: [
      'Extra-long 20m tape delivers over double the lifespan of standard dispensers',
      'Clean matte-white opaque strip dries instantly with zero shadow on photocopies',
      'Wholesale pack 12 pcs/pack · 288 pcs/carton',
    ],
    highlightsEs: [
      'Cinta extralarga de 20 metros con más del doble de duración que los modelos estándar',
      'Cobertura blanca opaca de secado instantáneo, ideal para escribir encima al segundo',
      'Formato mayorista: 12 uds/pack · 288 uds/caja',
    ],
    heroImage: gdImg('1rtJgbtz2DZPjuw6qLjdyA-2g-2SYG7Xt'),
    images: [
      {
        src: gdImg('1rtJgbtz2DZPjuw6qLjdyA-2g-2SYG7Xt'),
        downloadUrl: gdDl('1rtJgbtz2DZPjuw6qLjdyA-2g-2SYG7Xt'),
        labelZh: '书桌日常学习实景摆拍',
        labelEn: 'Study desk flat-lay',
        labelEs: 'Mesa de estudio y apuntes',
      },
      {
        src: gdImg('1F8yleq4BPHIEBS-XD3VjGTXvjHE_IVyo'),
        downloadUrl: gdDl('1F8yleq4BPHIEBS-XD3VjGTXvjHE_IVyo'),
        labelZh: '透明机身顺滑结构展示',
        labelEn: 'Translucent dispenser showcase',
        labelEs: 'Cuerpo translúcido y cinta de 20m',
      },
      {
        src: gdImg('1rhdboJp-boS3ChzPm3Pt_VOo46hZBtF1'),
        downloadUrl: gdDl('1rhdboJp-boS3ChzPm3Pt_VOo46hZBtF1'),
        labelZh: '学生手写笔记顺滑修正实拍',
        labelEn: 'Smooth correction on spiral notebook',
        labelEs: 'Aplicación suave sobre cuaderno',
      },
      {
        src: gdImg('1tWI0XWD5KtawTIHavaj-maF2Fkxm5wVS'),
        downloadUrl: gdDl('1tWI0XWD5KtawTIHavaj-maF2Fkxm5wVS'),
        labelZh: '滚轮压头与白带覆盖微距',
        labelEn: 'Precision roller tip macro',
        labelEs: 'Macro punta aplicadora y cobertura',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1yxhlgUV9odBw-To-nDZEg0_i8Ls2D-2H'),
        downloadUrl: gdDl('1yxhlgUV9odBw-To-nDZEg0_i8Ls2D-2H'),
        titleZh: '百元店选品短剧《20米超长修正带》',
        titleEn: 'B2B Retail Short: #5 20m Correction Tape',
        titleEs: 'Corto B2B: Corrector 20m PA457-04',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1a9MPolEwaCRDfCx3k9pSvNOOyUAQIe-3'),
        downloadUrl: gdDl('1a9MPolEwaCRDfCx3k9pSvNOOyUAQIe-3'),
        titleZh: '西班牙语校园种草短剧《顺滑修正》',
        titleEn: 'Consumer Spot: Smooth 20m Correction',
        titleEs: 'Spot España: Corrector PA457-04',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '学生刷题和办公室改错最怕修正带总用完或卡带。这款 MP* PA457-04 有整整 20 米加长带芯，涂上去平整服帖，马上就能覆盖写字。',
    shareTextEn:
      'MP* PA457-04 20m extra-long correction tape glides smoothly over notes and lets you rewrite immediately without smudging.',
    shareTextEs:
      'Corrector de cinta extralarga MP* PA457-04 de 5mm x 20m: deslizamiento suave, cobertura limpia y escritura inmediata sin esperas.',
  },
  PA137: {
    id: 'pa137',
    rank: 7,
    sku: 'PA137',
    ean: '8435250939879',
    catKey: 'office',
    packInfoZh: '5mm × 8m 便携修正带 ｜ 12 个/包 · 336 个/箱',
    packInfoEn: '5mm × 8m Compact Correction Tape ｜ 12 pcs/pack · 336 pcs/carton',
    packInfoEs: 'Corrector de Cinta 5mm × 8m ｜ 12 uds/pack · 336 uds/caja',
    titleZh: 'MP* 5mm × 8m 经典便携修正带',
    titleEn: 'MP* 5mm × 8m Compact Correction Tape',
    titleEs: 'MP* Corrector de Cinta 5mm × 8m',
    taglineZh: 'TOP 7 爆款 · 轻巧入笔袋 · 顺滑不卡带 · 西班牙校园常青款',
    taglineEn: 'Top #7 Bestseller · Pocket & pencil-case sized · Smooth clean tape · School staple',
    taglineEs: 'Top #7 en ventas · Formato compacto para estuche · Cinta suave sin cortes',
    highlightsZh: [
      '小巧轻便机身，轻松放进学生笔袋与随身文具盒，中小学开学必配款',
      '5mm 标准宽度适配西班牙方格作业本，贴合不翘边，干爽即写',
      '12个/包、336个/箱，收银台边和学生区连带率极高的高频单品',
    ],
    highlightsEn: [
      'Compact ergonomic body fits easily into any school pencil case',
      'Standard 5mm tape width matches European ruled and grid notebooks',
      'Wholesale pack 12 pcs/pack · 336 pcs/carton',
    ],
    highlightsEs: [
      'Diseño compacto que cabe en cualquier estuche escolar',
      'Ancho estándar de 5mm con aplicación limpia y escritura al instante',
      'Formato mayorista: 12 uds/pack · 336 uds/caja',
    ],
    heroImage: gdImg('1qXBWAHT_5B0FUIe3SOEl6XfR-2Ilg1LB'),
    images: [
      {
        src: gdImg('1qXBWAHT_5B0FUIe3SOEl6XfR-2Ilg1LB'),
        downloadUrl: gdDl('1qXBWAHT_5B0FUIe3SOEl6XfR-2Ilg1LB'),
        labelZh: '晨光书桌与笔记本俯拍',
        labelEn: 'Morning desk flat-lay',
        labelEs: 'Mesa de estudio y cuadernos',
      },
      {
        src: gdImg('1UGhcfn6ZqXTw7w2Ss2bmdpqpDxuvde3W'),
        downloadUrl: gdDl('1UGhcfn6ZqXTw7w2Ss2bmdpqpDxuvde3W'),
        labelZh: '欧洲学生教室实景使用',
        labelEn: 'European student applying tape',
        labelEs: 'Uso escolar en clase',
      },
      {
        src: gdImg('1LL8xAqNZGZi-MFBr8g5106Mt8YNSuIhJ'),
        downloadUrl: gdDl('1LL8xAqNZGZi-MFBr8g5106Mt8YNSuIhJ'),
        labelZh: '笔袋与桌面文具收纳搭配',
        labelEn: 'Pencil case & stationery tray',
        labelEs: 'En estuche escolar y bandeja',
      },
      {
        src: gdImg('1eix6W3huDakOYZZIAezYjU44D7S4qexu'),
        downloadUrl: gdDl('1eix6W3huDakOYZZIAezYjU44D7S4qexu'),
        labelZh: '精准压头白带微距实拍',
        labelEn: 'Macro roller tip & white strip',
        labelEs: 'Macro punta aplicadora',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('19rm6FWDQ2iP7ZAzUksP85wHF7BpNDzkk'),
        downloadUrl: gdDl('19rm6FWDQ2iP7ZAzUksP85wHF7BpNDzkk'),
        titleZh: '百元店选品短剧《便携 8 米修正带》',
        titleEn: 'B2B Retail Short: #7 Compact Correction Tape',
        titleEs: 'Corto B2B: Corrector Compacto PA137',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1RcbxxWfPL3fBw69ynI4aSorCsRmtJ10o'),
        downloadUrl: gdDl('1RcbxxWfPL3fBw69ynI4aSorCsRmtJ10o'),
        titleZh: '西班牙语校园种草短剧《笔袋必备》',
        titleEn: 'Consumer Spot: Pencil Case Essential',
        titleEs: 'Spot España: Corrector PA137',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '学生每天放进笔袋里的小巧修正带，型号 MP* PA137。5 毫米宽、8 米长，顺滑一拉就能遮盖错字，写字不打滑。',
    shareTextEn:
      'Compact 5mm x 8m correction tape MP* PA137 built for school pencil cases. Clean, instant dry coverage with zero mess.',
    shareTextEs:
      'Corrector compacto MP* PA137 de 5mm x 8m ideal para llevar en el estuche: cubre al instante con un trazo limpio y uniforme.',
  },
  PE240N: {
    id: 'pe240n',
    rank: 10,
    sku: 'PE240N',
    ean: '8435464124764',
    catKey: 'writing',
    packInfoZh: '0.5mm 黑色直液针管水性笔 ｜ 12 支/盒 · 288 支/箱',
    packInfoEn: '0.5mm Black Liquid-Ink Needle Rollerball ｜ 12 pcs/pack · 288 pcs/carton',
    packInfoEs: 'Bolígrafo Tinta Líquida 0.5mm Negro ｜ 12 uds/pack · 288 uds/caja',
    titleZh: 'MP* 0.5mm 黑色直液针管走珠笔',
    titleEn: 'MP* 0.5mm Black Liquid-Ink Needle Rollerball',
    titleEs: 'MP* Bolígrafo Tinta Líquida Punta Aguja Negro',
    taglineZh: 'TOP 10 爆款 · 0.5mm 精密不锈钢针管 · 直液控墨不断水 · 考生与办公挚爱',
    taglineEn: 'Top #10 Bestseller · 0.5mm steel needle tip · Free-flowing liquid ink · Zero bleed',
    taglineEs: 'Top #10 en ventas · Punta aguja 0.5mm · Tinta líquida fluida · Trazo limpio y preciso',
    highlightsZh: [
      '直液式墨水调节系统，出墨饱满均匀，从第一笔写到最后一滴始终顺滑',
      '0.5mm 超细金属针管笔尖，字迹精细锐利，在西班牙方格本上不渗墨不晕染',
      '12支/盒、288支/箱，学校、备考与办公室全年复购率极高的核心笔款',
    ],
    highlightsEn: [
      'Precision liquid-ink regulator delivers consistent black flow down to the last drop',
      '0.5mm stainless needle tip produces crisp fine lines without bleeding through paper',
      'Wholesale pack 12 pcs/pack · 288 pcs/carton',
    ],
    highlightsEs: [
      'Sistema de tinta líquida regulada con flujo constante hasta la última gota',
      'Punta aguja de 0.5mm para un trazo fino, nítido y sin traspasar el papel',
      'Formato mayorista: 12 uds/pack · 288 uds/caja',
    ],
    heroImage: gdImg('1otgpIejfLAf08PtKIWHkSg0yFISrbO8L'),
    images: [
      {
        src: gdImg('1otgpIejfLAf08PtKIWHkSg0yFISrbO8L'),
        downloadUrl: gdDl('1otgpIejfLAf08PtKIWHkSg0yFISrbO8L'),
        labelZh: '商务手账与木石桌面俯拍',
        labelEn: 'Editorial planner & desk flat-lay',
        labelEs: 'Mesa de oficina y agenda',
      },
      {
        src: gdImg('11mrEYucOt8TAdE3m_HVKOA4E2DQ-hW5M'),
        downloadUrl: gdDl('11mrEYucOt8TAdE3m_HVKOA4E2DQ-hW5M'),
        labelZh: '手写细腻笔记与图表实拍',
        labelEn: 'Fine-line handwriting close-up',
        labelEs: 'Escritura fina y limpia en cuaderno',
      },
      {
        src: gdImg('11i0qqgBi7cVbqtQ5IURDD12LF_9a_fcn'),
        downloadUrl: gdDl('11i0qqgBi7cVbqtQ5IURDD12LF_9a_fcn'),
        labelZh: '极简笔筒整组陈列展示',
        labelEn: 'Minimalist ceramic pen holder display',
        labelEs: 'Presentación en soporte de escritorio',
      },
      {
        src: gdImg('1d39Oev-G1J8TdVpY0ixTdjiaVvrYCj3B'),
        downloadUrl: gdDl('1d39Oev-G1J8TdVpY0ixTdjiaVvrYCj3B'),
        labelZh: '0.5mm 针管笔尖与控墨片微距',
        labelEn: '0.5mm needle tip & ink collector macro',
        labelEs: 'Macro punta aguja 0.5mm y trazo negro',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('179AxmU5_dBMARZbULtm4vbk94oLAF8K5'),
        downloadUrl: gdDl('179AxmU5_dBMARZbULtm4vbk94oLAF8K5'),
        titleZh: '百元店选品短剧《直液针管走珠笔》',
        titleEn: 'B2B Retail Short: #10 0.5mm Liquid Ink Pen',
        titleEs: 'Corto B2B: Bolígrafo Punta Aguja PE240N',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1ODyWAOgSEimAPH6k54sOEjskWeWEuXX6'),
        downloadUrl: gdDl('1ODyWAOgSEimAPH6k54sOEjskWeWEuXX6'),
        titleZh: '西班牙语办公学习短剧《顺滑细字体验》',
        titleEn: 'Consumer Spot: Precision 0.5mm Writing',
        titleEs: 'Spot España: Precisión PE240N',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '喜欢写细字和大量记笔记的话，这款 MP* PE240N 0.5mm 直液针管黑笔非常顺手。出墨均匀不断线，在作业本上写久了也不容易透纸。',
    shareTextEn:
      'MP* PE240N 0.5mm black liquid-ink needle rollerball writes ultra-crisp lines with steady ink flow and zero paper bleed.',
    shareTextEs:
      'Bolígrafo de tinta líquida MP* PE240N con punta aguja de 0.5mm: escritura fluida, trazo fino impecable y sin traspasar el papel.',
  },
  PE439: {
    id: 'pe439',
    rank: 12,
    sku: 'PE439',
    ean: '8435250972210',
    catKey: 'writing',
    packInfoZh: '2.0mm 白色工业/手作油漆笔 ｜ 12 支/盒 · 240 支/箱',
    packInfoEn: '2.0mm White Opaque Paint Marker ｜ 12 pcs/pack · 240 pcs/carton',
    packInfoEs: 'Marcador de Pintura Blanco 2.0mm ｜ 12 uds/pack · 240 uds/caja',
    titleZh: 'MP* 2.0mm 白色高遮盖力油漆笔',
    titleEn: 'MP* 2.0mm White Opaque Paint Marker',
    titleEs: 'MP* Marcador de Pintura Blanco 2.0mm',
    taglineZh: 'TOP 12 爆款 · 不透明亮白油漆 · 金属/玻璃/黑卡纸通用 · 防水耐晒',
    taglineEn: 'Top #12 Bestseller · Opaque bright white paint · Metal, glass & dark surfaces · Waterproof',
    taglineEs: 'Top #12 en ventas · Pintura blanca opaca · Metal, vidrio y superficies oscuras',
    highlightsZh: [
      '高浓度不透明白色油漆墨水，深色卡纸、黑陶瓷、玻璃与金属表面一次显色',
      '2.0mm 耐磨纤维圆头，按压出墨稳定不堵头，防水耐晒不易刮花',
      '12支/盒、240支/箱，手工 DIY 创意区与五金汽配标注区高毛利单品',
    ],
    highlightsEn: [
      'High-opacity white valve-action paint ink stands out vividly on dark cardstock, glass, ceramic & metal',
      '2.0mm durable fiber bullet tip resists wear and delivers waterproof, weather-resistant marks',
      'Wholesale pack 12 pcs/pack · 240 pcs/carton',
    ],
    highlightsEs: [
      'Tinta opaca de alta cobertura ideal para cartulina negra, cerámica, vidrio, piedra y metal',
      'Punta redonda de 2.0mm resistente al agua y al desgaste para decoración y rotulación',
      'Formato mayorista: 12 uds/pack · 240 uds/caja',
    ],
    heroImage: gdImg('1-OmX_daq3niV2c0K0paDXpfmjv-FBcIo'),
    images: [
      {
        src: gdImg('1-OmX_daq3niV2c0K0paDXpfmjv-FBcIo'),
        downloadUrl: gdDl('1-OmX_daq3niV2c0K0paDXpfmjv-FBcIo'),
        labelZh: '深色石板与黑纸创意俯拍',
        labelEn: 'Dark slate & matte paper flat-lay',
        labelEs: 'Composición sobre pizarra y papel negro',
      },
      {
        src: gdImg('1a5MbnAAwrj-sSfSbBFcK2yWo_RZH6tFC'),
        downloadUrl: gdDl('1a5MbnAAwrj-sSfSbBFcK2yWo_RZH6tFC'),
        labelZh: '哑光黑陶瓷杯白漆手绘实景',
        labelEn: 'White paint botanical art on black mug',
        labelEs: 'Decoración en taza cerámica negra',
      },
      {
        src: gdImg('1INzcM04-2rFI2rp4t-ngA7EQGqXWByp0'),
        downloadUrl: gdDl('1INzcM04-2rFI2rp4t-ngA7EQGqXWByp0'),
        labelZh: '官方高清产品原图展示',
        labelEn: 'Official studio product view',
        labelEs: 'Vista oficial de estudio',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1EZmqgqYTevs6sVDUvQjD8mlHdTU3NW8l'),
        downloadUrl: gdDl('1EZmqgqYTevs6sVDUvQjD8mlHdTU3NW8l'),
        titleZh: '百元店选品短剧《2.0mm 白色油漆笔》',
        titleEn: 'B2B Retail Short: #12 White Paint Marker',
        titleEs: 'Corto B2B: Marcador Pintura PE439',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1jOQWcmb0OPcgFUQRh_-KKtSi2_LhGnCC'),
        downloadUrl: gdDl('1jOQWcmb0OPcgFUQRh_-KKtSi2_LhGnCC'),
        titleZh: '西班牙语手作种草短剧《深色表面高光》',
        titleEn: 'Consumer Spot: Dark Surface Paint Art',
        titleEs: 'Spot España: Creatividad PE439',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '想在黑卡纸、玻璃瓶或者陶瓷杯上画白色线条，普通白笔根本盖不住。这款 MP* PE439 2.0mm 油漆笔一笔亮白，干了之后还防水耐刮。',
    shareTextEn:
      'MP* PE439 2.0mm opaque white paint marker pops cleanly on black paper, ceramic, glass, and metal with waterproof durability.',
    shareTextEs:
      'Marcador de pintura blanco opaco MP* PE439 de 2.0mm: cobertura brillante sobre cartulina negra, vidrio, cerámica o metal, resistente al agua.',
  },
  PP002: {
    id: 'pp002',
    rank: 13,
    sku: 'PP002',
    ean: '8435250959464',
    catKey: 'office',
    packInfoZh: '40g 大容量固体胶棒 ｜ 12 支/包 · 288 支/箱',
    packInfoEn: '40g Large Solid Glue Stick ｜ 12 pcs/pack · 288 pcs/carton',
    packInfoEs: 'Pegamento en Barra 40g ｜ 12 uds/pack · 288 uds/caja',
    titleZh: 'MP* 40g 大容量学生安全固体胶棒',
    titleEn: 'MP* 40g Large School & Office Glue Stick',
    titleEs: 'MP* Pegamento en Barra 40g Escolar',
    taglineZh: 'TOP 13 爆款 · 40 克大号耐用 · 无毒可水洗 · 粘纸平整不起皱',
    taglineEn: 'Top #13 Bestseller · 40g jumbo size · Solvent-free washable · Smooth wrinkle-free bond',
    taglineEs: 'Top #13 en ventas · Formato grande 40g · Sin disolventes y lavable · No arruga el papel',
    highlightsZh: [
      '40 克大号耐用装，单支用量顶普通小胶棒两支以上，西班牙开学季学校清单必点款',
      '无溶剂安全配方、可冷水洗净，涂抹顺滑不拉丝、贴卡纸平整不起皱',
      '12支/包、288支/箱，九月开学与全年手工区百元店必配高复购硬通货',
    ],
    highlightsEn: [
      'Jumbo 40g capacity lasts through an entire school term of paper and cardstock crafts',
      'Solvent-free, child-safe and washable formula glides smoothly without wrinkling thin paper',
      'Wholesale pack 12 pcs/pack · 288 pcs/carton',
    ],
    highlightsEs: [
      'Formato grande de 40g de larga duración para todo el curso escolar',
      'Fórmula segura sin disolventes y lavable con agua, aplicación limpia sin arrugar el papel',
      'Formato mayorista: 12 uds/pack · 288 uds/caja',
    ],
    heroImage: gdImg('1qCUxpRdZoDoF9xHaXjyWqvAa9zwEp45m'),
    images: [
      {
        src: gdImg('1qCUxpRdZoDoF9xHaXjyWqvAa9zwEp45m'),
        downloadUrl: gdDl('1qCUxpRdZoDoF9xHaXjyWqvAa9zwEp45m'),
        labelZh: '手工卡纸与安全剪刀俯拍',
        labelEn: 'Craft table & paper cutouts flat-lay',
        labelEs: 'Mesa de manualidades y cartulinas',
      },
      {
        src: gdImg('1RF1CCK1WXw1xFzmHtIHI5Ti-uK56YkH3'),
        downloadUrl: gdDl('1RF1CCK1WXw1xFzmHtIHI5Ti-uK56YkH3'),
        labelZh: '欧洲儿童课桌干净涂胶实拍',
        labelEn: 'Schoolchild crafting cleanly',
        labelEs: 'Aplicación limpia en escritorio escolar',
      },
      {
        src: gdImg('1qKLGC-ZVz5U_VEaKZ2ILYl_bkvCNnhng'),
        downloadUrl: gdDl('1qKLGC-ZVz5U_VEaKZ2ILYl_bkvCNnhng'),
        labelZh: '笔记本与笔袋开学组合摆拍',
        labelEn: 'School supplies & pencil case arrangement',
        labelEs: 'Set escolar con cuadernos y estuche',
      },
      {
        src: gdImg('1EPGhN0Pk2to4-3sWvI36NDnyIUiNoPdE'),
        downloadUrl: gdDl('1EPGhN0Pk2to4-3sWvI36NDnyIUiNoPdE'),
        labelZh: '官方高清产品原图展示',
        labelEn: 'Official studio product view',
        labelEs: 'Vista oficial de estudio',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1bsnnGXeE0851OW0X2EqrQJZtyON4aVpc'),
        downloadUrl: gdDl('1bsnnGXeE0851OW0X2EqrQJZtyON4aVpc'),
        titleZh: '百元店选品短剧《40克大号固体胶》',
        titleEn: 'B2B Retail Short: #13 40g Glue Stick',
        titleEs: 'Corto B2B: Pegamento Barra 40g PP002',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1we5ul6jwCWxctDI2V0INJhfZ-H7niTYN'),
        downloadUrl: gdDl('1we5ul6jwCWxctDI2V0INJhfZ-H7niTYN'),
        titleZh: '西班牙语校园种草短剧《手工必备》',
        titleEn: 'Consumer Spot: School Craft Glue Stick',
        titleEs: 'Spot España: Pegamento PP002',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '开学给孩子备固体胶，选 MP* PP002 这种 40 克大支装最省心。涂起来顺滑不掉渣，粘完纸张平平整整，蹭到手上清水就能洗掉。',
    shareTextEn:
      'MP* PP002 40g jumbo glue stick is ideal for school crafts and office paper work. Smooth, solvent-free, and easily washable.',
    shareTextEs:
      'Pegamento en barra MP* PP002 de 40g: formato grande que cunde el doble, aplicación suave sin grumos y fácil de lavar con agua.',
  },
  PE461: {
    id: 'pe461',
    rank: 11,
    sku: 'PE461',
    ean: '8435250972357',
    catKey: 'writing',
    packInfoZh: '双头永久记号笔 黑色 ｜ 12 支/包 · 240 支/箱',
    packInfoEn: 'Double-Tip Permanent Marker Black ｜ 12 pcs/pack · 240 pcs/carton',
    packInfoEs: 'Marcador Permanente Doble Punta Negro ｜ 12 uds/pack · 240 uds/caja',
    titleZh: 'MP* 双头永久记号笔 黑色',
    titleEn: 'MP* Double-Tip Permanent Marker Black',
    titleEs: 'MP* Marcador Permanente Doble Punta Negro',
    taglineZh: 'TOP 11 爆款 · 双头一支两用 · 永久快干墨水 · 纸面/纸箱/塑料通用',
    taglineEn: 'Top #11 Bestseller · Two tips in one · Quick-dry permanent ink · Paper, cardboard & plastic',
    taglineEs: 'Top #11 en ventas · Doble punta en un solo rotulador · Tinta permanente de secado rápido',
    highlightsZh: [
      '一支双头：2.0mm 圆头写细字、斜切头涂粗线，仓库贴标、纸箱记号、手工描边一支搞定',
      '黑色永久墨水快干防水，纸面、纸箱、塑料与金属表面标记清晰不晕染',
      '12支/包、240支/箱，办公文具区与仓储物流标注区高复购硬通货',
    ],
    highlightsEn: [
      'Two tips in one pen: 2.0mm round tip for fine writing and chisel tip for bold marking',
      'Black permanent ink dries fast and stays waterproof on paper, cardboard, plastic and metal',
      'Wholesale pack 12 pcs/pack · 240 pcs/carton',
    ],
    highlightsEs: [
      'Doble punta: fina de 2.0mm para escribir y biselada para marcar en trazo grueso',
      'Tinta negra permanente de secado rápido, resistente al agua sobre papel, cartón, plástico y metal',
      'Formato mayorista: 12 uds/pack · 240 uds/caja',
    ],
    heroImage: gdImg('14nvYCb8aCfK8fndCUkihw9KU2dAwjGPb'),
    images: [
      {
        src: gdImg('14nvYCb8aCfK8fndCUkihw9KU2dAwjGPb'),
        downloadUrl: gdDl('14nvYCb8aCfK8fndCUkihw9KU2dAwjGPb'),
        labelZh: '桌面平铺俯拍',
        labelEn: 'Desktop flat-lay',
        labelEs: 'Composición sobre escritorio',
      },
      {
        src: gdImg('1DcnVJV0MQJoWXn7Oj6duokUzmA6xf1vo'),
        downloadUrl: gdDl('1DcnVJV0MQJoWXn7Oj6duokUzmA6xf1vo'),
        labelZh: '上手书写实景',
        labelEn: 'Writing in hand',
        labelEs: 'Escritura en uso real',
      },
      {
        src: gdImg('1beegv5I-rkm0orDfJkAeKY1kGohCE1v8'),
        downloadUrl: gdDl('1beegv5I-rkm0orDfJkAeKY1kGohCE1v8'),
        labelZh: '金属笔筒多材质陈列',
        labelEn: 'Metal cup mixed-material display',
        labelEs: 'Exposición en portalápices metálico',
      },
      {
        src: gdImg('1z1uwFZv67pbRiWCEVF83BM6mzbVOKya7'),
        downloadUrl: gdDl('1z1uwFZv67pbRiWCEVF83BM6mzbVOKya7'),
        labelZh: '双头笔尖微距',
        labelEn: 'Dual-tip macro close-up',
        labelEs: 'Macro de la doble punta',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1WkcfU-EWKcMw3opiTY63tAeFr9RPLYsw'),
        downloadUrl: gdDl('1WkcfU-EWKcMw3opiTY63tAeFr9RPLYsw'),
        titleZh: '百元店选品短剧《双头永久记号笔》',
        titleEn: 'B2B Retail Short: #11 Double-Tip Marker',
        titleEs: 'Corto B2B: Marcador Doble Punta PE461',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1A_kzAmbJFrnNJeYy8CPQHob4hOEjDirm'),
        downloadUrl: gdDl('1A_kzAmbJFrnNJeYy8CPQHob4hOEjDirm'),
        titleZh: '西班牙语日常种草短剧《一支两用》',
        titleEn: 'Consumer Spot: Two Tips, One Marker',
        titleEs: 'Spot España: Doble Punta PE461',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '店里进记号笔，MP* PE461 这种双头的是真的好卖，一头细写一头粗涂，仓库贴标、纸箱上记号都用它，黑色墨水干得快还防水。',
    shareTextEn:
      'MP* PE461 double-tip permanent marker: fine round tip on one end, bold chisel on the other. Fast-drying black ink that stays put on paper, cardboard and plastic.',
    shareTextEs:
      'Marcador permanente MP* PE461 de doble punta: fina para escribir y biselada para marcar. Tinta negra de secado rápido que aguanta en papel, cartón y plástico.',
  },
  'PE128-01': {
    id: 'pe128-01',
    rank: 18,
    sku: 'PE128-01',
    ean: '8435250905034',
    catKey: 'writing',
    packInfoZh: '6 色白板笔套装 ｜ 12 支/包 · 240 支/箱',
    packInfoEn: '6-Colour Whiteboard Marker Set ｜ 12 pcs/pack · 240 pcs/carton',
    packInfoEs: 'Set de 6 Rotuladores de Pizarra ｜ 12 uds/pack · 240 uds/caja',
    titleZh: 'MP* 6 色白板笔套装',
    titleEn: 'MP* 6-Colour Whiteboard Marker Set',
    titleEs: 'MP* Set de 6 Rotuladores de Pizarra Blanca',
    taglineZh: 'TOP 18 爆款 · 6 色成套 · 笔帽自带板擦 · 2.0mm 圆头易擦净',
    taglineEn: 'Top #18 Bestseller · 6 vivid colours · Built-in board eraser · 2.0mm bullet tip',
    taglineEs: 'Top #18 en ventas · 6 colores vivos · Borrador integrado en el tapón · Punta redonda 2.0mm',
    highlightsZh: [
      '黑、紫、粉、蓝、绿、橙 6 色成套，笔帽颜色与墨水一一对应，课堂与会议白板一目了然',
      '笔帽自带毡布板擦与磁吸，随手擦改不用另配板擦，2.0mm 圆头书写流畅易擦净',
      '12支/包、240支/箱，学校、办公室与培训机构常备耗材，复购稳定',
    ],
    highlightsEn: [
      'Six vivid colours in one set, cap colour matched to ink for quick picks on the board',
      'Felt eraser built into every cap, plus magnetic hold; 2.0mm bullet tip writes smoothly and wipes clean',
      'Wholesale pack 12 pcs/pack · 240 pcs/carton',
    ],
    highlightsEs: [
      'Seis colores vivos en un solo estuche, con el tapón del mismo color que la tinta',
      'Borrador de fieltro integrado en el tapón y sujeción magnética; punta redonda de 2.0mm fácil de borrar',
      'Formato mayorista: 12 uds/pack · 240 uds/caja',
    ],
    heroImage: gdImg('1m-z-dozrvfMe1SSm1M2-fPNtLEeVSghC'),
    images: [
      {
        src: gdImg('1m-z-dozrvfMe1SSm1M2-fPNtLEeVSghC'),
        downloadUrl: gdDl('1m-z-dozrvfMe1SSm1M2-fPNtLEeVSghC'),
        labelZh: '6 色成套桌面俯拍',
        labelEn: 'Six-colour set flat-lay',
        labelEs: 'Set de 6 colores sobre escritorio',
      },
      {
        src: gdImg('1320k0hdRzW03MnNgN2FGF9GC8ipDc0Mk'),
        downloadUrl: gdDl('1320k0hdRzW03MnNgN2FGF9GC8ipDc0Mk'),
        labelZh: '白板上手书写实景',
        labelEn: 'Writing on whiteboard in hand',
        labelEs: 'Escritura en pizarra blanca',
      },
      {
        src: gdImg('1rlfH9Kl9LmqZCiMaKEa034tat_JJik0P'),
        downloadUrl: gdDl('1rlfH9Kl9LmqZCiMaKEa034tat_JJik0P'),
        labelZh: '笔筒与玻璃面多材质陈列',
        labelEn: 'Pen cup & glass display',
        labelEs: 'Exposición en portalápices y cristal',
      },
      {
        src: gdImg('1ULupczp1qgK82chqzT1n4jdiSv-GrFpQ'),
        downloadUrl: gdDl('1ULupczp1qgK82chqzT1n4jdiSv-GrFpQ'),
        labelZh: '圆头笔尖微距',
        labelEn: 'Bullet tip macro close-up',
        labelEs: 'Macro de la punta redonda',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('138cP4QO-38ilcAsk-6wYbzlXsz5VglQd'),
        downloadUrl: gdDl('138cP4QO-38ilcAsk-6wYbzlXsz5VglQd'),
        titleZh: '百元店选品短剧《6 色白板笔》',
        titleEn: 'B2B Retail Short: #18 Whiteboard Set',
        titleEs: 'Corto B2B: Pizarra 6 Colores PE128-01',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1dYYLoEsTmXOf7g7vpyJ3eWbaNjzCIE5G'),
        downloadUrl: gdDl('1dYYLoEsTmXOf7g7vpyJ3eWbaNjzCIE5G'),
        titleZh: '西班牙语课堂种草短剧《白板好搭档》',
        titleEn: 'Consumer Spot: Whiteboard Essentials',
        titleEs: 'Spot España: Pizarra PE128-01',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      '家里和办公室的白板，配 MP* PE128-01 这一套 6 色笔就够了，笔帽上还自带小板擦，写错了随手一擦，颜色也够亮。',
    shareTextEn:
      'MP* PE128-01 six-colour whiteboard set covers every board: bright colours, smooth 2.0mm tips, and a felt eraser built into every cap.',
    shareTextEs:
      'Set de 6 rotuladores de pizarra MP* PE128-01: colores vivos, trazo suave de 2.0mm y borrador de fieltro en cada tapón.',
  },
  PT106: {
    id: 'pt106',
    rank: 22,
    sku: 'PT106',
    ean: '8435250930005',
    catKey: 'office',
    packInfoZh: '13.5cm 多用途剪刀 · 圆头安全 ｜ 12 支/包 · 288 支/箱',
    packInfoEn: '13.5cm Multi-Purpose Scissors · Round Tip ｜ 12 pcs/pack · 288 pcs/carton',
    packInfoEs: 'Tijera Multiusos 13.5cm · Punta Redonda ｜ 12 uds/pack · 288 uds/caja',
    titleZh: 'MP* 13.5cm 多用途圆头剪刀',
    titleEn: 'MP* 13.5cm Multi-Purpose Round-Tip Scissors',
    titleEs: 'MP* Tijera Multiusos 13.5cm Punta Redonda',
    taglineZh: 'TOP 22 爆款 · 13.5cm 顺手尺寸 · 圆头安全 · 文具手工办公四栖',
    taglineEn: 'Top #22 Bestseller · Handy 13.5cm size · Safe round tip · Craft, school & office',
    taglineEs: 'Top #22 en ventas · Medida práctica 13.5cm · Punta redonda segura · Manualidades y oficina',
    highlightsZh: [
      '不锈钢圆头刀刃锋利顺滑，裁卡纸、布料、包装都利落，圆头设计学校与家庭用着更安心',
      '黑色包胶人体工学手柄，红圈指环贴合手指，久剪不累手',
      '12支/包、288支/箱，文具、手工、办公、家用四栖常备款，全年走量稳定',
    ],
    highlightsEn: [
      'Sharp stainless round-tip blades cut cardstock, fabric and packaging cleanly, safe for school and home',
      'Ergonomic soft-grip black handles with red-ring finger loops for comfortable long cutting',
      'Wholesale pack 12 pcs/pack · 288 pcs/carton',
    ],
    highlightsEs: [
      'Hojas de acero inoxidable de punta redonda que cortan cartulina, tela y embalaje con seguridad',
      'Mango ergonómico negro con anillas de interior rojo, cómodo incluso en cortes largos',
      'Formato mayorista: 12 uds/pack · 288 uds/caja',
    ],
    heroImage: gdImg('15OHzkI00Et2GhUUCz3kPrAIPYSkCBhQ5'),
    images: [
      {
        src: gdImg('15OHzkI00Et2GhUUCz3kPrAIPYSkCBhQ5'),
        downloadUrl: gdDl('15OHzkI00Et2GhUUCz3kPrAIPYSkCBhQ5'),
        labelZh: '卡纸与胶带桌面俯拍',
        labelEn: 'Craft desk flat-lay',
        labelEs: 'Mesa de manualidades',
      },
      {
        src: gdImg('1OjKS7RgqFojGmHvPDsEzLMY5OArY9s0H'),
        downloadUrl: gdDl('1OjKS7RgqFojGmHvPDsEzLMY5OArY9s0H'),
        labelZh: '上手裁剪卡纸实景',
        labelEn: 'Cutting cardstock in hand',
        labelEs: 'Cortando cartulina en uso',
      },
      {
        src: gdImg('1TtDAkQtAz_68jWB7OjXa23hfEIclelCd'),
        downloadUrl: gdDl('1TtDAkQtAz_68jWB7OjXa23hfEIclelCd'),
        labelZh: '笔筒与工具盒多材质陈列',
        labelEn: 'Tool cup & mixed-material display',
        labelEs: 'Exposición en portalápices y caja',
      },
      {
        src: gdImg('1eHTXAYoj4z3VbzBgMM8TKC26hCyEt5BX'),
        downloadUrl: gdDl('1eHTXAYoj4z3VbzBgMM8TKC26hCyEt5BX'),
        labelZh: '刃口与铆钉微距',
        labelEn: 'Blade & pivot macro close-up',
        labelEs: 'Macro de la hoja y el remache',
      },
    ],
    videos: [
      {
        embedUrl: gdVid('1mt3L-psJ1u7mpxr46YjNiwGPyS7Axi9V'),
        downloadUrl: gdDl('1mt3L-psJ1u7mpxr46YjNiwGPyS7Axi9V'),
        titleZh: '百元店选品短剧《13.5cm 多用途剪刀》',
        titleEn: 'B2B Retail Short: #22 Multi-Purpose Scissors',
        titleEs: 'Corto B2B: Tijera Multiusos PT106',
        tagZh: 'B2B 百元店推销版',
        tagEn: 'B2B Retail',
        tagEs: 'B2B Bazares',
      },
      {
        embedUrl: gdVid('1FkUafMUOzCwDNGuc3sFJCz6DUe7VyHcj'),
        downloadUrl: gdDl('1FkUafMUOzCwDNGuc3sFJCz6DUe7VyHcj'),
        titleZh: '西班牙语日常种草短剧《顺手好剪》',
        titleEn: 'Consumer Spot: Everyday Cutting',
        titleEs: 'Spot España: Tijera PT106',
        tagZh: 'B2C 西语消费版',
        tagEn: 'B2C Consumer',
        tagEs: 'B2C España',
      },
    ],
    shareTextZh:
      'MP* PT106 这把 13.5cm 的剪刀，家里、办公室、孩子做手工都能用，圆头不扎手，剪卡纸布料都利落，握着也不累。',
    shareTextEn:
      'MP* PT106 13.5cm multi-purpose scissors: safe round tip, sharp stainless blades and comfy soft-grip handles for craft, school, office and home.',
    shareTextEs:
      'Tijera multiusos MP* PT106 de 13.5cm: punta redonda segura, hojas afiladas de acero y mango cómodo para manualidades, cole y oficina.',
  },
};

const generatedItems: DailyVitrinaEntry[] = (top100Raw.items || []).map((raw: any) => {
  if (FLAGSHIP_ITEMS[raw.sku]) {
    return { ...FLAGSHIP_ITEMS[raw.sku], rank: raw.rank };
  }
  const catKey = detectCategory(raw.category || '', raw.subcat || '', raw.namees || '');
  const imgUrl = gdImg(raw.imgId);
  const imgDl = gdDl(raw.imgId);
  const vidEmbed = gdVid(raw.vidId);
  const vidDl = gdDl(raw.vidId);

  return {
    id: raw.sku.toLowerCase(),
    rank: raw.rank,
    sku: raw.sku,
    ean: raw.ean || '',
    catKey,
    packInfoZh: `小包 ${raw.packet} 件/包 ｜ 整箱 ${raw.box} 件/箱`,
    packInfoEn: `Inner Pack: ${raw.packet} pcs ｜ Master Carton: ${raw.box} pcs`,
    packInfoEs: `Pack: ${raw.packet} uds ｜ Caja máster: ${raw.box} uds`,
    titleZh: `${raw.namecn} (${raw.sku})`,
    titleEn: `${raw.namees} (${raw.sku})`,
    titleEs: raw.namees,
    taglineZh: `TOP200 畅销榜第 #${raw.rank} 名 · MP* 自有高周转单品`,
    taglineEn: `Top #${raw.rank} Bestseller · High-turnover MP* Stationery SKU`,
    taglineEs: `Top #${raw.rank} en ventas · Referencia estrella MP* de alta rotación`,
    highlightsZh: [
      `西班牙终端门店高频复购 TOP200 第 #${raw.rank} 名`,
      `标准包装规格：${raw.packet} 件/包，${raw.box} 件/箱，适合百元店与文具店陈列`,
      `官方高清图库与 720p 宣传短视频已云端就绪，支持一键转发推广`,
    ],
    highlightsEn: [
      `Ranked #${raw.rank} in Spain retail bestseller list`,
      `Wholesale packing: ${raw.packet} pcs/pack, ${raw.box} pcs/carton`,
      `Cloud studio visual & 720p promo video ready for instant social sharing`,
    ],
    highlightsEs: [
      `Top #${raw.rank} de ventas en tiendas y papelerías de España`,
      `Formato mayorista: ${raw.packet} uds/pack · ${raw.box} uds/caja`,
      `Imagen promocional y vídeo 720p en la nube listos para compartir`,
    ],
    heroImage: imgUrl,
    images: [
      {
        src: imgUrl,
        downloadUrl: imgDl,
        labelZh: `${raw.sku} 商业视觉展示图`,
        labelEn: `${raw.sku} Studio Promo Visual`,
        labelEs: `Imagen promocional ${raw.sku}`,
      },
    ],
    videos: [
      {
        embedUrl: vidEmbed,
        downloadUrl: vidDl,
        titleZh: `${raw.sku} 产品动态展示视频`,
        titleEn: `${raw.sku} Product Promo Video`,
        titleEs: `Vídeo promocional ${raw.sku}`,
        tagZh: '云端宣传视频',
        tagEn: 'Promo Video',
        tagEs: 'Vídeo Promo',
      },
    ],
    shareTextZh:
      `${raw.namecn}，型号 ${raw.sku}，西班牙门店常备高周转单品，品质稳定好走量，欢迎需要补货的老板随时咨询。`,
    shareTextEn:
      `${raw.namees} (${raw.sku}) — a reliable everyday bestseller in Spanish stationery and retail stores.`,
    shareTextEs:
      `${raw.namees} (${raw.sku}), una referencia imprescindible de alta rotación para papelería y bazar.`,
  };
});

export const DAILY_VITRINA_ITEMS: DailyVitrinaEntry[] = [
  FLAGSHIP_ITEMS.PP948,
  ...generatedItems,
];
