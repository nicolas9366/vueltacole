import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DAILY_VITRINA_ITEMS, DailyVitrinaEntry, VitrinaCategory } from '../data/dailyVitrinaDB';
import { Lang } from '../data/christmas2026DB';

interface AppleShowcaseProps {
  lang: Lang;
  onSetLang?: (l: Lang) => void;
}

const WHATSAPP_PHONE = '34604229098';

const EDITORIAL_UI: Record<
  Lang,
  {
    brand: string;
    collection: string;
    storeTitle: string;
    storeSubtitle: string;
    allCats: string;
    catWriting: string;
    catArt: string;
    catOffice: string;
    searchPlaceholder: string;
    photosCount: string;
    videosCount: string;
    viewDetails: string;
    addToBag: string;
    backToCatalog: string;
    overview: string;
    gallery: string;
    film: string;
    specs: string;
    scrollCta: string;
    galleryKicker: string;
    galleryHeading: string;
    gallerySub: string;
    filmKicker: string;
    filmHeading: string;
    filmSub: string;
    bagTitle: string;
    bagEmpty: string;
    bagWhatsapp: string;
    bagExport: string;
    bagClear: string;
    packsUnit: string;
    eanLabel: string;
    packLabel: string;
    footerBrand: string;
    footerTag: string;
  }
> = {
  zh: {
    brand: 'MP* STYLE',
    collection: 'MP* 旗舰选品 · 多图实景销售展厅',
    storeTitle: '每一款畅销文具，都有实景细节与视频验证。',
    storeSubtitle: '精选西班牙市场高周转爆款，内置多角度商业场景图、微距笔触实拍与双语展示短片，点击任意单品进入完整详情页。',
    allCats: '全部精选',
    catWriting: '书写工具',
    catArt: '美术画材',
    catOffice: '办公与修正',
    searchPlaceholder: '搜索型号 SKU 或商品关键词...',
    photosCount: '张高清实景图',
    videosCount: '支演示短片',
    viewDetails: '查看详情与视频',
    addToBag: '加入询单清单',
    backToCatalog: '返回全部旗舰单品',
    overview: '概览',
    gallery: '细节图集',
    film: '动态短片',
    specs: '包装与条码',
    scrollCta: '探索实效细节',
    galleryKicker: 'VISUAL ARCHIVE',
    galleryHeading: '每一处质感，清晰可见。',
    gallerySub: '真实使用场景与微距笔触表现，轻触图片可全屏放大赏析。',
    filmKicker: 'IN MOTION',
    filmHeading: '光影之间，看懂表现力。',
    filmSub: '从开盒上手到多材质落笔，一镜呈现真实创作体验。',
    bagTitle: 'B2B 选品询单清单',
    bagEmpty: '暂未添加产品，请从目录中挑选需要的型号。',
    bagWhatsapp: '一键发送 WhatsApp 询单',
    bagExport: '导出 CSV 清单',
    bagClear: '清空',
    packsUnit: '包',
    eanLabel: 'EAN 条码',
    packLabel: '批发包装',
    footerBrand: 'MP* STYLE · KYRMAX STUDIO',
    footerTag: '专注日常创作美感与专业书写表现',
  },
  en: {
    brand: 'MP* STYLE',
    collection: 'MP* FLAGSHIP · EDITORIAL SHOWROOM',
    storeTitle: 'Every bestselling item, backed by multi-angle detail & video.',
    storeSubtitle: 'Explore our curated Spanish market bestsellers with studio photography, macro texture shots, and dual-format showcase films.',
    allCats: 'All Flagships',
    catWriting: 'Writing',
    catArt: 'Fine Arts',
    catOffice: 'Office & Glue',
    searchPlaceholder: 'Search SKU or product name...',
    photosCount: 'HD photos',
    videosCount: 'videos',
    viewDetails: 'View Full Details',
    addToBag: 'Add to Inquiry',
    backToCatalog: 'All Flagship Products',
    overview: 'Overview',
    gallery: 'Gallery',
    film: 'Film',
    specs: 'Specifications',
    scrollCta: 'Explore the craft',
    galleryKicker: 'VISUAL ARCHIVE',
    galleryHeading: 'Every nuance, framed clearly.',
    gallerySub: 'Studio lighting and real-surface performance. Tap any frame to inspect in full screen.',
    filmKicker: 'IN MOTION',
    filmHeading: 'Precision in every stroke.',
    filmSub: 'Watch color payoff, ink flow, and everyday versatility unfold naturally.',
    bagTitle: 'B2B Inquiry List',
    bagEmpty: 'Your inquiry list is empty. Add flagship items to request wholesale pricing.',
    bagWhatsapp: 'Send Inquiry via WhatsApp',
    bagExport: 'Export CSV',
    bagClear: 'Clear',
    packsUnit: 'packs',
    eanLabel: 'EAN Barcode',
    packLabel: 'Wholesale Pack',
    footerBrand: 'MP* STYLE · KYRMAX STUDIO',
    footerTag: 'Crafted for modern studio creativity and everyday precision',
  },
  es: {
    brand: 'MP* STYLE',
    collection: 'MP* FLAGSHIP · CATÁLOGO EDITORIAL',
    storeTitle: 'Cada superventas, presentado con detalle real y vídeo.',
    storeSubtitle: 'Explora nuestra selección de mayor rotación en España con fotografía de estudio, macros de uso real y vídeos de demostración.',
    allCats: 'Todos',
    catWriting: 'Escritura',
    catArt: 'Bellas Artes',
    catOffice: 'Oficina y Escolar',
    searchPlaceholder: 'Buscar por referencia SKU o nombre...',
    photosCount: 'fotos HD',
    videosCount: 'vídeos',
    viewDetails: 'Ver Detalle Completo',
    addToBag: 'Añadir a Consulta',
    backToCatalog: 'Volver a Colección Flagship',
    overview: 'Resumen',
    gallery: 'Galería',
    film: 'Vídeo',
    specs: 'Especificaciones',
    scrollCta: 'Descubrir detalles',
    galleryKicker: 'ARCHIVO VISUAL',
    galleryHeading: 'Cada matiz, en primer plano.',
    gallerySub: 'Resultados reales sobre distintas superficies. Toca cualquier imagen para ampliarla.',
    filmKicker: 'EN MOVIMIENTO',
    filmHeading: 'Color vivo en cada trazo.',
    filmSub: 'Observa la fluidez, cobertura y acabado en uso real.',
    bagTitle: 'Lista de Pedido B2B',
    bagEmpty: 'Tu lista está vacía. Añade referencias para solicitar presupuesto.',
    bagWhatsapp: 'Enviar Pedido por WhatsApp',
    bagExport: 'Exportar CSV',
    bagClear: 'Vaciar',
    packsUnit: 'packs',
    eanLabel: 'Código EAN',
    packLabel: 'Formato Mayorista',
    footerBrand: 'MP* STYLE · KYRMAX STUDIO',
    footerTag: 'Diseño y color para crear cada día',
  },
};

export const AppleShowcase: React.FC<AppleShowcaseProps> = ({ lang, onSetLang }) => {
  const ui = EDITORIAL_UI[lang];

  // Only show richly curated flagship products with multi-angle galleries & videos
  const flagshipItems = useMemo(
    () => DAILY_VITRINA_ITEMS.filter((i) => i.videos.length > 0 || i.images.length >= 3),
    []
  );

  const [selectedSku, setSelectedSku] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const qSku = new URLSearchParams(window.location.search).get('sku');
      if (qSku) return qSku;
    }
    return null;
  });

  const [catFilter, setCatFilter] = useState<'all' | VitrinaCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeThumbById, setActiveThumbById] = useState<Record<string, number>>({});
  const [detailImgIndex, setDetailImgIndex] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [bag, setBag] = useState<{ sku: string; qty: number }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mp_flagship_bag') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mp_flagship_bag', JSON.stringify(bag));
    } catch {}
  }, [bag]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImg(null);
        setIsBagOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const selectedItem: DailyVitrinaEntry | null = useMemo(() => {
    if (!selectedSku) return null;
    return (
      flagshipItems.find(
        (i) =>
          i.sku.toLowerCase() === selectedSku.toLowerCase() ||
          i.sku.split('/')[0].trim().toLowerCase() === selectedSku.toLowerCase() ||
          i.id === selectedSku.toLowerCase()
      ) || flagshipItems[0] || null
    );
  }, [selectedSku, flagshipItems]);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return flagshipItems.filter((item) => {
      if (catFilter !== 'all' && item.catKey !== catFilter) return false;
      if (!q) return true;
      const hay = `${item.sku} ${item.ean} ${item.titleZh} ${item.titleEn} ${item.titleEs}`.toLowerCase();
      return hay.includes(q);
    });
  }, [flagshipItems, catFilter, searchQuery]);

  const getTitle = (x: DailyVitrinaEntry) =>
    lang === 'zh' ? x.titleZh : lang === 'en' ? x.titleEn : x.titleEs;
  const getTagline = (x: DailyVitrinaEntry) =>
    lang === 'zh' ? x.taglineZh : lang === 'en' ? x.taglineEn : x.taglineEs;
  const getHighlights = (x: DailyVitrinaEntry) =>
    lang === 'zh' ? x.highlightsZh : lang === 'en' ? x.highlightsEn : x.highlightsEs;
  const getPack = (x: DailyVitrinaEntry) =>
    lang === 'zh' ? x.packInfoZh : lang === 'en' ? x.packInfoEn : x.packInfoEs;

  const openProduct = (sku: string) => {
    setSelectedSku(sku);
    setDetailImgIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToBag = (sku: string) => {
    setBag((prev) => {
      const existing = prev.find((b) => b.sku === sku);
      if (existing) return prev.map((b) => (b.sku === sku ? { ...b, qty: b.qty + 1 } : b));
      return [...prev, { sku, qty: 1 }];
    });
    setIsBagOpen(true);
  };

  const updateBagQty = (sku: string, delta: number) => {
    setBag((prev) =>
      prev
        .map((b) => (b.sku === sku ? { ...b, qty: b.qty + delta } : b))
        .filter((b) => b.qty > 0)
    );
  };

  const totalBagCount = bag.reduce((s, b) => s + b.qty, 0);

  const sendWhatsApp = () => {
    if (!bag.length) return;
    const lines = bag.map((b) => {
      const found = flagshipItems.find((i) => i.sku === b.sku);
      return `- ${b.sku} | ${found ? getTitle(found) : b.sku} x ${b.qty} ${ui.packsUnit}`;
    });
    const text = `MP* Flagship Inquiry:\n${lines.join('\n')}`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  const exportCsv = () => {
    if (!bag.length) return;
    const rows = [['SKU', 'EAN', 'Title', 'Packs']];
    bag.forEach((b) => {
      const found = flagshipItems.find((i) => i.sku === b.sku);
      rows.push([
        b.sku,
        found?.ean || '',
        `"${(found ? getTitle(found) : b.sku).replace(/"/g, '""')}"`,
        String(b.qty),
      ]);
    });
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mp_flagship_inquiry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div
      className="min-h-screen bg-[#FAFAFA] text-[#09090B] antialiased overflow-x-hidden selection:bg-[#EC4899]/20"
      style={{ fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Fullscreen 2K Lightbox */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-[#09090B]/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
        >
          <button
            aria-label="Close"
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxImg}
            alt="Detail view"
            className="max-w-full max-h-[88vh] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}

      {/* Slide-over B2B Inquiry Bag Drawer */}
      {isBagOpen && (
        <div
          onClick={() => setIsBagOpen(false)}
          className="fixed inset-0 z-50 bg-[#09090B]/50 backdrop-blur-sm flex justify-end"
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-zinc-200"
          >
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <h2
                className="text-lg font-bold text-[#09090B]"
                style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
              >
                {ui.bagTitle}
              </h2>
              <button
                onClick={() => setIsBagOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!bag.length ? (
                <p className="text-sm text-zinc-500">{ui.bagEmpty}</p>
              ) : (
                bag.map((entry) => {
                  const p = flagshipItems.find((i) => i.sku === entry.sku);
                  if (!p) return null;
                  return (
                    <div key={entry.sku} className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                      <img
                        src={p.heroImage}
                        alt={p.sku}
                        className="w-16 h-16 rounded-xl object-cover border border-zinc-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold tracking-wider text-[#EC4899]">{p.sku}</div>
                        <div className="text-sm font-semibold text-[#09090B] truncate">{getTitle(p)}</div>
                        <div className="text-xs text-zinc-500 truncate">{getPack(p)}</div>
                      </div>
                      <div className="flex items-center gap-1.5 border border-zinc-200 rounded-full px-2 py-1">
                        <button
                          onClick={() => updateBagQty(entry.sku, -1)}
                          className="w-5 h-5 text-xs font-bold hover:text-[#EC4899] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{entry.qty}</span>
                        <button
                          onClick={() => updateBagQty(entry.sku, 1)}
                          className="w-5 h-5 text-xs font-bold hover:text-[#EC4899] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {bag.length > 0 && (
              <div className="p-6 border-t border-zinc-200 space-y-3 bg-zinc-50">
                <button
                  onClick={sendWhatsApp}
                  className="w-full py-3 rounded-full bg-[#09090B] hover:bg-[#EC4899] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  {ui.bagWhatsapp}
                </button>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={exportCsv}
                    className="py-2.5 rounded-full border border-zinc-300 bg-white hover:border-[#09090B] text-xs font-semibold cursor-pointer"
                  >
                    {ui.bagExport}
                  </button>
                  <button
                    onClick={() => setBag([])}
                    className="py-2.5 rounded-full border border-zinc-300 bg-white hover:border-red-500 hover:text-red-600 text-xs font-semibold cursor-pointer"
                  >
                    {ui.bagClear}
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Minimalist Sticky Glass Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FAFAFA]/85 border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setSelectedSku(null)}
              className="flex items-center gap-2 cursor-pointer text-left min-w-0"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#EC4899] shrink-0" />
              <span
                className="font-bold text-sm sm:text-base tracking-tight text-[#09090B] truncate"
                style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
              >
                {selectedItem ? selectedItem.sku.split('/')[0].trim() : ui.brand}
              </span>
            </button>
            <span className="hidden md:inline text-xs text-zinc-500 font-medium truncate">
              {selectedItem ? getTitle(selectedItem) : ui.collection}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {selectedItem && (
              <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-zinc-600">
                <a href="#overview" className="hover:text-[#09090B] transition-colors">
                  {ui.overview}
                </a>
                <a href="#gallery" className="hover:text-[#09090B] transition-colors">
                  {ui.gallery}
                </a>
                {selectedItem.videos.length > 0 && (
                  <a href="#film" className="hover:text-[#09090B] transition-colors">
                    {ui.film}
                  </a>
                )}
              </nav>
            )}

            {onSetLang && (
              <div className="flex items-center bg-zinc-200/70 rounded-full p-0.5 text-[11px] font-bold">
                {(['es', 'en', 'zh'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => onSetLang(l)}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      lang === l
                        ? 'bg-[#09090B] text-white shadow-sm'
                        : 'text-zinc-600 hover:text-[#09090B]'
                    }`}
                  >
                    {l === 'zh' ? '中文' : l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsBagOpen(true)}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#09090B] text-white text-xs font-semibold hover:bg-[#EC4899] transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>{totalBagCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* VIEW A: MULTI-PRODUCT FLAGSHIP STOREFRONT (WHEN NO SKU IS SELECTED)    */}
      {/* ===================================================================== */}
      {!selectedItem ? (
        <main>
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold tracking-[0.16em] uppercase text-[#3F3F46] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                {ui.collection}
              </div>
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#09090B] leading-[1.06]"
                style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
              >
                {ui.storeTitle}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#3F3F46] leading-relaxed">
                {ui.storeSubtitle}
              </p>
            </motion.div>

            {/* Filter & Search Bar */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    ['all', ui.allCats],
                    ['writing', ui.catWriting],
                    ['art', ui.catArt],
                    ['office', ui.catOffice],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setCatFilter(key)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      catFilter === key
                        ? 'bg-[#09090B] text-white'
                        : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={ui.searchPlaceholder}
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-zinc-200 text-xs font-medium text-[#09090B] focus:outline-none focus:border-[#09090B]"
                />
                <svg
                  className="absolute left-3 top-2.5 text-zinc-400"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
          </section>

          {/* Multi-Angle Flagship Grid */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCatalog.map((prod) => {
                const activeIdx = activeThumbById[prod.id] || 0;
                const displayImg = prod.images[activeIdx]?.src || prod.heroImage;
                const prodTitle = getTitle(prod);
                const prodTagline = getTagline(prod);
                return (
                  <motion.article
                    key={prod.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    className="group bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-[0_12px_36px_rgba(9,9,11,0.04)] hover:shadow-[0_20px_50px_rgba(9,9,11,0.08)] transition-all flex flex-col"
                  >
                    {/* Main Square Image */}
                    <div
                      onClick={() => openProduct(prod.sku)}
                      className="relative aspect-square bg-zinc-100 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={displayImg}
                        alt={prodTitle}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#09090B]/85 backdrop-blur text-white text-[10px] font-bold tracking-wider">
                          {prod.sku.split('/')[0].trim()}
                        </span>
                        {prod.videos.length > 0 && (
                          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[#09090B] text-[10px] font-bold">
                            {prod.videos.length} {ui.videosCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Multi-Angle Thumbnail Strip */}
                    {prod.images.length > 1 && (
                      <div className="px-4 pt-3 flex items-center gap-2 overflow-x-auto">
                        {prod.images.map((im, idx) => (
                          <button
                            key={im.src}
                            type="button"
                            onClick={() => setActiveThumbById((prev) => ({ ...prev, [prod.id]: idx }))}
                            className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              activeIdx === idx
                                ? 'border-[#EC4899] scale-105'
                                : 'border-zinc-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={im.src} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Copy & Actions */}
                    <div className="p-5 flex flex-col flex-1">
                      <h2
                        onClick={() => openProduct(prod.sku)}
                        className="text-lg font-bold text-[#09090B] leading-snug cursor-pointer hover:text-[#EC4899] transition-colors"
                        style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
                      >
                        {prodTitle}
                      </h2>
                      <p className="mt-1.5 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {prodTagline}
                      </p>
                      <div className="mt-3 text-[11px] font-semibold text-zinc-400">
                        {prod.images.length} {ui.photosCount} · {getPack(prod)}
                      </div>

                      <div className="mt-auto pt-4 flex items-center gap-2">
                        <button
                          onClick={() => openProduct(prod.sku)}
                          className="flex-1 py-2.5 px-4 rounded-full bg-[#09090B] hover:bg-[#EC4899] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {ui.viewDetails}
                        </button>
                        <button
                          onClick={() => addToBag(prod.sku)}
                          className="py-2.5 px-4 rounded-full border border-zinc-200 hover:border-[#09090B] text-xs font-semibold text-[#09090B] transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>
        </main>
      ) : (
        /* =================================================================== */
        /* VIEW B: FULL EDITORIAL PRODUCT DETAIL EXPERIENCE                    */
        /* =================================================================== */
        <main>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
            <button
              onClick={() => setSelectedSku(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-[#09090B] transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>{ui.backToCatalog}</span>
            </button>
          </div>

          {/* 1. Asymmetric Editorial Hero with Interactive Multi-Image Switcher */}
          <section id="overview" className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16 sm:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 space-y-5"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold tracking-[0.14em] uppercase text-[#3F3F46]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                  {selectedItem.sku} · {ui.brand}
                </div>

                <h1
                  className="text-3xl sm:text-5xl font-bold tracking-tight text-[#09090B] leading-[1.06]"
                  style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
                >
                  {getTitle(selectedItem)}
                </h1>

                <p className="text-base sm:text-lg text-[#3F3F46] leading-relaxed">
                  {getTagline(selectedItem)}
                </p>

                {/* Detailed Selling Points */}
                <ul className="space-y-2.5 pt-2">
                  {getHighlights(selectedItem).map((hl, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EC4899] shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>

                {/* Technical Specs Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white border border-zinc-200">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      {ui.eanLabel}
                    </div>
                    <div className="text-sm font-bold text-[#09090B] mt-0.5">{selectedItem.ean}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-zinc-200">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      {ui.packLabel}
                    </div>
                    <div className="text-xs font-bold text-[#09090B] mt-0.5">{getPack(selectedItem)}</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => addToBag(selectedItem.sku)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#09090B] hover:bg-[#EC4899] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <span>{ui.addToBag}</span>
                  </button>
                  <a
                    href="#gallery"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-zinc-200 hover:border-[#09090B] text-sm font-semibold text-[#09090B] transition-colors"
                  >
                    <span>{ui.scrollCta}</span>
                  </a>
                </div>
              </motion.div>

              {/* Multi-Image Interactive Stage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 space-y-3"
              >
                <div
                  onClick={() =>
                    setLightboxImg(
                      selectedItem.images[detailImgIndex]?.src || selectedItem.heroImage
                    )
                  }
                  className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-zinc-200/80 shadow-[0_24px_60px_rgba(9,9,11,0.08)] cursor-zoom-in group"
                >
                  <img
                    src={selectedItem.images[detailImgIndex]?.src || selectedItem.heroImage}
                    alt={getTitle(selectedItem)}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>

                {selectedItem.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2.5">
                    {selectedItem.images.map((img, idx) => (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => setDetailImgIndex(idx)}
                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                          detailImgIndex === idx
                            ? 'border-[#EC4899] shadow-md'
                            : 'border-zinc-200 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={img.src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </section>

          {/* 2. Dark Editorial Visual Archive */}
          <section id="gallery" className="bg-[#09090B] text-[#FAFAFA] py-16 sm:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="max-w-2xl mb-10 sm:mb-14">
                <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#EC4899] mb-2">
                  {ui.galleryKicker}
                </p>
                <h2
                  className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]"
                  style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
                >
                  {ui.galleryHeading}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-400">{ui.gallerySub}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {selectedItem.images.map((img, idx) => {
                  const caption =
                    lang === 'zh' ? img.labelZh : lang === 'en' ? img.labelEn : img.labelEs;
                  return (
                    <div
                      key={img.src + idx}
                      onClick={() => setLightboxImg(img.src)}
                      className="group relative rounded-3xl overflow-hidden bg-[#18181B] border border-zinc-800 cursor-zoom-in"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={img.src}
                          alt={caption}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                      </div>
                      <div className="px-5 py-4 flex items-center justify-between gap-3 border-t border-zinc-800/80">
                        <span className="text-xs sm:text-sm font-medium text-zinc-200">{caption}</span>
                        <span className="text-[11px] font-bold text-zinc-500">0{idx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. Dual Video Theatre */}
          {selectedItem.videos.length > 0 && (
            <section id="film" className="bg-[#FAFAFA] py-16 sm:py-24">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="max-w-2xl mb-10">
                  <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#EC4899] mb-2">
                    {ui.filmKicker}
                  </p>
                  <h2
                    className="text-3xl sm:text-5xl font-bold tracking-tight text-[#09090B] leading-[1.08]"
                    style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
                  >
                    {ui.filmHeading}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-[#3F3F46]">{ui.filmSub}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {selectedItem.videos.map((vid, idx) => (
                    <div
                      key={vid.embedUrl + idx}
                      className="rounded-3xl overflow-hidden bg-[#09090B] border border-zinc-200 shadow-lg"
                    >
                      <div className="aspect-video w-full">
                        <iframe
                          src={vid.embedUrl}
                          title={lang === 'zh' ? vid.titleZh : lang === 'en' ? vid.titleEn : vid.titleEs}
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                      <div className="px-5 py-3.5 bg-white flex items-center justify-between gap-2 border-t border-zinc-200">
                        <span className="text-xs font-bold text-[#09090B]">
                          {lang === 'zh' ? vid.titleZh : lang === 'en' ? vid.titleEn : vid.titleEs}
                        </span>
                        <span className="text-[11px] font-semibold text-[#EC4899]">
                          {lang === 'zh' ? vid.tagZh : lang === 'en' ? vid.tagEn : vid.tagEs}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#09090B] text-zinc-400 border-t border-zinc-800/80 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p
              className="text-sm font-bold text-white tracking-tight"
              style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
            >
              {ui.footerBrand}
            </p>
            <p className="text-xs text-zinc-500 mt-1">{ui.footerTag}</p>
          </div>
          <p className="text-xs text-zinc-500">MP* STYLE · 2026</p>
        </div>
      </footer>
    </div>
  );
};
