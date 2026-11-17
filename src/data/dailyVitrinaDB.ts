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
      '🔥【主推爆款｜MP* PP948 直液丙烯软头马克笔】\n' +
      '做文具和百元店的老板注意啦！12/24/36 色全齐：\n' +
      '✅ 直液控墨视窗，不用摇不用按，下笔流畅不断墨\n' +
      '✅ 黑卡纸、石头、木片、黑陶瓷、牛仔布一笔高遮盖，干后防水不晕染\n' +
      '👉 查看全套效果图与宣传短剧：https://vueltacole.com/vitrina.html',
    shareTextEn:
      '🎨 Transform any surface in minutes with MP* STYLE PP948 Acrylic Brush Markers!\n' +
      '✨ Direct liquid-ink regulator + extra-opaque coverage on black paper, stone, wood, ceramic, denim & metal\n' +
      '👉 Watch showcase & videos: https://vueltacole.com/vitrina.html',
    shareTextEs:
      '🎨 ¡Transforma cualquier objeto en 5 minutos con MP* STYLE PP948!\n' +
      'Rotuladores acrílicos punta pincel (1,5–6 mm) con tinta directa y cobertura extra opaca.\n' +
      '👉 Mira fotos y vídeos aquí: https://vueltacole.com/vitrina.html',
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
      '🔥【热卖主推｜MP* PE517 马卡龙柔色荧光笔 6支超值装】\n' +
      '✅ 奶油黄/薄荷绿/香芋紫等 6 种高颜值柔色，久看笔记不刺眼\n' +
      '✅ 1–3 mm 斜头可粗可细，水性配方不透纸背 · 12挂板/包 · 144挂板/箱\n' +
      '👉 效果图、宣传短剧与详情：https://vueltacole.com/vitrina.html',
    shareTextEn:
      '✨ Upgrade your study & office notes with MP* PE517 Pastel Highlighters (6-Pack)!\n' +
      '🖍️ 6 soft pastel shades with 1–3 mm beveled tip & water-based no-bleed ink.\n' +
      '👉 See gallery & videos: https://vueltacole.com/vitrina.html',
    shareTextEs:
      '✨ ¡Tus apuntes más bonitos y sin cansar la vista con MP* PE517!\n' +
      'Pack ahorro de 6 subrayadores pastel con punta biselada 1–3 mm.\n' +
      '👉 Mira las fotos y el vídeo aquí: https://vueltacole.com/vitrina.html',
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
      `🔥【热卖推荐 #${raw.rank}｜${raw.sku} ${raw.namecn}】\n` +
      `西语名：${raw.namees}\n` +
      `✅ 西班牙 TOP 畅销常备爆款 · 小包 ${raw.packet} 件 / 整箱 ${raw.box} 件\n` +
      `👉 查看产品展示图与视频：https://vueltacole.com/vitrina.html?sku=${encodeURIComponent(raw.sku)}`,
    shareTextEn:
      `🔥 Top Bestseller #${raw.rank}: ${raw.namees} (${raw.sku})\n` +
      `📦 Pack: ${raw.packet} pcs | Carton: ${raw.box} pcs\n` +
      `👉 See product visual & promo video: https://vueltacole.com/vitrina.html?sku=${encodeURIComponent(raw.sku)}`,
    shareTextEs:
      `🔥 ¡Top Ventas #${raw.rank}: ${raw.namees} (${raw.sku})!\n` +
      `📦 Formato: ${raw.packet} uds/pack · ${raw.box} uds/caja\n` +
      `👉 Mira la ficha visual y vídeo aquí: https://vueltacole.com/vitrina.html?sku=${encodeURIComponent(raw.sku)}`,
  };
});

export const DAILY_VITRINA_ITEMS: DailyVitrinaEntry[] = [
  FLAGSHIP_ITEMS.PP948,
  ...generatedItems,
];
