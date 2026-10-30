import React, { useState, useRef } from 'react';
import { MOCK_SCHOOLS, School } from '../data/schoolsDB';
import {
  CHRISTMAS_PRODUCTS,
  CLOUD_MEDIA_CONFIG,
  CONFIG_I18N,
  Lang,
  getGdriveFallbackUrl,
  getGdriveImageUrl,
} from '../data/christmas2026DB';

interface HomeProps {
  lang: Lang;
  onNavigateToMap: () => void;
  onNavigateToNavidad: () => void;
  onNavigateToCanje: () => void;
}

export function Home({
  lang,
  onNavigateToMap,
  onNavigateToNavidad,
  onNavigateToCanje,
}: HomeProps) {
  const t = CONFIG_I18N[lang];
  const [schoolInput, setSchoolInput] = useState('');
  const [gradeInput, setGradeInput] = useState('1º Primaria');
  const [postalInput, setPostalInput] = useState('');
  const [orderAmount, setOrderAmount] = useState<number>(2000);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSchoolInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSchoolInput(value);
    if (value.trim().length > 0) {
      const filtered = MOCK_SCHOOLS.filter(
        (s) =>
          s.name.toLowerCase().includes(value.toLowerCase()) ||
          s.city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSchools(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // ROI Calculation Logic (REBUILD_SOP §4: €2,000 order -> €3,100+ total value)
  const cashbackValue = Math.round(orderAmount * 0.42);
  const magneticPacks = Math.floor(orderAmount / 50);
  const calendarGiftsValue = magneticPacks * 12 + 35; // Magnetic calendar packs + 20th Anniv Calendar
  const totalReturnValue = orderAmount + cashbackValue + calendarGiftsValue;

  const stitchCards = [
    {
      id: 'navidad-2026',
      tag: lang === 'zh' ? '🔥 最新上线 · 子页面专场' : '🔥 NUEVO · SUBPÁGINA ESPECIAL',
      title:
        lang === 'zh'
          ? '2026 圣诞季 & 日历全景大促'
          : 'Campaña Navidad y Calendarios 2026',
      highlight: '0.1€ - 0.3€ / -15% DTO',
      desc:
        lang === 'zh'
          ? '散装贺卡0.1€起冰点抄底（限占50%·不退货）+ 21款新品原图高清推镜导购 + 京味双主播大片！'
          : 'Tarjetas a granel desde 0,10€ + 21 novedades con zoom HD en Google Drive CDN.',
      bg: 'from-[#b91c1c] to-[#14532d]',
      cta: lang === 'zh' ? '进入圣诞产品子页面 →' : 'Abrir Subpágina Navidad →',
      action: onNavigateToNavidad,
    },
    {
      id: 'regalos-calendario',
      tag: lang === 'zh' ? '🎁 多重买赠叠加' : '🎁 REGALOS ACUMULABLES',
      title:
        lang === 'zh'
          ? '磁吸日历 & 20周年日历狂送'
          : 'Calendarios Magnéticos y 20º Aniv. GRATIS',
      highlight: '+50€ / +10€ FREE',
      desc:
        lang === 'zh'
          ? '圣诞满50€送1包磁吸日历 · 日历满10€送1包磁吸日历 · 下单即送20周年精美日历 · 学生日历1-1.5€抄底！'
          : 'Por cada 50€ en Navidad o 10€ en Agendas, llévate 1 pack de calendario magnético gratis.',
      bg: 'from-[#1e3a8a] to-[#0f172a]',
      cta: lang === 'zh' ? '查看活动详情 →' : 'Ver Promoción →',
      action: onNavigateToNavidad,
    },
    {
      id: 'vuelta-al-cole',
      tag: lang === 'zh' ? '🎒 26届返校季主会场' : '🎒 26ª CAMPAÑA ESCOLAR',
      title:
        lang === 'zh'
          ? '返校季全线 +6+5% 折上折 & 地图找店'
          : 'Vuelta al Cole +6+5% DTO & Mapa Interactivo',
      highlight: '50% CASHBACK',
      desc:
        lang === 'zh'
          ? '连接全西班牙学校书单与附近文具店（Bazar），AI智能匹配周边学校必买清单。'
          : 'Mapa interactivo de colegios y bazares con listas escolares verificadas.',
      bg: 'from-[#b45309] to-[#78350f]',
      cta: lang === 'zh' ? '打开返校季地图 →' : 'Abrir Mapa Escolar →',
      action: onNavigateToMap,
    },
    {
      id: 'billete-dorado',
      tag: lang === 'zh' ? '🎫 线下门店引流核销' : '🎫 SORTEO EN TIENDA',
      title:
        lang === 'zh'
          ? '金票抽奖 (Billete Dorado) 扫码核销'
          : 'Sistema de Canje Billete Dorado',
      highlight: '2€ / 5€ CUPÓN',
      desc:
        lang === 'zh'
          ? '消费者刮出金票二维码，合作文具店手机扫码3秒完成核销抵扣，锁死门店客流！'
          : 'Validación instantánea por QR para comercios asociados Main Paper.',
      bg: 'from-[#6d28d9] to-[#311068]',
      cta: lang === 'zh' ? '进入商家核销台 →' : 'Validar Cupón →',
      action: onNavigateToCanje,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-['Fredoka',sans-serif] pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION (20th Anniversary Red & Gold + Mario Board-Game Style) */}
      <section className="relative bg-gradient-to-br from-[#dc2626] via-[#991b1b] to-[#0f172a] border-b-4 border-[#222] py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f8d878] text-[#222] font-black rounded-full border-3 border-[#222] shadow-[3px_3px_0px_#222] text-xs md:text-sm">
              <span>⭐</span>
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight whitespace-pre-line drop-shadow-[0_4px_0_#222]">
              {t.heroTitle}
            </h1>

            <p className="text-base md:text-lg text-yellow-100 font-medium leading-relaxed max-w-2xl">
              {t.heroDesc}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onNavigateToNavidad}
                className="px-6 py-4 bg-[#f8d878] text-[#222] font-black text-base md:text-lg rounded-2xl border-4 border-[#222] shadow-[5px_5px_0px_#222] hover:translate-y-1 hover:shadow-[2px_2px_0px_#222] transition-all"
              >
                {t.ctaNavidad}
              </button>
              <button
                onClick={onNavigateToMap}
                className="px-6 py-4 bg-[#5c94fc] text-white font-black text-base md:text-lg rounded-2xl border-4 border-[#222] shadow-[5px_5px_0px_#222] hover:translate-y-1 hover:shadow-[2px_2px_0px_#222] transition-all"
              >
                {t.ctaMap}
              </button>
              <button
                onClick={onNavigateToCanje}
                className="px-5 py-4 bg-white/15 backdrop-blur-md text-white font-black text-sm md:text-base rounded-2xl border-3 border-[#f8d878] hover:bg-white/25 transition-all"
              >
                {t.ctaCanje}
              </button>
            </div>
          </div>

          {/* Right Hero Card: Featured Christmas 2026 Subpage Preview (from Google Drive CDN) */}
          <div className="lg:col-span-5">
            <div
              onClick={onNavigateToNavidad}
              className="cursor-pointer bg-[#14532d] border-4 border-[#f8d878] rounded-[2.5rem] p-5 shadow-[8px_8px_0px_#222] hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-[#e52521] text-white font-black text-xs rounded-full border-2 border-[#222]">
                  {lang === 'zh' ? '🎄 圣诞子页面热推' : '🎄 SUBPÁGINA NAVIDAD'}
                </span>
                <span className="text-xs font-black text-[#f8d878]">
                  10.27 — 11.30 · -15% OFF
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 bg-white p-3 rounded-2xl border-3 border-[#222] mb-4">
                {CHRISTMAS_PRODUCTS.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id}
                    className="border border-gray-200 rounded-xl p-1.5 flex flex-col items-center"
                  >
                    <img
                      src={getGdriveImageUrl(prod.gdriveIds[0], 400)}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getGdriveFallbackUrl(
                          prod.gdriveIds[0],
                          400
                        );
                      }}
                      alt={prod.code}
                      className="h-20 object-contain"
                      loading="lazy"
                    />
                    <span className="text-[11px] font-black text-[#222] mt-1">
                      {prod.code} · <span className="text-[#e52521]">{prod.price}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-[#1e1414] border-2 border-[#f8d878] rounded-xl p-3 text-xs space-y-1 mb-3">
                <div className="font-black text-[#fde047]">
                  ★ {lang === 'zh' ? '散装贺卡 0.1€ / 0.2€ / 0.3€ (不退货·限50%)' : 'Tarjetas a granel: 0,10€ / 0,20€ / 0,30€'}
                </div>
                <div className="text-gray-200">
                  ★ {lang === 'zh' ? '圣诞满50€ / 日历满10€ 赠1包磁吸日历 + 送20周年日历' : 'Calendarios magnéticos y 20º Aniversario GRATIS'}
                </div>
              </div>

              <div className="w-full py-3 bg-[#e52521] text-white font-black text-center rounded-xl border-3 border-[#222] shadow-[3px_3px_0px_#222]">
                {lang === 'zh'
                  ? '点击进入 21款圣诞新品高清推镜子页面 →'
                  : 'Entrar al Catálogo Navidad 2026 →'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-14">
        {/* 2. STITCH MODULE CARDS (REBUILD_SOP §2: Horizontal / Grid Stitch Cards) */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-black text-[#f8d878]">{t.stitchTitle}</h2>
            <p className="text-sm text-gray-300 mt-1">{t.stitchSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stitchCards.map((c) => (
              <div
                key={c.id}
                onClick={c.action}
                className={`cursor-pointer bg-gradient-to-br ${c.bg} border-4 border-[#f8d878] rounded-[2.2rem] p-6 shadow-[6px_6px_0px_#222] flex flex-col justify-between hover:-translate-y-1.5 transition-transform`}
              >
                <div>
                  <span className="inline-block px-3 py-1 bg-black/40 text-[#f8d878] font-bold text-xs rounded-full border border-[#f8d878]/50 mb-3">
                    {c.tag}
                  </span>
                  <h3 className="text-2xl font-black text-white leading-snug mb-2">
                    {c.title}
                  </h3>
                  <div className="text-3xl font-black text-[#fde047] my-3 drop-shadow">
                    {c.highlight}
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed mb-6">{c.desc}</p>
                </div>
                <button className="w-full py-3 bg-[#f8d878] text-[#222] font-black text-sm rounded-xl border-3 border-[#222] shadow-[3px_3px_0px_#222]">
                  {c.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. B2B ROI CALCULATOR TABLE (REBUILD_SOP §4: €2000 Order -> €3100+ Value) */}
        <section className="bg-slate-800/90 backdrop-blur-md border-4 border-[#f8d878] rounded-[2.5rem] p-6 md:p-10 shadow-[8px_8px_0px_#222]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#f8d878]">
                {t.roiTitle}
              </h2>
              <p className="text-sm text-gray-300 mt-1">{t.roiSub}</p>
            </div>
            <div className="flex gap-2">
              {[1000, 2000, 3500, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setOrderAmount(amt)}
                  className={`px-4 py-2 rounded-xl font-black text-sm border-2 border-[#222] ${
                    orderAmount === amt
                      ? 'bg-[#e52521] text-white shadow-[3px_3px_0px_#222]'
                      : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
                  }`}
                >
                  €{amt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border-3 border-slate-600 rounded-2xl p-5">
              <div className="text-xs text-gray-400 font-bold mb-1">{t.roiOrderLabel}</div>
              <div className="text-3xl font-black text-white">€{orderAmount}</div>
              <div className="text-xs text-emerald-400 mt-2">
                {lang === 'zh' ? '含圣诞新品 -15% 折后批发价' : 'Incluye -15% DTO en Novedades'}
              </div>
            </div>

            <div className="bg-slate-900 border-3 border-[#e52521] rounded-2xl p-5">
              <div className="text-xs text-gray-400 font-bold mb-1">{t.roiRebateLabel}</div>
              <div className="text-3xl font-black text-[#f87171]">+€{cashbackValue}</div>
              <div className="text-xs text-gray-300 mt-2">
                {lang === 'zh'
                  ? '0.1€贺卡零售3倍毛利 + 促销返利'
                  : 'Margen tarjetas 0,10€ + Cashback'}
              </div>
            </div>

            <div className="bg-slate-900 border-3 border-[#5c94fc] rounded-2xl p-5">
              <div className="text-xs text-gray-400 font-bold mb-1">{t.roiGiftLabel}</div>
              <div className="text-3xl font-black text-[#60a5fa]">
                +€{calendarGiftsValue}
              </div>
              <div className="text-xs text-gray-300 mt-2">
                {lang === 'zh'
                  ? `含 ${magneticPacks} 包免费磁吸日历 + 20周年日历`
                  : `${magneticPacks} packs Calendario Magnético + 20º Aniv.`}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#b91c1c] to-[#d97706] border-3 border-[#f8d878] rounded-2xl p-5 shadow-lg">
              <div className="text-xs text-yellow-100 font-bold mb-1">{t.roiTotalLabel}</div>
              <div className="text-4xl font-black text-[#fde047]">
                €{totalReturnValue}+
              </div>
              <div className="text-xs text-white font-bold mt-2">
                ROI: +{Math.round(((totalReturnValue - orderAmount) / orderAmount) * 100)}%{' '}
                {lang === 'zh' ? '综合增值' : 'Valor Añadido'}
              </div>
            </div>
          </div>
        </section>

        {/* 4. DUAL PORTALS: PARA FAMILIAS & PARA TIENDAS (VUELTA AL COLE MAP ENTRY) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Portal Familias */}
          <div className="bg-white text-[#222] border-4 border-[#222] rounded-[2rem] shadow-[8px_8px_0px_#222] overflow-hidden flex flex-col">
            <div className="bg-[#5c94fc] text-white p-5 border-b-4 border-[#222] flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <span className="text-3xl">🎓</span>{' '}
                {lang === 'zh' ? '家长通道 (Para Familias)' : 'Para Familias'}
              </h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                Vuelta al Cole
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-5">
              <p className="font-bold text-gray-700">
                {lang === 'zh'
                  ? '查找您孩子所在学校的官方文具清单，并在地图上定位最近的合作文具店。'
                  : 'Encuentra tu lista escolar y descubre el bazar más cercano para comprarla.'}
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                  <input
                    type="text"
                    value={schoolInput}
                    onChange={handleSchoolInputChange}
                    placeholder={
                      lang === 'zh'
                        ? '输入学校名称或城市 (如 Zaragoza)...'
                        : 'Nombre de tu colegio o ciudad...'
                    }
                    className="w-full pl-10 pr-4 py-3 border-3 border-[#222] rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-[#5c94fc]/30"
                  />
                  {showSuggestions && filteredSchools.length > 0 && (
                    <ul className="absolute z-50 w-full mt-2 bg-white border-4 border-[#222] rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {filteredSchools.map((school) => (
                        <li
                          key={school.id}
                          onClick={() => {
                            setSchoolInput(school.name);
                            setShowSuggestions(false);
                          }}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                        >
                          <div className="font-bold text-gray-800">{school.name}</div>
                          <div className="text-xs text-gray-500">
                            {school.address}, {school.city}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <select
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full px-4 py-3 border-3 border-[#222] rounded-xl font-semibold text-gray-700 bg-gray-50"
                >
                  <option>Infantil</option>
                  <option>1º Primaria</option>
                  <option>2º Primaria</option>
                  <option>3º Primaria</option>
                  <option>4º Primaria</option>
                  <option>5º Primaria</option>
                  <option>6º Primaria</option>
                </select>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-[#f8d878] rounded-xl p-4 flex flex-col items-center justify-center bg-yellow-50 text-center cursor-pointer hover:bg-yellow-100"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) =>
                    e.target.files?.[0] && setUploadedFile(e.target.files[0])
                  }
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls"
                />
                <span className="text-3xl mb-1">📁</span>
                {uploadedFile ? (
                  <span className="font-black text-[#5c94fc] text-sm">
                    {uploadedFile.name}
                  </span>
                ) : (
                  <span className="font-bold text-gray-600 text-sm">
                    {lang === 'zh'
                      ? '上传学校书单 (PDF / 照片 / Excel)'
                      : 'Sube tu lista escolar (PDF, Foto o Excel)'}
                  </span>
                )}
              </div>

              <button
                onClick={onNavigateToMap}
                className="mt-auto w-full bg-[#f8d878] text-[#222] font-black text-lg py-3.5 rounded-xl border-4 border-[#222] shadow-[4px_4px_0px_#222] hover:translate-y-0.5 transition-all"
              >
                {lang === 'zh' ? '生成清单并查看附近门店 ▶' : '¡Generar mi lista! ▶'}
              </button>
            </div>
          </div>

          {/* Portal Tiendas / B2B */}
          <div className="bg-white text-[#222] border-4 border-[#222] rounded-[2rem] shadow-[8px_8px_0px_#222] overflow-hidden flex flex-col">
            <div className="bg-[#e52521] text-white p-5 border-b-4 border-[#222] flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <span className="text-3xl">🏪</span>{' '}
                {lang === 'zh' ? '商家B2B通道 (Para Tiendas)' : 'Para Tiendas / Bazar'}
              </h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                B2B Stock & Navidad
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-5">
              <p className="font-bold text-gray-700">
                {lang === 'zh'
                  ? '一键查看周边学校热销返校季书单，或直接进入2026圣诞季21款爆品与0.1€贺卡订货专场。'
                  : 'Prepara tu stock escolar y navideño con las referencias de mayor rotación de Main Paper.'}
              </p>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📍</span>
                <input
                  type="text"
                  value={postalInput}
                  onChange={(e) => setPostalInput(e.target.value)}
                  placeholder={
                    lang === 'zh'
                      ? '输入店铺邮编或城市...'
                      : 'Tu código postal o ciudad...'
                  }
                  className="w-full pl-10 pr-4 py-3 border-3 border-[#222] rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-[#e52521]/30"
                />
              </div>

              <div className="bg-red-50 p-4 rounded-xl border-2 border-[#e52521] text-sm text-gray-700 space-y-1">
                <div className="font-black text-[#e52521]">
                  🚀 {lang === 'zh' ? 'B2B 专属数字化赋能' : 'Ventaja B2B Main Paper'}
                </div>
                <p>
                  {lang === 'zh'
                    ? '云端图片直连 Google Drive (Folder ID: ' +
                      CLOUD_MEDIA_CONFIG.gdriveFolderId.slice(0, 8) +
                      '...)，支持随时在手机端放大查看每款圣诞新品箱规与细节。'
                    : 'Catálogo conectado en tiempo real con Google Drive CDN y vídeos guiados en la nube.'}
                </p>
              </div>

              <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={onNavigateToNavidad}
                  className="w-full bg-[#14532d] text-[#f8d878] font-black text-base py-3.5 rounded-xl border-4 border-[#222] shadow-[4px_4px_0px_#222] hover:translate-y-0.5 transition-all"
                >
                  🎄 {lang === 'zh' ? '圣诞21款爆品子页' : 'Especial Navidad'}
                </button>
                <button
                  onClick={onNavigateToMap}
                  className="w-full bg-[#e52521] text-white font-black text-base py-3.5 rounded-xl border-4 border-[#222] shadow-[4px_4px_0px_#222] hover:translate-y-0.5 transition-all"
                >
                  📍 {lang === 'zh' ? '查看周边学校地图' : 'Ver Mapa Colegios'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
