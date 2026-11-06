import React, { useState } from 'react';
import { Lang } from '../data/christmas2026DB';

export interface HomeProps {
  lang: Lang;
  onNavigateToTienda: () => void;
  onNavigateToMap?: () => void;
  onNavigateToNavidad?: () => void;
  onNavigateToCanje?: () => void;
}

export const Home: React.FC<HomeProps> = ({
  lang,
  onNavigateToTienda,
  onNavigateToMap,
  onNavigateToNavidad,
}) => {
  // Contact info
  const WHATSAPP_NUMBER = '604229098';
  const WHATSAPP_LINK = 'https://wa.me/34604229098';
  const EMAIL_ADDRESS = 'info@kyrmax.com';

  // Form State
  const [formData, setFormData] = useState({
    shopName: '',
    contactName: '',
    city: '',
    phone: '',
    email: '',
    businessType: 'bazar', // bazar | papeleria | colegio | distribuidor
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel =
      formData.businessType === 'bazar'
        ? '百货零售 / Bazar'
        : formData.businessType === 'papeleria'
        ? '文具书店 / Papelería'
        : formData.businessType === 'colegio'
        ? '学校机构 / Colegio'
        : '大宗分销 / Distribuidor';

    let msg = `🤝 *【文具贸易与批发业务合作咨询】*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🏪 店铺/公司: ${formData.shopName || '未填写'}\n`;
    msg += `👤 负责人: ${formData.contactName || '未填写'}\n`;
    msg += `📍 所在城市: ${formData.city || '未填写'}\n`;
    msg += `📞 联络电话: ${formData.phone || '未填写'}\n`;
    msg += `✉️ 电子邮箱: ${formData.email || '未填写'}\n`;
    msg += `📦 业务类型: ${typeLabel}\n`;
    if (formData.message) {
      msg += `💬 采购需求: ${formData.message}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `来自 vueltacole.com 文具供应链直通平台`;

    const encoded = encodeURIComponent(msg);
    window.open(`${WHATSAPP_LINK}?text=${encoded}`, '_blank');
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#222] font-['Fredoka',sans-serif] pb-20">
      {/* 1. TOP HERO BANNER */}
      <section className="bg-[#e52521] border-b-6 border-[#222] text-white px-4 py-12 md:py-16 relative overflow-hidden shadow-xl">
        {/* Mario-style floating elements */}
        <div className="absolute top-2 left-6 text-yellow-300 text-3xl animate-bounce">★</div>
        <div className="absolute top-8 right-12 text-white/15 text-9xl font-black select-none pointer-events-none">
          ★
        </div>
        <div className="absolute bottom-2 right-1/4 text-white/10 text-8xl font-black select-none pointer-events-none">
          ?
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="bg-[#f8d878] text-[#222] text-xs md:text-sm font-black px-4 py-1.5 rounded-full border-3 border-[#222] shadow-[3px_3px_0px_#222] uppercase tracking-wider">
              {lang === 'zh'
                ? '🚀 西班牙文具贸易 · 批发供货与零售精选供应链'
                : '🚀 Comercio y Distribución Mayorista de Papelería en España'}
            </span>
            <span className="bg-[#5c94fc] text-white text-xs md:text-sm font-black px-3.5 py-1.5 rounded-full border-3 border-[#222] shadow-[3px_3px_0px_#222]">
              {lang === 'zh' ? '一手源头渠道 · 本地现货直发' : 'Stock Permanente · Envíos 48H'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[4px_4px_0px_#222] mb-4 leading-tight">
            {lang === 'zh'
              ? '文具贸易与批发供应链服务'
              : 'DISTRIBUCIÓN Y SUMINISTRO MAYORISTA DE PAPELERÍA'}
            <br />
            <span className="text-[#f8d878]">
              {lang === 'zh'
                ? '专注百货零售 · 书店专柜 · 批量采购'
                : 'Tu Socio Comercial para Bazares, Papelerías y Colegios'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-yellow-100 font-bold max-w-3xl mx-auto mb-8 leading-relaxed">
            {lang === 'zh'
              ? '深耕西班牙文具贸易与批发市场，为您精选 6,000+ 现货文具 SKU，涵盖学生书写、办公桌面、收纳文件、本册纸品、美术画材与各大主流文具品牌一手货源。为百货零售店 (Bazar)、专业文具书店 (Papelería)、学校机构 (Colegios/AMPAs) 提供具有高度竞争力的批发价格、展架陈列支持、小额混批与 48 小时本地直发服务。'
              : 'Especialistas en comercio y distribución de material escolar, oficina y papelería comercial en España. Suministro integral con más de 6.000 referencias en stock, precios competitivos sin intermediarios innecesarios y atención comercial directa para tu negocio.'}
          </p>

          {/* Fast Contact Callout Box */}
          <div className="max-w-2xl mx-auto bg-white p-4 md:p-6 rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] text-[#222] mb-8">
            <div className="text-xs md:text-sm font-black text-gray-600 uppercase mb-2">
              {lang === 'zh' ? '⚡ 业务咨询与采购订货绿色通道' : '⚡ Canales Directos de Consulta y Pedidos'}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                  lang === 'zh'
                    ? '您好，我想咨询文具贸易与批发订货合作！'
                    : 'Hola, me gustaría consultar tarifas y catálogo mayorista de papelería.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] font-black text-base flex items-center justify-center gap-2 active:translate-y-0.5 cursor-pointer"
              >
                <span className="text-xl">📱</span>
                <span>WhatsApp: {WHATSAPP_NUMBER}</span>
              </a>

              <a
                href={`mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
                  'Consulta Comercial - Distribución y Venta Mayorista de Papelería'
                )}`}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#5c94fc] hover:bg-blue-600 text-white rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] font-black text-base flex items-center justify-center gap-2 active:translate-y-0.5 cursor-pointer"
              >
                <span className="text-xl">✉️</span>
                <span>{EMAIL_ADDRESS}</span>
              </a>
            </div>
            <p className="text-[11px] md:text-xs text-gray-500 font-bold mt-2.5">
              {lang === 'zh'
                ? '💡 业务代表一对一专业对接，快速获取商品批发报价单、动销建议与样品展厅支持'
                : '💡 Atención personalizada 1 a 1 para facilitarte listas de precios, muestras y condiciones comerciales.'}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateToTienda}
              className="px-6 py-3.5 bg-[#f8d878] hover:bg-yellow-400 text-[#222] rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] font-black text-base md:text-lg flex items-center gap-2 active:translate-y-0.5 cursor-pointer"
            >
              <span>🛒</span>
              <span>
                {lang === 'zh'
                  ? '浏览全景文具商城 & 选品订货'
                  : 'Explorar Catálogo & Tienda Online'}
              </span>
            </button>

            {onNavigateToNavidad && (
              <button
                onClick={onNavigateToNavidad}
                className="px-5 py-3.5 bg-[#14532d] hover:bg-emerald-800 text-[#f8d878] rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] font-black text-base flex items-center gap-2 active:translate-y-0.5 cursor-pointer"
              >
                <span>🎄</span>
                <span>{lang === 'zh' ? '2026 圣诞与日历大促' : 'Campaña Navidad'}</span>
              </button>
            )}

            {onNavigateToMap && (
              <button
                onClick={onNavigateToMap}
                className="px-5 py-3.5 bg-white hover:bg-gray-100 text-[#222] rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] font-black text-base flex items-center gap-2 active:translate-y-0.5 cursor-pointer"
              >
                <span>🎒</span>
                <span>{lang === 'zh' ? '返校季周边学校地图' : 'Mapa Escolar'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. CORE PERFORMANCE METRICS */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              num: '6,000+',
              labelZh: '现货文具 SKU',
              labelEs: 'Referencias en Stock',
              icon: '📦',
              color: 'bg-white',
            },
            {
              num: '48h',
              labelZh: '西班牙本土极速直发',
              labelEs: 'Envío Peninsular Ágil',
              icon: '🚚',
              color: 'bg-white',
            },
            {
              num: '100%',
              labelZh: '一手批发底价保障',
              labelEs: 'Tarifas Mayoristas Competitivas',
              icon: '💰',
              color: 'bg-white',
            },
            {
              num: '多元品牌',
              labelZh: '知名名牌与源头品质',
              labelEs: 'Primeras Marcas y Suministro',
              icon: '⭐',
              color: 'bg-white',
            },
          ].map((m, i) => (
            <div
              key={i}
              className={`${m.color} p-4 rounded-3xl border-4 border-[#222] shadow-[5px_5px_0px_#222] text-center flex flex-col items-center justify-center`}
            >
              <div className="text-3xl mb-1">{m.icon}</div>
              <div className="text-2xl md:text-3xl font-black text-[#e52521] tracking-tight">
                {m.num}
              </div>
              <div className="text-xs md:text-sm font-black text-gray-700 mt-0.5">
                {lang === 'zh' ? m.labelZh : m.labelEs}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SIX CORE COMPETITIVE ADVANTAGES */}
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <div className="text-center mb-10">
          <span className="bg-[#f8d878] text-[#222] text-xs font-black px-3.5 py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222] uppercase">
            {lang === 'zh' ? '⭐ 业务赋能 · 六大核心优势' : '⭐ Ventajas de Nuestro Servicio'}
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#222] mt-2 drop-shadow-[2px_2px_0px_#f8d878]">
            {lang === 'zh'
              ? '为什么选择我们的文具贸易与批发供应链？'
              : '¿Por Qué Trabajar con Nosotros en Suministro de Papelería?'}
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-bold max-w-2xl mx-auto mt-1">
            {lang === 'zh'
              ? '专注西班牙本地零售与批发市场，为您打通从一手货源、选品建议到数字化订货的每一个环节'
              : 'Suministro integral para bazares, papelerías, colegios y comercios minoristas con atención comercial cercana.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: '🏭',
              titleZh: '一手贸易源头 · 充足利润空间',
              titleEs: 'Precios Mayoristas Directos',
              descZh:
                '剔除多层不必要中间加价环节，直接为您提供源头批发底价，为百货和文具零售商预留极具竞争力的销售毛利空间。',
              descEs:
                'Sin intermediarios innecesarios. Precios competitivos para que tu comercio obtenga un margen saludable y sostenible.',
              tag: '100% Directo',
            },
            {
              icon: '📦',
              titleZh: '6,000+ SKU 全品类现货供应',
              titleEs: '+6.000 Referencias en Stock',
              descZh:
                '涵盖学生书写用具、办公桌面、收纳文件夹、本册纸品、Artix 美术画材、正版热门 IP 与高性价比基础系列，一站式购齐。',
              descEs:
                'Material escolar, artículos de oficina, archivo, cuadernos, bellas artes y líneas de alta rotación.',
              tag: 'Catálogo Total',
            },
            {
              icon: '🚚',
              titleZh: '西班牙本地大仓 · 48H 闪电到店',
              titleEs: 'Logística Peninsular 48H',
              descZh:
                '马德里本地大型仓储常备现货，小批量多频次灵活补货，不积压流动资金，紧急断货迅速送达。',
              descEs:
                'Almacenes en España con stock disponible continuo para reposiciones ágiles y sin tiempos de espera prolongados.',
              tag: 'Stock Real',
            },
            {
              icon: '🏷️',
              titleZh: '主流品牌与高性价比梯队',
              titleEs: 'Gama Multimarca y Marcas Líderes',
              descZh:
                '联合供应 Bic、Milan、Pilot、Stabilo、Edding、Main Paper 等各大品牌，满足不同消费客群的差异化需求。',
              descEs:
                'Disponibilidad de marcas reconocidas del mercado escolar y de oficina en un único pedido consolidado.',
              tag: 'Top Brands',
            },
            {
              icon: '🎁',
              titleZh: '陈列展架支持与动销物料',
              titleEs: 'Expositores y Soporte Comercial',
              descZh:
                '符合订货标准的合作商户免费提供优质金属落地展架、台面展架、门头 POP 海报与当季宣传画册，助力店面动销。',
              descEs:
                'Mobiliario comercial, expositores de suelo y sobremesa, catálogos impresos y material promocional para tu punto de venta.',
              tag: 'Soporte PLV',
            },
            {
              icon: '💻',
              titleZh: '高效数智化系统 · 一键导出 Excel',
              titleEs: 'Gestión Digital Ágil y Excel',
              descZh:
                '支持线上自主加购、一键导出带 SKU、EAN 条码与包数的标准 Excel 订货表格，或通过 WhatsApp 秒发正式报单。',
              descEs:
                'Cesta digital rápida, exportación de listas a Excel con SKU y EAN, y tramitación instantánea vía WhatsApp.',
              tag: 'Excel & Web',
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{card.icon}</span>
                  <span className="bg-yellow-100 text-[#222] text-[11px] font-black px-2.5 py-1 rounded-lg border-2 border-[#222]">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#222] mb-2">
                  {lang === 'zh' ? card.titleZh : card.titleEs}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 font-bold leading-relaxed">
                  {lang === 'zh' ? card.descZh : card.descEs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FOUR PARTNERSHIP MODELS */}
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <div className="bg-[#5c94fc] p-6 md:p-10 rounded-3xl border-4 border-[#222] shadow-[8px_8px_0px_#222] text-white">
          <div className="text-center mb-8">
            <span className="bg-[#f8d878] text-[#222] text-xs font-black px-3.5 py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222] uppercase">
              {lang === 'zh' ? '🤝 合作模式' : '🤝 Modalidades'}
            </span>
            <h2 className="text-2xl md:text-4xl font-black mt-2 drop-shadow-[2px_2px_0px_#222]">
              {lang === 'zh'
                ? '多元灵活的商业合作方式'
                : 'Modalidades de Asociación Flexibles'}
            </h2>
            <p className="text-sm md:text-base text-blue-100 font-bold max-w-xl mx-auto mt-1">
              {lang === 'zh'
                ? '无论您是社区百货零售、专业文具书店还是学校机构集采，均有量身定制的供货方案'
                : 'Soluciones a medida para cada tipo de comercio, volumen de compra y proyecto.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: '🏪',
                titleZh: '百货零售 / Bazar',
                titleEs: 'Bazar y Comercio',
                descZh: '专架直配，精选高频动销热门文具，小额混批，资金周转快。',
                descEs: 'Expositores dedicados con alta rotación y reposición rápida.',
              },
              {
                icon: '📚',
                titleZh: '文具书店专柜',
                titleEs: 'Papelería / Librería',
                descZh: '全套开学季文具、2027 年历日历首发、品质正品专柜支持。',
                descEs: 'Gama completa escolar, agendas 2027 y marcas destacadas.',
              },
              {
                icon: '🏫',
                titleZh: '学校 / 家委会集采',
                titleEs: 'Colegios y AMPAs',
                descZh: '提供专属样品展厅模式（无标价），大宗学期订货享专属团购折扣与清单导出。',
                descEs: 'Catálogo de muestras para seleccionar listas escolares sin precios.',
              },
              {
                icon: '🌐',
                titleZh: '区域分销与大宗客户',
                titleEs: 'Distribuidores Mayoristas',
                descZh: '专属区域支持，阶梯量贩采购返点，专职业务代表一对一全程跟进。',
                descEs: 'Tarifas por volumen, rapeles de compra y asesoría comercial dedicada.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border-3 border-[#222] shadow-[4px_4px_0px_#222] text-[#222]"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-lg font-black mb-1">
                  {lang === 'zh' ? item.titleZh : item.titleEs}
                </div>
                <div className="text-xs text-gray-600 font-bold leading-relaxed">
                  {lang === 'zh' ? item.descZh : item.descEs}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAST INQUIRY REGISTRATION FORM */}
      <section className="max-w-4xl mx-auto px-4 pt-16">
        <div className="bg-white p-6 md:p-10 rounded-3xl border-4 border-[#222] shadow-[8px_8px_0px_#222]">
          <div className="text-center mb-6">
            <span className="bg-[#f8d878] text-[#222] text-xs font-black px-3.5 py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222] uppercase">
              {lang === 'zh' ? '📝 业务咨询登记' : '📝 Contacto Comercial'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#222] mt-2">
              {lang === 'zh'
                ? '提交采购意向 · 业务代表 1 对 1 服务'
                : 'Solicitar Catálogo y Contacto Comercial'}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-bold mt-1">
              {lang === 'zh'
                ? '填写基本信息后将自动拉起 WhatsApp 业务对接，或直接联络电话 604229098'
                : 'Rellena el formulario y te contactaremos para facilitarte catálogo y condiciones comerciales.'}
            </p>
          </div>

          {formSubmitted && (
            <div className="mb-6 p-4 bg-emerald-100 border-3 border-emerald-500 rounded-2xl text-emerald-900 font-black text-center flex items-center justify-center gap-2">
              <span>✅</span>
              <span>
                {lang === 'zh'
                  ? '已为您整理好咨询信息并打开 WhatsApp！如未弹出，请直接联系业务专线: 604229098'
                  : '¡Solicitud preparada! Puedes enviarla directamente por WhatsApp al 604229098.'}
              </span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {lang === 'zh' ? '店铺 / 公司名称 *' : 'Nombre de Tienda / Empresa *'}
                </label>
                <input
                  type="text"
                  required
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder={lang === 'zh' ? '例如: 马德里文具百货' : 'Ej: Bazar Centro'}
                  className="w-full px-3.5 py-2.5 rounded-xl border-3 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {lang === 'zh' ? '负责人姓名 *' : 'Persona de Contacto *'}
                </label>
                <input
                  type="text"
                  required
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder={lang === 'zh' ? '例如: 张先生 / Carlos' : 'Ej: Carlos García'}
                  className="w-full px-3.5 py-2.5 rounded-xl border-3 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {lang === 'zh' ? '所在城市 / 省份 *' : 'Ciudad / Provincia *'}
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Madrid, Barcelona..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-3 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {lang === 'zh' ? 'WhatsApp / 联络电话 *' : 'WhatsApp / Teléfono *'}
                </label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+34 600..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-3 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {lang === 'zh' ? '电子邮箱' : 'Email'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border-3 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">
                {lang === 'zh' ? '您的主营业务类型' : 'Tipo de Comercio / Actividad'}
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border-3 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none"
              >
                <option value="bazar">{lang === 'zh' ? '百货零售店 / Bazar' : 'Bazar / Comercio General'}</option>
                <option value="papeleria">{lang === 'zh' ? '专业文具与书店 / Papelería y Librería' : 'Papelería y Librería'}</option>
                <option value="colegio">{lang === 'zh' ? '学校 / 家委会 / 培训机构' : 'Colegio / AMPA / Academia'}</option>
                <option value="distribuidor">{lang === 'zh' ? '区域分销 / 批发连锁' : 'Distribuidor Mayorista'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">
                {lang === 'zh' ? '意向需求或留言' : 'Mensaje / Observaciones'}
              </label>
              <textarea
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                placeholder={
                  lang === 'zh'
                    ? '例如：希望了解起订金额、畅销文具清单、展架配送政策或索取样品...'
                    : 'Ej: Solicitar catálogo en PDF y condiciones de primer pedido.'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border-3 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] font-black text-base md:text-lg flex items-center justify-center gap-2 active:translate-y-0.5 cursor-pointer"
              >
                <span>📱</span>
                <span>
                  {lang === 'zh'
                    ? '一键通过 WhatsApp 提交咨询 (604229098)'
                    : 'Enviar Consulta por WhatsApp (604229098)'}
                </span>
              </button>

              <a
                href={`mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
                  `Consulta Comercial - ${formData.shopName || 'Comercio'}`
                )}&body=${encodeURIComponent(
                  `Tienda: ${formData.shopName}\nContacto: ${formData.contactName}\nCiudad: ${formData.city}\nTel/WhatsApp: ${formData.phone}\nTipo: ${formData.businessType}\nMensaje: ${formData.message}`
                )}`}
                className="px-6 py-4 bg-[#5c94fc] hover:bg-blue-600 text-white rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] font-black text-sm md:text-base flex items-center justify-center gap-2 active:translate-y-0.5 cursor-pointer"
              >
                <span>✉️</span>
                <span>{lang === 'zh' ? '邮件直投' : 'Por Email'}</span>
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* 6. BOTTOM CONTACT & ADDRESS FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 pt-16 text-center">
        <div className="bg-[#f8d878] p-6 md:p-8 rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] text-[#222] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📦</span>
              <span className="font-black text-xl">KYRMAX · 文具贸易与批发供应链</span>
            </div>
            <p className="text-xs md:text-sm font-bold text-gray-800">
              {lang === 'zh'
                ? '专注西班牙本土百货零售供货、专业文具批发与学校机构集采 · 业务经理 1 对 1 服务'
                : 'Suministro y distribución mayorista de material escolar, oficina y papelería comercial en España.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-black">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border-2 border-[#222] shadow-[2px_2px_0px_#222] hover:bg-emerald-50"
            >
              <span>📱</span>
              <span>WhatsApp: {WHATSAPP_NUMBER}</span>
            </a>

            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border-2 border-[#222] shadow-[2px_2px_0px_#222] hover:bg-blue-50"
            >
              <span>✉️</span>
              <span>{EMAIL_ADDRESS}</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
