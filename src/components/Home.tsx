import React, { useMemo, useState } from 'react';
import { Lang } from '../data/christmas2026DB';

export interface HomeProps {
  lang: Lang;
  onNavigateToTienda: () => void;
  onNavigateToMap?: () => void;
  onNavigateToVitrina?: () => void;
  onNavigateToNavidad?: () => void;
  onNavigateToCanje?: () => void;
}

interface BestsellerItem {
  sku: string;
  rank: number;
  cat: 'writing' | 'correction' | 'paper';
  img: string;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  packZh: string;
  packEn: string;
  packEs: string;
  hookZh: string;
  hookEn: string;
  hookEs: string;
}

const TOP_BESTSELLERS: BestsellerItem[] = [
  {
    sku: 'PE486-1',
    rank: 2,
    cat: 'writing',
    img: './daily/vitrina/PE486-1/hero_pack.jpg?v=20261120',
    nameZh: 'MP* 永不干涸黑色记号笔',
    nameEn: 'MP* No-Dry Black Permanent Marker',
    nameEs: 'MP* Marcador Permanente Negro No Dry',
    packZh: '12 支/包 · 480 支/箱',
    packEn: '12/pack · 480/carton',
    packEs: '12 uds/pack · 480/caja',
    hookZh: '开盖一周不干，仓库与百元店常年走量冠军',
    hookEn: '1-week cap-off life; #2 turnover staple',
    hookEs: 'No se seca destapado; top #2 de rotación',
  },
  {
    sku: 'PA457-04',
    rank: 5,
    cat: 'correction',
    img: './daily/vitrina/PA457-04/hero_pack.jpg?v=20261120',
    nameZh: 'MP* 5mm × 20m 超长容量修正带',
    nameEn: 'MP* 5mm × 20m Extra-Long Correction Tape',
    nameEs: 'MP* Corrector Cinta 5mm × 20m Extralargo',
    packZh: '12 个/包 · 288 个/箱',
    packEn: '12/pack · 288/carton',
    packEs: '12 uds/pack · 288/caja',
    hookZh: '20 米双倍容量加翻折防护盖，复购率极高',
    hookEn: '20m double-life spool with hinged tip guard',
    hookEs: '20 metros de duración con tapa abatible',
  },
  {
    sku: 'PE415',
    rank: 6,
    cat: 'writing',
    img: './daily/vitrina/PE415/hero_pack.jpg?v=20261121',
    nameZh: 'MP* 1.0mm 中号黑色 CD 多材质笔',
    nameEn: 'MP* 1.0mm Multi-Surface CD Marker Black',
    nameEs: 'MP* Rotulador CD Multi-Superficie 1.0mm',
    packZh: '18 支/包 · 432 支/箱',
    packEn: '18/pack · 432/carton',
    packEs: '18 uds/pack · 432/caja',
    hookZh: '光盘塑料金属玻璃通写，1.0mm 精准不晕染',
    hookEn: 'Writes crisp 1.0mm on CD, plastic & metal',
    hookEs: 'Trazo preciso 1.0mm en CD, plástico y metal',
  },
  {
    sku: 'PE240N',
    rank: 8,
    cat: 'writing',
    img: './daily/vitrina/PE240N/hero_pack.jpg?v=20261120',
    nameZh: 'MP* 0.5mm 黑色直液针管水性笔',
    nameEn: 'MP* 0.5mm Needle-Point Liquid Rollerball',
    nameEs: 'MP* Bolígrafo Tinta Líquida Punta Aguja 0.5',
    packZh: '12 支/包 · 288 支/箱',
    packEn: '12/pack · 288/carton',
    packEs: '12 uds/pack · 288/caja',
    hookZh: '直液可视储墨窗，西班牙中学生高频复购款',
    hookEn: 'Visible liquid-ink window; student favorite',
    hookEs: 'Visor de tinta líquida; líder en estudiantes',
  },
  {
    sku: 'PE486-0',
    rank: 15,
    cat: 'writing',
    img: './daily/vitrina/PE486-0/hero_pack.jpg?v=20261121',
    nameZh: 'MP* 2/3mm 高遮盖白色永久记号笔',
    nameEn: 'MP* 2/3mm Opaque White Permanent Marker',
    nameEs: 'MP* Marcador Permanente Blanco 2/3mm',
    packZh: '12 支/包 · 480 支/箱',
    packEn: '12/pack · 480/carton',
    packEs: '12 uds/pack · 480/caja',
    hookZh: '深色礼盒、玻璃瓶与工业标号差异化高毛利款',
    hookEn: 'High-margin opaque white for dark surfaces',
    hookEs: 'Blanco opaco de alto margen en vidrio y cartón',
  },
  {
    sku: 'PP001',
    rank: 19,
    cat: 'correction',
    img: './daily/vitrina/PP001/hero_pack.jpg?v=20261121',
    nameZh: 'MP* 21g 无毒可水洗固体胶棒',
    nameEn: 'MP* 21g Solvent-Free Washable Glue Stick',
    nameEs: 'MP* Pegamento de Barra 21g Sin Disolventes',
    packZh: '24 支/包 · 480 支/箱',
    packEn: '24/pack · 480/carton',
    packEs: '24 uds/pack · 480/caja',
    hookZh: '开学季与家庭手工硬通货，5 年质保不干裂',
    hookEn: 'Back-to-school essential; 5-year formula',
    hookEs: 'Básico escolar de alta rotación, sin disolventes',
  },
  {
    sku: 'PN175',
    rank: 24,
    cat: 'paper',
    img: './daily/vitrina/PN175/hero_pack.jpg?v=20261120',
    nameZh: 'MP* 75×75mm 四色荧光便利贴 100 页',
    nameEn: 'MP* 75×75mm 4-Color Neon Sticky Notes',
    nameEs: 'MP* Notas Adhesivas Neón 75×75mm 100 Hojas',
    packZh: '12 本/包 · 288 本/箱',
    packEn: '12/pack · 288/carton',
    packEs: '12 uds/pack · 288/caja',
    hookZh: '黄粉橙蓝四层霓虹吸塑挂袋，货架吸睛引流款',
    hookEn: '4-layer neon cube in retail hanging bag',
    hookEs: 'Taco 4 colores neón en bolsa expositora',
  },
  {
    sku: 'PA137M-3',
    rank: 31,
    cat: 'correction',
    img: './daily/vitrina/PA137M-3/hero_pack.jpg?v=20261120',
    nameZh: 'MP* 迷你修正带 5mm×6m 三只实惠装',
    nameEn: 'MP* Mini Correction Tape 3-Pack Value Set',
    nameEs: 'MP* Mini Corrector Cinta Pack Ahorro 3 Uds.',
    packZh: '12 排/包 · 144 排/箱',
    packEn: '12 packs/inner · 144/carton',
    packEs: '12 packs · 144/caja',
    hookZh: '三色组合高客单价挂卡，学生笔袋爆款走量装',
    hookEn: '3-color pocket value pack drives basket size',
    hookEs: 'Pack ahorro tricolor de gran salida escolar',
  },
];

export const Home: React.FC<HomeProps> = ({
  lang,
  onNavigateToTienda,
  onNavigateToMap,
  onNavigateToVitrina,
}) => {
  const WHATSAPP_NUMBER = '604229098';
  const WHATSAPP_LINK = 'https://wa.me/34604229098';
  const EMAIL_ADDRESS = 'info@kyrmax.com';

  const t = (zh: string, en: string, es: string) =>
    lang === 'zh' ? zh : lang === 'en' ? en : es;

  const [activeCat, setActiveCat] = useState<'all' | 'writing' | 'correction' | 'paper'>('all');
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    shopName: '',
    contactName: '',
    city: '',
    phone: '',
    email: '',
    businessType: 'comercio',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const visibleProducts = useMemo(() => {
    if (activeCat === 'all') return TOP_BESTSELLERS;
    return TOP_BESTSELLERS.filter((item) => item.cat === activeCat);
  }, [activeCat]);

  const toggleSku = (sku: string) => {
    setSelectedSkus((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  };

  const openWhatsAppWithQuote = (customIntro?: string) => {
    const picked = TOP_BESTSELLERS.filter((i) => selectedSkus.includes(i.sku));
    let msg = customIntro
      ? `${customIntro}\n`
      : `${t('您好，我想索取以下西班牙现货文具的批发报价单：', 'Hello, please send wholesale pricing for these in-stock SKUs:', 'Hola, solicito tarifa mayorista para estas referencias en stock:')}\n`;

    if (picked.length > 0) {
      msg += `\n`;
      picked.forEach((p, idx) => {
        const name = t(p.nameZh, p.nameEn, p.nameEs);
        const pack = t(p.packZh, p.packEn, p.packEs);
        msg += `${idx + 1}. [${p.sku}] ${name} (${pack})\n`;
      });
    }
    msg += `\nFuente: vueltacole.com`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel =
      formData.businessType === 'corporativo'
        ? t('企事业单位 / 大宗采购', 'Corporate / Bulk Order', 'Empresa / Compra Corporativa')
        : formData.businessType === 'colegio'
          ? t('学校机构 / 教育培训', 'School / Academy', 'Colegio / Centro Educativo')
          : t('百元店 / 传统文具书店', 'Retail / Stationery Store', 'Bazar / Papelería');

    let msg = `${t('【vueltacole.com 批发询价单】', '[vueltacole.com Wholesale Quote Request]', '[vueltacole.com Solicitud de Tarifa Mayorista]')}\n`;
    msg += `${t('店铺/公司', 'Store/Company', 'Tienda/Empresa')}: ${formData.shopName || '-'}\n`;
    msg += `${t('联系人', 'Contact', 'Contacto')}: ${formData.contactName || '-'}\n`;
    msg += `${t('城市', 'City', 'Ciudad')}: ${formData.city || '-'}\n`;
    msg += `${t('电话', 'Phone', 'Tel')}: ${formData.phone || '-'}\n`;
    msg += `Email: ${formData.email || '-'}\n`;
    msg += `${t('渠道类型', 'Channel', 'Tipo')}: ${typeLabel}\n`;
    if (selectedSkus.length > 0) {
      msg += `${t('已选货号', 'Selected SKUs', 'Referencias')}: ${selectedSkus.join(', ')}\n`;
    }
    if (formData.message) {
      msg += `${t('补充需求', 'Notes', 'Notas')}: ${formData.message}\n`;
    }

    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setFormSubmitted(true);
  };

  const heroPreview = TOP_BESTSELLERS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#111827] pb-28 overflow-x-hidden">
      {/* 1. HIGH-CONVERSION COMMERCIAL SPLIT HERO (PRODUCTS ABOVE THE FOLD) */}
      <section className="bg-[#111827] text-white border-b-4 border-[#e52521]">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Sales Pitch & Immediate Conversion CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#e52521] text-white text-xs font-bold px-3 py-1.5 rounded-md tracking-wide uppercase">
              <span>{t('西班牙本土现货直供 · 24-48h 发货', 'SPAIN IN-STOCK WHOLESALE · 24-48H DISPATCH', 'STOCK EN ESPAÑA · ENVÍO 24-48H')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-tight text-white">
              {t(
                '6,000+ 西班牙热销文具现货，',
                '6,000+ Fast-Moving Stationery SKUs, ',
                '6.000+ Referencias de Papelería en Stock, '
              )}
              <span className="text-[#f8d878]">
                {t(
                  '挑完货号 1 分钟拿批发底价',
                  'Wholesale Quotes in 60 Seconds',
                  'Tarifa Mayorista en 1 Minuto'
                )}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl font-sans">
              {t(
                '专为西班牙百元店、传统书店与机构集采打造。所有爆款均带原装西语吸塑挂卡与 EAN 条码，上架即卖；免费附赠每款四宫格宣传图与短视频，帮你把货卖得更快。',
                'Engineered for Spanish bazars, bookstores, and corporate buyers. Official Spanish EAN blister packaging ready for shelf display, plus free 4-grid promo photos & videos for every bestseller.',
                'Diseñado para bazares, papelerías y grandes cuentas en España. Blíster original con código EAN listo para colgar en lineal, más kit gratuito de fotos y vídeos promocionales para vender más rápido.'
              )}
            </p>

            {/* Primary & Secondary Sales Actions */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-1">
              <a
                href="#bestsellers"
                className="px-5 py-3.5 bg-[#e52521] hover:bg-[#c81e1a] text-white rounded-xl font-black text-sm sm:text-[15px] text-center whitespace-nowrap shadow-lg transition-colors"
              >
                {t('挑爆款加入询价单 ↓', 'Pick Bestsellers for Quote ↓', 'Elegir Top Ventas ↓')}
              </a>
              <button
                type="button"
                onClick={() => openWhatsAppWithQuote()}
                className="px-5 py-3.5 bg-[#f8d878] hover:bg-yellow-300 text-[#111827] rounded-xl font-black text-sm sm:text-[15px] text-center whitespace-nowrap transition-colors cursor-pointer"
              >
                {t(`WhatsApp 拿价目表 · ${WHATSAPP_NUMBER}`, `WhatsApp Price List · ${WHATSAPP_NUMBER}`, `Tarifa WhatsApp · ${WHATSAPP_NUMBER}`)}
              </button>
            </div>

            {/* Concrete B2B Proof Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/15">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#f8d878] tabular-nums">6,000+</div>
                <div className="text-xs text-gray-400 font-sans">
                  {t('马德里现货 SKU', 'Madrid In-Stock SKUs', 'SKUs en Stock')}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">12 uds</div>
                <div className="text-xs text-gray-400 font-sans">
                  {t('小包起批灵活补货', 'Low Inner-Pack MOQ', 'Pedido desde 1 pack')}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">100%</div>
                <div className="text-xs text-gray-400 font-sans">
                  {t('配齐四宫格推广图', 'Free Promo Media Kit', 'Kit Promo Incluido')}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Real Studio Bestseller Product Mosaic (Immediate Visual Trust!) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3.5">
              {heroPreview.map((item) => {
                const picked = selectedSkus.includes(item.sku);
                return (
                  <div
                    key={item.sku}
                    onClick={() => toggleSku(item.sku)}
                    className={`group cursor-pointer rounded-2xl overflow-hidden bg-white text-[#111827] border-2 transition-all ${
                      picked
                        ? 'border-[#f8d878] ring-2 ring-[#f8d878]'
                        : 'border-white/20 hover:border-[#f8d878]'
                    }`}
                  >
                    <div className="relative aspect-square bg-[#f4f5f7] overflow-hidden">
                      <img
                        src={item.img}
                        alt={t(item.nameZh, item.nameEn, item.nameEs)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-[#111827]/90 text-[#f8d878] text-[11px] font-black px-2 py-0.5 rounded">
                        TOP #{item.rank}
                      </span>
                      <span
                        className={`absolute top-2.5 right-2.5 text-[11px] font-black px-2 py-0.5 rounded ${
                          picked ? 'bg-[#e52521] text-white' : 'bg-white/95 text-[#111827]'
                        }`}
                      >
                        {picked ? t('✓ 已选', '✓ Added', '✓ Añadido') : '+ ' + item.sku}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-black truncate">
                        {t(item.nameZh, item.nameEn, item.nameEs)}
                      </div>
                      <div className="text-[11px] text-gray-500 font-sans mt-0.5">
                        {t(item.packZh, item.packEn, item.packEs)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400 font-sans">
              <span>{t('点击任意爆款卡片即可加入底部询价单', 'Tap any card to add to your instant quote list', 'Pulsa cualquier producto para añadirlo a tu pedido')}</span>
              <button
                type="button"
                onClick={() => onNavigateToVitrina?.()}
                className="text-[#f8d878] font-bold hover:underline cursor-pointer"
              >
                {t('进入完整 100 款爆款馆 →', 'Open Full TOP 100 Showcase →', 'Ver Vitrina TOP 100 →')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE TOP BESTSELLERS SHELF (CONVERSION CORE) */}
      <section id="bestsellers" className="max-w-6xl mx-auto px-4 pt-14 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
              {t('西班牙门店高频复购 · 本周必进爆款榜', 'High-Turnover Spanish Retail Bestsellers', 'Top Ventas de Alta Rotación en Tiendas')}
            </h2>
            <p className="text-sm text-gray-600 font-sans mt-1.5">
              {t(
                '按西班牙真实出货榜精选。勾选中意货号，底部一键生成清单发 WhatsApp 秒拿批发价。',
                'Curated from real Spanish retail dispatch volume. Select SKUs below and send a structured WhatsApp quote in one tap.',
                'Seleccionados por volumen real de ventas en España. Marca tus referencias y solicita tarifa directa por WhatsApp.'
              )}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {(
              [
                ['all', t('全部爆款', 'All Top SKUs', 'Todos')],
                ['writing', t('书写记号', 'Markers & Pens', 'Escritura')],
                ['correction', t('修正与胶粘', 'Correction & Glue', 'Corrección y Cola')],
                ['paper', t('纸品便利贴', 'Paper & Notes', 'Papel y Notas')],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCat(key)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                  activeCat === key
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-white text-[#111827] border-gray-300 hover:border-[#111827]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleProducts.map((item) => {
            const picked = selectedSkus.includes(item.sku);
            return (
              <article
                key={item.sku}
                className={`bg-white rounded-2xl border-2 overflow-hidden flex flex-col justify-between transition-all ${
                  picked
                    ? 'border-[#e52521] shadow-md'
                    : 'border-gray-200 hover:border-[#111827] shadow-sm'
                }`}
              >
                <div>
                  <div className="relative aspect-square bg-[#f4f5f7] overflow-hidden">
                    <img
                      src={item.img}
                      alt={t(item.nameZh, item.nameEn, item.nameEs)}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#111827] text-[#f8d878] text-xs font-black px-2.5 py-1 rounded-md">
                      TOP #{item.rank}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/95 text-[#111827] text-xs font-mono font-bold px-2 py-1 rounded border border-gray-200">
                      {item.sku}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-black text-base text-[#111827] leading-snug">
                      {t(item.nameZh, item.nameEn, item.nameEs)}
                    </h3>
                    <div className="text-xs font-mono font-semibold text-[#e52521] mt-1">
                      {t(item.packZh, item.packEn, item.packEs)}
                    </div>
                    <p className="text-xs text-gray-600 font-sans mt-2 leading-relaxed">
                      {t(item.hookZh, item.hookEn, item.hookEs)}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSku(item.sku)}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      picked
                        ? 'bg-[#e52521] text-white'
                        : 'bg-[#111827] hover:bg-black text-white'
                    }`}
                  >
                    {picked
                      ? t('✓ 已入询价单', '✓ In Quote List', '✓ Añadido')
                      : t('+ 加入询价单', '+ Add to Quote', '+ Pedir Tarifa')}
                  </button>
                  <a
                    href={`./vitrina.html?sku=${encodeURIComponent(item.sku)}`}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs border border-gray-300 text-[#111827] hover:border-[#111827] bg-[#f8f6f1] whitespace-nowrap"
                  >
                    {t('4图素材 ↗', '4-Grid ↗', 'Fotos ↗')}
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onNavigateToTienda}
            className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#111827] border-2 border-[#111827] rounded-xl font-black text-sm transition-colors cursor-pointer"
          >
            {t('浏览全部 6,000+ 现货目录 →', 'Browse All 6,000+ SKUs Catalog →', 'Explorar Catálogo de 6.000+ SKUs →')}
          </button>
          {onNavigateToMap && (
            <button
              type="button"
              onClick={onNavigateToMap}
              className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#111827] border border-gray-300 rounded-xl font-bold text-sm transition-colors cursor-pointer"
            >
              {t('查看合作门店地图', 'View Retail Store Map', 'Ver Mapa de Puntos de Venta')}
            </button>
          )}
        </div>
      </section>

      {/* 3. THREE READY-MADE B2B STARTER PACKAGES (SEGMENTED FAST CLOSE) */}
      <section className="bg-white border-y border-gray-200 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mb-9">
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
              {t('不想从 6,000 款里慢慢挑？按你的门店直接配好爆款包', 'Ready-to-Sell Assortments by Store Type', 'Surtidos Listos para Vender según tu Negocio')}
            </h2>
            <p className="text-sm text-gray-600 font-sans mt-1.5">
              {t(
                '根据西班牙实盘销售数据预配货架组合，零踩坑试单，最快 48 小时送达门店。',
                'Pre-curated shelf assortments backed by real Spanish sales data—zero dead stock, dispatched within 48h.',
                'Surtidos preseleccionados con datos reales de venta en España para maximizar tu rotación desde el primer día.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="rounded-2xl border-2 border-gray-200 p-6 flex flex-col justify-between bg-[#f8f6f1]">
              <div>
                <div className="text-xs font-mono font-bold text-[#e52521] uppercase">
                  {t('方案 A · 百元店 / 社区超市', 'TIER A · BAZAR & CONVENIENCE', 'PACK A · BAZAR Y TIENDA LOCAL')}
                </div>
                <h3 className="text-xl font-black mt-2 text-[#111827]">
                  {t('12 款高周转试单爆款包', 'Top 12 High-Turnover Starter', 'Pack Inicio Top 12 Rotación')}
                </h3>
                <p className="text-sm text-gray-600 font-sans mt-2">
                  {t(
                    '覆盖油性笔、修正带、固体胶、便利贴等最稳走量单品，按小包起批，现金回笼快。',
                    'Covers permanent markers, correction tapes, glue sticks, and neon notes in low inner-pack quantities.',
                    'Marcadores, correctores, pegamentos y notas neón en packs pequeños de salida garantizada.'
                  )}
                </p>
                <ul className="mt-4 space-y-2 text-xs text-gray-700 font-sans border-t border-gray-300 pt-4">
                  <li>• {t('每款 12-24 件小包起订，无压货风险', 'Low 12–24 pc inner-pack MOQ', 'Desde 12–24 uds por referencia')}</li>
                  <li>• {t('全套西语吸塑挂卡 + EAN 条码直接上挂钩', 'Spanish EAN blister hooks ready', 'Blíster con código EAN listo para colgar')}</li>
                  <li>• {t('附赠朋友圈与 WhatsApp 卖货四宫格图', 'Includes 4-grid social promo kit', 'Incluye kit de fotos para WhatsApp e IG')}</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() =>
                  openWhatsAppWithQuote(
                    t(
                      '您好，我想咨询【方案A · 百元店12款高周转试单爆款包】的报价与起订金额：',
                      'Hello, please send pricing for Tier A: Top 12 High-Turnover Bazar Starter Pack:',
                      'Hola, quiero solicitar precio para el Pack A: Top 12 Rotación para Bazar:'
                    )
                  )
                }
                className="mt-6 w-full py-3 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-sm transition-colors cursor-pointer"
              >
                {t('索取方案 A 报价单 →', 'Get Tier A Quote →', 'Solicitar Tarifa Pack A →')}
              </button>
            </div>

            {/* Tier 2 Featured */}
            <div className="rounded-2xl border-2 border-[#e52521] p-6 flex flex-col justify-between bg-[#111827] text-white shadow-xl">
              <div>
                <div className="inline-block text-xs font-mono font-bold bg-[#f8d878] text-[#111827] px-2.5 py-0.5 rounded uppercase">
                  {t('最受欢迎 · 传统书店与文具店', 'MOST POPULAR · BOOKSTORES', 'MÁS VENDIDO · PAPELERÍAS')}
                </div>
                <h3 className="text-xl font-black mt-3 text-white">
                  {t('30 款全品类开学季核心陈列包', 'Top 30 Full-Aisle Retail Assortment', 'Pack 30 Referencias Vuelta al Cole')}
                </h3>
                <p className="text-sm text-gray-300 font-sans mt-2">
                  {t(
                    '包含书写、修正、美术画本、200g 钻石白卡纸与荧光笔套装，直接撑起整面黄金文具货架。',
                    'Full writing, correction, Artix drawing blocks, 200gsm cardstock, and pastel highlighter displays.',
                    'Escritura, corrección, blocs Artix, cartulinas 200g y packs pastel para montar un lineal completo.'
                  )}
                </p>
                <ul className="mt-4 space-y-2 text-xs text-gray-200 font-sans border-t border-white/15 pt-4">
                  <li>• {t('享整箱阶梯批发折扣与优先配货权', 'Tiered carton wholesale discounts', 'Descuentos escalados por volumen')}</li>
                  <li>• {t('1 对 1 中西双语客户经理跟进补货', 'Dedicated ES/ZH/EN account manager', 'Gestor comercial dedicado 1 a 1')}</li>
                  <li>• {t('含全套每日主推馆高清图与 720p 短视频', 'Full HD photos + 720p promo videos', 'Incluye galería HD y vídeos 720p')}</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() =>
                  openWhatsAppWithQuote(
                    t(
                      '您好，我想咨询【方案B · 30款全品类核心陈列包】的阶梯批发报价：',
                      'Hello, please send tiered wholesale pricing for Tier B: Top 30 Retail Assortment:',
                      'Hola, solicito tarifa escalada para el Pack B: 30 Referencias Vuelta al Cole:'
                    )
                  )
                }
                className="mt-6 w-full py-3 rounded-xl bg-[#e52521] hover:bg-[#c81e1a] text-white font-black text-sm transition-colors cursor-pointer"
              >
                {t('索取方案 B 阶梯价 →', 'Get Tier B Pricing →', 'Solicitar Tarifa Pack B →')}
              </button>
            </div>

            {/* Tier 3 */}
            <div className="rounded-2xl border-2 border-gray-200 p-6 flex flex-col justify-between bg-[#f8f6f1]">
              <div>
                <div className="text-xs font-mono font-bold text-[#111827] uppercase">
                  {t('方案 C · 学校 / 企业大宗集采', 'TIER C · SCHOOLS & CORPORATE', 'PACK C · COLEGIOS Y EMPRESAS')}
                </div>
                <h3 className="text-xl font-black mt-2 text-[#111827]">
                  {t('按清单 24 小时精准集采报价', 'Custom List 24h Bulk Quotation', 'Presupuesto a Medida en 24h')}
                </h3>
                <p className="text-sm text-gray-600 font-sans mt-2">
                  {t(
                    '发送学校采购表或企业办公耗材清单，由大客户专员直接匹配最具性价比现货方案。',
                    'Send your school supply list or corporate office tender for a tailored in-stock quotation within 24h.',
                    'Envíanos tu listado escolar o de oficina y recibe presupuesto cerrado con stock real en 24 horas.'
                  )}
                </p>
                <ul className="mt-4 space-y-2 text-xs text-gray-700 font-sans border-t border-gray-300 pt-4">
                  <li>• {t('正规西班牙商业发票与合规资质文件', 'Full Spanish VAT invoicing', 'Facturación española oficial')}</li>
                  <li>• {t('支持托盘整箱直发与预约时间送货', 'Palletized direct delivery across Spain', 'Envío paletizado a toda la península')}</li>
                  <li>• {t('可提前寄送样品核验品质与规格', 'Pre-order physical samples available', 'Envío previo de muestras comerciales')}</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() =>
                  openWhatsAppWithQuote(
                    t(
                      '您好，我需要【方案C · 学校/企业大宗集采清单】24小时报价对接：',
                      'Hello, I need a 24h bulk quotation under Tier C (School / Corporate):',
                      'Hola, necesito presupuesto en 24h para pedido institucional (Pack C):'
                    )
                  )
                }
                className="mt-6 w-full py-3 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-sm transition-colors cursor-pointer"
              >
                {t('提交集采清单报价 →', 'Submit Bulk List →', 'Enviar Listado 24h →')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAST 30-SECOND WHOLESALE QUOTE FORM */}
      <section id="quote-form" className="max-w-4xl mx-auto px-4 pt-14">
        <div className="bg-white rounded-3xl border-2 border-[#111827] p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#111827]">
                {t('30 秒获取专属批发价单与样品', 'Get Your Wholesale Price List in 30 Seconds', 'Recibe tu Tarifa Mayorista en 30 Segundos')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-sans mt-1">
                {t(
                  '填写后自动生成结构化询价单直连 WhatsApp 业务代表，无需反复打字沟通。',
                  'Generates a structured inquiry directly to our WhatsApp trade desk for immediate pricing.',
                  'Genera tu consulta estructurada directa a nuestro WhatsApp comercial para respuesta inmediata.'
                )}
              </p>
            </div>
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="text-xs font-mono font-bold text-[#111827] underline underline-offset-4 whitespace-nowrap"
            >
              {EMAIL_ADDRESS}
            </a>
          </div>

          {selectedSkus.length > 0 && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#f8f6f1] border border-gray-300 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-[#111827]">
                {t('已附带选中的货号：', 'Attached selected SKUs: ', 'Referencias incluidas: ')}
                <span className="font-mono text-[#e52521]">{selectedSkus.join(', ')}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSkus([])}
                className="text-xs text-gray-500 hover:text-[#111827] underline cursor-pointer"
              >
                {t('清空', 'Clear', 'Limpiar')}
              </button>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('店铺 / 公司名称 *', 'Store / Company Name *', 'Nombre de Tienda / Empresa *')}
              </label>
              <input
                required
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                placeholder={t('例如：马德里百元文具店', 'e.g. Papelería Centro Madrid', 'Ej. Papelería Centro Madrid')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('联系人姓名 *', 'Contact Name *', 'Persona de Contacto *')}
              </label>
              <input
                required
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder={t('您的称呼', 'Your name', 'Tu nombre')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('所在城市', 'City', 'Ciudad')}
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Madrid / Barcelona / Zaragoza / Valencia"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('联系电话 / WhatsApp *', 'Phone / WhatsApp *', 'Teléfono / WhatsApp *')}
              </label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+34 6XX XXX XXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('业务类型', 'Business Channel', 'Tipo de Negocio')}
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#111827]"
              >
                <option value="comercio">{t('百元店 / 传统文具书店', 'Bazar / Stationery Store', 'Bazar / Papelería')}</option>
                <option value="colegio">{t('学校机构 / 培训中心', 'School / Academy', 'Colegio / Academia')}</option>
                <option value="corporativo">{t('企业办公 / 大宗集采', 'Corporate / Bulk Buyer', 'Empresa / Grandes Cuentas')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="compras@tienda.es"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('预计补货品类或货号说明', 'Order Notes or Target Categories', 'Notas o categorías de interés')}
              </label>
              <textarea
                rows={3}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t(
                  '例如：想试单 12 款热销记号笔与修正带，需要含税报价单',
                  'e.g. Interested in starter pack of markers & correction tapes with VAT invoice',
                  'Ej. Interesado en pack de inicio de marcadores y correctores con tarifa mayorista'
                )}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#e52521] hover:bg-[#c81e1a] text-white rounded-xl font-black text-sm transition-colors cursor-pointer"
              >
                {t('一键发送询价单至 WhatsApp →', 'Send Structured Quote via WhatsApp →', 'Enviar Solicitud por WhatsApp →')}
              </button>
              {formSubmitted && (
                <span className="text-xs font-bold text-emerald-700">
                  {t('已为您打开 WhatsApp 询价窗口', 'WhatsApp inquiry window opened', 'Ventana de WhatsApp abierta')}
                </span>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* FLOATING STICKY QUOTE BASKET BAR (CONVERTS SELECTED SKUS IN 1 CLICK) */}
      {selectedSkus.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-2xl bg-[#111827] text-white border-2 border-[#f8d878] rounded-2xl px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-black text-[#f8d878]">
              {t(`已选 ${selectedSkus.length} 款西班牙爆款`, `${selectedSkus.length} Bestsellers Selected`, `${selectedSkus.length} Referencias Seleccionadas`)}
            </div>
            <div className="text-[11px] font-mono text-gray-300 truncate">
              {selectedSkus.join(' · ')}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedSkus([])}
              className="px-2.5 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              {t('清空', 'Clear', 'Vaciar')}
            </button>
            <button
              type="button"
              onClick={() => openWhatsAppWithQuote()}
              className="px-4 py-2.5 bg-[#e52521] hover:bg-[#c81e1a] text-white rounded-xl font-black text-xs sm:text-sm whitespace-nowrap cursor-pointer"
            >
              {t('一键发 WhatsApp 询价 →', 'WhatsApp Quote →', 'Pedir Tarifa →')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
