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
    heroImage: '/daily/2026-11-17/pp948_6grid_combo.jpg',
    images: [
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
        src: gdImg('1qY9ZaTyyOFQ0ukSJP7HZ-U9ffyLNwm7C'),
        downloadUrl: gdDl('1qY9ZaTyyOFQ0ukSJP7HZ-U9ffyLNwm7C'),
        labelZh: '防水凝珠微距与官网二维码',
        labelEn: 'Waterproof macro & website QR',
        labelEs: 'Macro impermeable y código QR',
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
