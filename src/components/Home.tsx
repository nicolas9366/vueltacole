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
}) => {
  const WHATSAPP_NUMBER = '604229098';
  const WHATSAPP_LINK = 'https://wa.me/34604229098';
  const EMAIL_ADDRESS = 'info@kyrmax.com';

  const t = (zh: string, en: string, es: string) =>
    lang === 'zh' ? zh : lang === 'en' ? en : es;

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
      formData.businessType === 'corporativo'
        ? t('企事业单位 / 大宗采购', 'Corporate / Bulk Order', 'Empresa / Compra Corporativa')
        : formData.businessType === 'colegio'
          ? t('学校机构 / 教育培训', 'School / Academy', 'Colegio / Centro Educativo')
          : formData.businessType === 'comercio'
            ? t('文具零售 / 百货门店', 'Retail / Stationery Store', 'Comercio / Papelería')
            : t('其他咨询', 'Other Inquiry', 'Otros');

    let msg = `${t('🤝 *文具贸易与采购咨询*', '🤝 *Stationery Wholesale Inquiry*', '🤝 *Consulta Comercial de Papelería*')}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🏪 ${t('店铺/公司', 'Company/Store', 'Empresa/Tienda')}: ${formData.shopName || '-'}\n`;
    msg += `👤 ${t('负责人', 'Contact', 'Contacto')}: ${formData.contactName || '-'}\n`;
    msg += `📍 ${t('所在城市', 'City', 'Ciudad')}: ${formData.city || '-'}\n`;
    msg += `📞 ${t('电话', 'Phone', 'Tel')}: ${formData.phone || '-'}\n`;
    msg += `✉️ Email: ${formData.email || '-'}\n`;
    msg += `📦 ${t('业务类型', 'Type', 'Tipo')}: ${typeLabel}\n`;
    if (formData.message) {
      msg += `💬 ${t('需求', 'Message', 'Mensaje')}: ${formData.message}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `vueltacole.com`;

    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(msg)}`, '_blank');
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#222] font-['Fredoka',sans-serif] pb-16 overflow-x-hidden">
      {/* 1. TOP HERO BANNER */}
      <section className="bg-[#e52521] border-b-4 border-[#222] text-white px-4 py-10 md:py-16 relative overflow-hidden shadow-xl">
        <div className="hidden sm:block absolute top-2 left-6 text-yellow-300 text-3xl animate-bounce">★</div>
        <div className="absolute top-8 right-6 md:right-12 text-white/15 text-7xl md:text-9xl font-black select-none pointer-events-none">
          ★
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="bg-[#f8d878] text-[#222] text-[11px] sm:text-xs md:text-sm font-black px-3.5 py-1.5 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222] uppercase tracking-wider">
              {t(
                '⭐ 文具精选零售 · 大客户集采服务',
                '⭐ Commercial Stationery & Corporate Supply',
                '⭐ Papelería Comercial & Grandes Cuentas'
              )}
            </span>
            <span className="bg-[#5c94fc] text-white text-[11px] sm:text-xs md:text-sm font-black px-3.5 py-1.5 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222]">
              {t(
                '现货选品 · 专业采购对接',
                'Full Stock · Direct Trade Support',
                'Catálogo Extenso & Atención Directa'
              )}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-[3px_3px_0px_#222] mb-4 leading-tight">
            {t(
              '文具精选商城 & 大客户采购',
              'COMMERCIAL STATIONERY & WHOLESALE',
              'PAPELERÍA COMERCIAL & GRANDES CUENTAS'
            )}
            <br />
            <span className="text-[#f8d878]">
              {t(
                '全品类现货文具 · 机构大宗定制采购',
                'In-Stock Catalog · Institutional Supply',
                'Catálogo de Productos & Suministro Institucional'
              )}
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-yellow-100 font-bold max-w-3xl mx-auto mb-7 leading-relaxed px-1">
            {t(
              '精选数千款现货文具产品，涵盖学生书写、办公桌面、收纳文件、本册纸品、美术画材与各大主流文具品牌。支持自主零售选品选购，并为学校机构、企业单位及大客户提供专业大宗采购对接服务。',
              'Curated selection of thousands of in-stock stationery items covering school writing, office essentials, filing, notebooks, fine arts, and top brands—serving both retail selection and bulk institutional orders.',
              'Amplia selección de material escolar, oficina, archivo, bellas artes y primeras marcas en stock. Atención comercial directa tanto para compras minoristas como para grandes pedidos institucionales.'
            )}
          </p>

          {/* Fast Contact Callout Box */}
          <div className="max-w-2xl mx-auto bg-white p-4 md:p-6 rounded-3xl border-4 border-[#222] shadow-[5px_5px_0px_#222] text-[#222] mb-7">
            <div className="text-xs md:text-sm font-black text-gray-600 uppercase mb-3">
              {t(
                '⚡ 业务咨询与采购订货绿色通道',
                '⚡ Direct Trade & Order Channels',
                '⚡ Canales Directos de Consulta y Pedidos'
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                  t(
                    '您好，我想咨询文具贸易与批发订货合作！',
                    'Hello, I would like to request your stationery wholesale catalog and pricing.',
                    'Hola, me gustaría consultar tarifas y catálogo mayorista de papelería.'
                  )
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl border-2 border-[#222] shadow-[3px_3px_0px_#222] font-black text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📱</span>
                <span>WhatsApp: {WHATSAPP_NUMBER}</span>
              </a>

              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="w-full sm:w-auto px-5 py-3 bg-[#5c94fc] hover:bg-blue-600 text-white rounded-2xl border-2 border-[#222] shadow-[3px_3px_0px_#222] font-black text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✉️</span>
                <span>{EMAIL_ADDRESS}</span>
              </a>
            </div>
            <p className="text-[11px] md:text-xs text-gray-500 font-bold mt-2.5">
              {t(
                '💡 业务代表一对一专业对接，快速获取商品批发报价单、动销建议与样品展厅支持',
                '💡 Dedicated 1-on-1 account support for wholesale price lists, product samples, and display advice.',
                '💡 Atención personalizada 1 a 1 para facilitarte listas de precios, muestras y condiciones comerciales.'
              )}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onNavigateToTienda}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#f8d878] hover:bg-yellow-400 text-[#222] rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] font-black text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🛒</span>
              <span>
                {t(
                  '浏览全景文具商城 & 选品订货',
                  'Explore Online Catalog & Shop',
                  'Explorar Catálogo & Tienda Online'
                )}
              </span>
            </button>

            {onNavigateToMap && (
              <button
                onClick={onNavigateToMap}
                className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-gray-100 text-[#222] rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🎒</span>
                <span>
                  {t('返校季周边学校地图', 'School Store Map', 'Mapa Escolar')}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. CORE PERFORMANCE METRICS (Mobile-safe spacing: mt-6 on mobile, -mt-8 on desktop) */}
      <section className="max-w-6xl mx-auto px-4 mt-6 md:-mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              num: '6,000+',
              label: t('现货文具 SKU', 'In-Stock SKUs', 'Referencias en Stock'),
              icon: '📦',
            },
            {
              num: t('全系现货', 'Full Stock', 'Stock Completo'),
              label: t('品类齐全常备库存', 'Permanent Availability', 'Stock Permanente'),
              icon: '📦',
            },
            {
              num: t('专业对接', 'Pro Support', 'Atención Directa'),
              label: t('大客户采购专属服务', 'Key Accounts & B2B', 'Grandes Cuentas & Institucional'),
              icon: '🤝',
            },
            {
              num: t('多元品牌', 'Top Brands', 'Primeras Marcas'),
              label: t('知名名牌与源头品质', 'Leading Brands & Quality', 'Primeras Marcas y Suministro'),
              icon: '⭐',
            },
          ].map((m, i) => (
            <div
              key={i}
              className="bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border-4 border-[#222] shadow-[4px_4px_0px_#222] text-center flex flex-col items-center justify-center"
            >
              <div className="text-2xl sm:text-3xl mb-1">{m.icon}</div>
              <div className="text-lg sm:text-2xl md:text-3xl font-black text-[#e52521] tracking-tight leading-tight">
                {m.num}
              </div>
              <div className="text-[11px] sm:text-xs md:text-sm font-black text-gray-700 mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SIX CORE COMPETITIVE ADVANTAGES */}
      <section className="max-w-6xl mx-auto px-4 pt-12 md:pt-16">
        <div className="text-center mb-8 md:mb-10">
          <span className="bg-[#f8d878] text-[#222] text-xs font-black px-3.5 py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222] uppercase">
            {t('⭐ 核心优势与服务', '⭐ Core Advantages', '⭐ Ventajas y Servicios')}
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#222] mt-3 drop-shadow-[2px_2px_0px_#f8d878]">
            {t(
              '专业文具选品与大客户采购支持',
              'Professional Stationery & Key Account Supply',
              'Suministro Profesional de Papelería y Grandes Cuentas'
            )}
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-bold max-w-2xl mx-auto mt-1">
            {t(
              '专注自主文具零售选品与机构大客户采购，为您提供丰富齐全的现货文具与贴心服务',
              'End-to-end stationery supply for retail stores, schools, and institutional buyers.',
              'Suministro integral para proyectos educativos, compras institucionales y venta comercial con atención dedicada.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {[
            {
              icon: '🏛️',
              title: t('大客户与机构大宗采购', 'Corporate & Bulk Supply', 'Suministro para Grandes Cuentas'),
              desc: t(
                '为学校、教育机构、企业办公等大客户提供专属集采对接，支持根据需求制定批量采购方案与样品质检。',
                'Dedicated account management for schools, academies, and corporate bulk purchasing.',
                'Atención especializada para colegios, academias y empresas que requieren compras consolidadas.'
              ),
              tag: t('大宗采购', 'Bulk Orders', 'Grandes Cuentas'),
            },
            {
              icon: '📦',
              title: t('6,000+ SKU 全品类现货供应', '6,000+ In-Stock SKUs', '+6.000 Referencias en Stock'),
              desc: t(
                '涵盖学生书写用具、办公桌面、收纳文件夹、本册纸品、Artix 美术画材与高性价比基础系列，一站式购齐。',
                'School writing, office supplies, filing, notebooks, Artix fine arts, and everyday bestsellers.',
                'Material escolar, artículos de oficina, archivo, cuadernos, bellas artes y líneas de alta rotación.'
              ),
              tag: t('现货全系', 'Full Stock', 'Stock Completo'),
            },
            {
              icon: '🏪',
              title: t('自主精选零售选品', 'Curated Retail Catalog', 'Catálogo Minorista Seleccionado'),
              desc: t(
                '直观清晰的在线选品商城与样品展厅，随时随地挑选最新文具产品，快速加入选购清单。',
                'Intuitive digital showroom to browse trending items and build your selection fast.',
                'Exposición digital cómoda y visual para descubrir novedades y tramitar tu selección fácilmente.'
              ),
              tag: t('精选零售', 'Retail Pick', 'Catálogo'),
            },
            {
              icon: '🏷️',
              title: t('主流品牌与品质保障', 'Leading Brands & Quality', 'Gama Multimarca Líder'),
              desc: t(
                '联合供应 Bic、Milan、Pilot、Stabilo、Edding、Main Paper 等各大知名品牌，满足多样化使用与教学需求。',
                'Consolidated supply of Bic, Milan, Pilot, Stabilo, Edding, and Main Paper lines.',
                'Disponibilidad de marcas reconocidas del mercado escolar y de oficina en un único pedido.'
              ),
              tag: t('知名品牌', 'Top Brands', 'Primeras Marcas'),
            },
            {
              icon: '🎁',
              title: t('展架支持与样品陈列', 'Display Racks & Merchandising', 'Expositores y Soporte Comercial'),
              desc: t(
                '提供配套产品陈列展架、分类物料与宣传画册，全方位满足店面及机构展示需求。',
                'In-store floor and counter displays, printed catalogs, and seasonal promotional materials.',
                'Mobiliario comercial, expositores de suelo y sobremesa, catálogos y material promocional.'
              ),
              tag: t('展示支持', 'Merchandising', 'Expositores'),
            },
            {
              icon: '💻',
              title: t('便捷数字化清单管理', 'Fast Digital Order Lists', 'Gestión Digital Cómoda'),
              desc: t(
                '支持在线自主挑选加购、清单核对，并通过 WhatsApp 快速发送报单，沟通高效顺畅。',
                'Select items online, review quantities, and send your order list directly via WhatsApp.',
                'Selecciona cómodamente tus productos y tramita tus consultas directamente por WhatsApp.'
              ),
              tag: t('便捷选购', 'Digital Orders', 'Pedido Ágil'),
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-5 md:p-6 rounded-3xl border-4 border-[#222] shadow-[5px_5px_0px_#222] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl md:text-4xl">{card.icon}</span>
                  <span className="bg-yellow-100 text-[#222] text-[11px] font-black px-2.5 py-1 rounded-lg border-2 border-[#222]">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-[#222] mb-2">{card.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 font-bold leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FOUR PARTNERSHIP MODELS */}
      <section className="max-w-6xl mx-auto px-4 pt-12 md:pt-16">
        <div className="bg-[#5c94fc] p-5 md:p-10 rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] text-white">
          <div className="text-center mb-8">
            <span className="bg-[#f8d878] text-[#222] text-xs font-black px-3.5 py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222] uppercase">
              {t('🤝 合作模式', '🤝 Partnerships', '🤝 Modalidades')}
            </span>
            <h2 className="text-2xl md:text-4xl font-black mt-3 drop-shadow-[2px_2px_0px_#222]">
              {t('多元灵活的商业合作方式', 'Flexible Commercial Partnerships', 'Modalidades de Asociación Flexibles')}
            </h2>
            <p className="text-sm md:text-base text-blue-100 font-bold max-w-xl mx-auto mt-1">
              {t(
                '支持自主选品零售选购，并为各类大客户提供定制化集采服务',
                'Tailored solutions for retail stores and high-volume institutional procurement.',
                'Soluciones adaptadas para compras minoristas y suministros de gran volumen.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: '🏛️',
                title: t('大客户大宗集采', 'Key Corporate Accounts', 'Grandes Cuentas & Empresas'),
                desc: t(
                  '专为大型企事业单位提供按需选品与大宗订货方案，业务经理全程对接。',
                  'Consolidated bulk procurement with dedicated account support.',
                  'Suministro consolidado para empresas y entidades con asesoría directa.'
                ),
              },
              {
                icon: '🏫',
                title: t('学校与教育机构', 'Schools & Academies', 'Colegios y Academias'),
                desc: t(
                  '提供学期常用文具、教学画材、倒数日历与活动物资选品支持。',
                  'Term stationery, fine-arts kits, and educational supplies.',
                  'Material escolar, manualidades y artículos didácticos para centros educativos.'
                ),
              },
              {
                icon: '🏪',
                title: t('自主零售精品选购', 'Retail & Bazar Stores', 'Selección Minorista'),
                desc: t(
                  '精选高频实用文具现货，分类直观清晰，支持在线挑选与快速报单。',
                  'High-turnover stationery organized cleanly for fast restocking.',
                  'Catálogo de papelería seleccionada con tramitación ágil de pedidos.'
                ),
              },
              {
                icon: '🎁',
                title: t('节庆与开学专场', 'Seasonal Campaigns', 'Campañas Especiales'),
                desc: t(
                  '返校季全套文具、圣诞季礼品贺卡与 2027 年历日历现货直供。',
                  'Back-to-school sets, festive stationery, and 2027 calendars in stock.',
                  'Campañas de vuelta al cole, Navidad y calendarios con stock garantizado.'
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border-2 border-[#222] shadow-[4px_4px_0px_#222] text-[#222]"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-lg font-black mb-1">{item.title}</div>
                <div className="text-xs text-gray-600 font-bold leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAST INQUIRY REGISTRATION FORM */}
      <section className="max-w-4xl mx-auto px-4 pt-12 md:pt-16">
        <div className="bg-white p-5 md:p-10 rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222]">
          <div className="text-center mb-6">
            <span className="bg-[#f8d878] text-[#222] text-xs font-black px-3.5 py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222] uppercase">
              {t('📝 业务咨询登记', '📝 Trade Inquiry', '📝 Contacto Comercial')}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#222] mt-3">
              {t(
                '提交采购意向 · 业务代表 1 对 1 服务',
                'Request Catalog & Wholesale Pricing',
                'Solicitar Catálogo y Contacto Comercial'
              )}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-bold mt-1">
              {t(
                '填写基本信息后将自动拉起 WhatsApp 业务对接，或直接联络电话 604229098',
                'Fill out the quick form to start a WhatsApp inquiry or call +34 604 229 098.',
                'Rellena el formulario y te contactaremos para facilitarte catálogo y condiciones comerciales.'
              )}
            </p>
          </div>

          {formSubmitted && (
            <div className="mb-6 p-4 bg-emerald-100 border-2 border-emerald-500 rounded-2xl text-emerald-900 font-black text-center text-sm">
              ✅{' '}
              {t(
                '已为您整理好咨询信息并打开 WhatsApp！如未弹出，请直接联系: 604229098',
                'Inquiry ready! Send directly via WhatsApp to +34 604 229 098.',
                '¡Solicitud preparada! Puedes enviarla directamente por WhatsApp al 604229098.'
              )}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {t('店铺 / 公司名称 *', 'Store / Company Name *', 'Nombre de Tienda / Empresa *')}
                </label>
                <input
                  type="text"
                  required
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder={t('例如: 马德里文具百货', 'e.g. Central Stationery Ltd.', 'Ej: Bazar Centro')}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {t('负责人姓名 *', 'Contact Name *', 'Persona de Contacto *')}
                </label>
                <input
                  type="text"
                  required
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder={t('例如: 张先生', 'e.g. Alex Smith', 'Ej: Carlos García')}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {t('所在城市 / 省份 *', 'City / Region *', 'Ciudad / Provincia *')}
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Madrid, Barcelona..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {t('WhatsApp / 联络电话 *', 'WhatsApp / Phone *', 'WhatsApp / Teléfono *')}
                </label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+34 600..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  {t('电子邮箱', 'Email', 'Email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">
                {t('您的主营业务类型', 'Business Type', 'Tipo de Comercio / Actividad')}
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none"
              >
                <option value="corporativo">
                  {t('企事业单位 / 大客户大宗采购', 'Corporate / Bulk Purchase', 'Empresa / Compra Corporativa')}
                </option>
                <option value="colegio">
                  {t('学校 / 家委会 / 教育培训', 'School / Educational Center', 'Colegio / Centro Educativo')}
                </option>
                <option value="comercio">
                  {t('文具零售 / 精品店', 'Stationery / Retail Store', 'Comercio / Papelería')}
                </option>
                <option value="otro">{t('其他采购咨询', 'Other', 'Otros')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1">
                {t('意向需求或留言', 'Message / Notes', 'Mensaje / Observaciones')}
              </label>
              <textarea
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t(
                  '例如：希望了解起订金额、畅销文具清单、展架配送政策或索取样品...',
                  'e.g. Request PDF catalog, minimum order terms, or product samples.',
                  'Ej: Solicitar catálogo en PDF y condiciones de primer pedido.'
                )}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#222] text-sm font-bold bg-[#fcf8f2] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] font-black text-base md:text-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📱</span>
                <span>
                  {t('一键通过 WhatsApp 提交咨询', 'Send Inquiry via WhatsApp', 'Enviar Consulta por WhatsApp')}
                </span>
              </button>

              <a
                href={`mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
                  `Commercial Inquiry - ${formData.shopName || 'KYRMAX'}`
                )}`}
                className="px-6 py-4 bg-[#5c94fc] hover:bg-blue-600 text-white rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] font-black text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✉️</span>
                <span>{t('邮件直投', 'By Email', 'Por Email')}</span>
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* 6. BOTTOM CONTACT & ADDRESS FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 pt-12 md:pt-16 text-center">
        <div className="bg-[#f8d878] p-6 md:p-8 rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] text-[#222] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-2xl">📦</span>
              <span className="font-black text-lg md:text-xl">
                {t(
                  'KYRMAX · 文具精选与大客户采购服务',
                  'KYRMAX · Stationery & Key Account Supply',
                  'KYRMAX · Papelería y Suministro Comercial'
                )}
              </span>
            </div>
            <p className="text-xs md:text-sm font-bold text-gray-800">
              {t(
                '专注自主文具零售选品与学校机构大客户集采 · 专属客服 1 对 1 服务',
                'Dedicated retail selection & institutional stationery supply in Spain.',
                'Catálogo de papelería seleccionada y suministro institucional en España.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-black">
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
