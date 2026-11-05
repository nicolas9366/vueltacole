import React, { useState, useEffect, useMemo, useRef } from 'react';

export interface ProductItem {
  id: string;
  code: string;
  usercode: string;
  namees: string;
  namecn: string;
  masterId: string;
  deptEs: string;
  deptZh: string;
  subEs: string;
  subZh: string;
  category: string;
  topid: string;
  subid: string;
  packet: number;
  box: number;
  stock: number;
  isnew: boolean;
  ishot: boolean;
  ispromote: boolean;
  imageUrl: string;
  price: number; // Wholesale base price
  packetPrice: number;
  boxPrice: number;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

interface ActionStoreProps {
  lang: 'zh' | 'es';
  onNavigateHome: () => void;
  onNavigateToNavidad?: () => void;
}

const PVP_MULTIPLIER = 2.8;

// 11 Official Master Catalog Departments covering 100% of 6,109 products cleanly
// Strictly aligned with CAT_AGENDAS-Y-CALENDARIOS_2027_web.pdf & CATALOGO-GENERAL-2026_ESP_web-MP.pdf
export const MASTER_DEPARTMENTS = [
  { id: 'all', labelEs: '⭐ Todo el Catálogo', labelZh: '⭐ 全部商品', icon: '⭐' },
  { id: '01', labelEs: '📅 Agendas y Calendarios 2027', labelZh: '📅 年历与日历 (2027专刊)', icon: '📅' },
  { id: '02', labelEs: '✏️ Escritura y Corrección', labelZh: '✏️ 书写与修正用品', icon: '✏️' },
  { id: '03', labelEs: '📎 Sobremesa y Oficina', labelZh: '📎 桌面与办公用品', icon: '📎' },
  { id: '04', labelEs: '📁 Archivo y Clasificación', labelZh: '📁 文件归档与分类', icon: '📁' },
  { id: '05', labelEs: '📓 Cuadernos y Manipulado', labelZh: '📓 本册与纸品 (Manipulado)', icon: '📓' },
  { id: '06', labelEs: '🎒 Mochilas y Escolar', labelZh: '🎒 箱包与学生用品', icon: '🎒' },
  { id: '07', labelEs: '✂️ Manualidades y Adhesivos', labelZh: '✂️ 手工与胶粘用品', icon: '✂️' },
  { id: '08', labelEs: '🎨 Bellas Artes (Artix)', labelZh: '🎨 美术画材 (Artix)', icon: '🎨' },
  { id: '09', labelEs: '🏷️ Primeras Marcas', labelZh: '🏷️ 国际合作名牌', icon: '🏷️' },
  { id: '10', labelEs: '🎀 Sanrio, Licencias y Regalo', labelZh: '🎀 三丽鸥、IP与贺卡', icon: '🎀' },
  { id: '11', labelEs: '📦 Expositores y PLV', labelZh: '📦 展架与陈列物料', icon: '📦' },
];

export const ActionStore: React.FC<ActionStoreProps> = ({
  lang,
  onNavigateHome,
  onNavigateToNavidad,
}) => {
  // Dual-mode: 'store' (PVP 2.8x with cart) vs 'showroom' (zero prices for schools/parents)
  const [mode, setMode] = useState<'store' | 'showroom'>('store');

  // Catalog data & loading state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [quickFilter, setQuickFilter] = useState<'all' | 'ishot' | 'isnew' | 'ispromote'>('all');
  // Default sort order is SKU / Reference natural sort (Catálogo Oficial)
  const [sortBy, setSortBy] = useState<'sku' | 'featured' | 'priceAsc' | 'priceDesc' | 'name' | 'newest'>('sku');

  // Pagination (36 products per page)
  const [page, setPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 36;

  // Cart & Modal state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const topGridRef = useRef<HTMLDivElement>(null);

  // Load catalog.json asynchronously from public/data/
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch('/data/catalog.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status} al cargar catálogo de productos`);
        }
        return res.json();
      })
      .then((data: ProductItem[]) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Catalog fetch error:', err);
          setLoadError('No se pudo cargar el catálogo. Intente refrescar la página.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate PVP (Wholesale * 2.8)
  const calculatePVP = (wholesale: number) => {
    if (!wholesale || wholesale <= 0) return 0;
    return Math.round(wholesale * PVP_MULTIPLIER * 100) / 100;
  };

  const formatEuro = (val: number) => {
    return (
      val.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' €'
    );
  };

  // Dynamically extract clean subcategories for the selected master department
  const subCategories = useMemo(() => {
    if (selectedDept === 'all') return [];
    const map = new Map<string, { key: string; labelEs: string; labelZh: string; count: number }>();
    products.forEach((p) => {
      if (p.masterId === selectedDept && p.subEs) {
        const key = p.subEs;
        if (!map.has(key)) {
          map.set(key, { key, labelEs: p.subEs, labelZh: p.subZh, count: 0 });
        }
        map.get(key)!.count += 1;
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [products, selectedDept]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedDept, selectedSubCategory, quickFilter, sortBy]);

  // Reset subcategory when department changes
  const handleSelectDept = (deptId: string) => {
    setSelectedDept(deptId);
    setSelectedSubCategory('all');
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Master department filter
    if (selectedDept !== 'all') {
      result = result.filter((p) => p.masterId === selectedDept);
    }

    // Granular subcategory filter
    if (selectedSubCategory !== 'all') {
      result = result.filter((p) => p.subEs === selectedSubCategory);
    }

    // Quick filter (hot, new, promo)
    if (quickFilter === 'ishot') {
      result = result.filter((p) => p.ishot);
    } else if (quickFilter === 'isnew') {
      result = result.filter((p) => p.isnew);
    } else if (quickFilter === 'ispromote') {
      result = result.filter((p) => p.ispromote);
    }

    // Search query filter (matches code, usercode, spanish name, chinese name, department, subcategory)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => {
        const code = (p.code || '').toLowerCase();
        const usercode = (p.usercode || '').toLowerCase();
        const namees = (p.namees || '').toLowerCase();
        const namecn = (p.namecn || '').toLowerCase();
        const deptEs = (p.deptEs || '').toLowerCase();
        const deptZh = (p.deptZh || '').toLowerCase();
        const subEs = (p.subEs || '').toLowerCase();
        const subZh = (p.subZh || '').toLowerCase();
        return (
          code.includes(q) ||
          usercode.includes(q) ||
          namees.includes(q) ||
          namecn.includes(q) ||
          deptEs.includes(q) ||
          deptZh.includes(q) ||
          subEs.includes(q) ||
          subZh.includes(q)
        );
      });
    }

    // Natural alphanumeric sorting helper
    const naturalCompare = (strA: string, strB: string) => {
      return (strA || '').localeCompare(strB || '', undefined, { numeric: true, sensitivity: 'base' });
    };

    // Sorting
    return result.slice().sort((a, b) => {
      if (sortBy === 'sku') {
        const uA = a.usercode || a.code || '';
        const uB = b.usercode || b.code || '';
        return naturalCompare(uA, uB);
      }
      if (sortBy === 'priceAsc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'priceDesc') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'name') {
        return naturalCompare(a.namees, b.namees);
      }
      if (sortBy === 'newest') {
        const newDiff = (b.isnew ? 1 : 0) - (a.isnew ? 1 : 0);
        if (newDiff !== 0) return newDiff;
        const uA = a.usercode || a.code || '';
        const uB = b.usercode || b.code || '';
        return naturalCompare(uA, uB);
      }
      // 'featured' (fallback to SKU order when score is tied)
      const aScore = (a.ishot ? 3 : 0) + (a.isnew ? 2 : 0) + (a.ispromote ? 1 : 0);
      const bScore = (b.ishot ? 3 : 0) + (b.isnew ? 2 : 0) + (b.ispromote ? 1 : 0);
      if (bScore !== aScore) return bScore - aScore;
      const uA = a.usercode || a.code || '';
      const uB = b.usercode || b.code || '';
      return naturalCompare(uA, uB);
    });
  }, [products, selectedDept, selectedSubCategory, quickFilter, searchQuery, sortBy]);

  // Paginated items
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const currentProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  // Scroll to grid top smoothly
  const scrollToGrid = () => {
    topGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Cart operations
  const addToCart = (product: ProductItem, qty: number = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx].quantity += qty;
        return next;
      }
      return [...prev, { product, quantity: qty }];
    });

    // Trigger visual pulse
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 800);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Cart totals
  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalCartPVP = useMemo(() => {
    return cart.reduce((sum, item) => {
      const pvp = calculatePVP(item.product.price);
      return sum + pvp * item.quantity;
    }, 0);
  }, [cart]);

  // WhatsApp Order Generator
  const generateWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const isShowroom = mode === 'showroom';
    let text = isShowroom
      ? `📋 *LISTA DE CONSULTA / EXPOSICIÓN ESCOLAR (VUELTA AL COLE 2026)*\n`
      : `🛒 *PEDIDO TIENDA VUELTA AL COLE (MAIN PAPER 2026)*\n`;

    text += `📅 Fecha: ${new Date().toLocaleDateString('es-ES')}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;

    cart.forEach((item, index) => {
      const pvp = calculatePVP(item.product.price);
      text += `${index + 1}. [${item.product.usercode || item.product.code}] ${item.product.namees}\n`;
      if (!isShowroom) {
        text += `   Cant: ${item.quantity} uds × ${formatEuro(pvp)} = *${formatEuro(pvp * item.quantity)}*\n`;
      } else {
        text += `   Cant solicitada: ${item.quantity} uds\n`;
      }
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📦 Total Artículos: ${totalItemsCount} uds\n`;
    if (!isShowroom) {
      text += `💰 *TOTAL ESTIMADO (PVP 2.8x): ${formatEuro(totalCartPVP)}*\n`;
    }
    text += `\n*Nota:* Generado automáticamente desde vueltacole.com`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/34688000000?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#222] font-['Fredoka',sans-serif] pb-24">
      {/* 1. TOP MARIO BOARD-GAME HERO HEADER */}
      <div className="bg-[#e52521] border-b-4 border-[#222] text-white px-4 py-6 shadow-md relative overflow-hidden">
        {/* Background decorative question marks & bricks */}
        <div className="absolute -top-6 -right-6 text-white/10 text-9xl font-black select-none pointer-events-none">
          ★
        </div>
        <div className="absolute bottom-1 right-20 text-white/10 text-7xl font-black select-none pointer-events-none">
          ?
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#f8d878] text-[#222] text-xs font-black px-3 py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222] uppercase tracking-wider">
                {lang === 'zh' ? '✨ 2026 官方全系商品' : '✨ Catálogo Oficial 2026'}
              </span>
              <span className="bg-[#5c94fc] text-white text-xs font-black px-2.5 py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222]">
                {lang === 'zh' ? '全系现货' : 'Catálogo Completo'}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white drop-shadow-[2px_2px_0px_#222]">
              {lang === 'zh'
                ? 'MAIN PAPER 全景文具站 & 样品展厅'
                : 'MAIN PAPER · SUPERSTORE & SHOWROOM'}
            </h1>
            <p className="text-sm md:text-base text-yellow-100 font-medium max-w-2xl mt-1">
              {mode === 'store'
                ? lang === 'zh'
                  ? '🛒 零售商超模式已激活：终端指导零售价 (PVP = 批发底价 × 2.8)，支持一键加入购物车并微信/WhatsApp报单！'
                  : '🛒 Modo Tienda Retail activo: PVP oficial (Coste Mayorista × 2.8). Añade a tu cesta y envía tu pedido por WhatsApp.'
                : lang === 'zh'
                  ? '🏛️ 学校/家长展厅模式已激活：完全隐藏任何进货与销售价格，适合直接向学校、教师及家长展示选品与编制采购单！'
                  : '🏛️ Modo Showroom escolar activo: Precios 100% ocultos. Diseñado para colegios, AMPAs y profesores.'}
            </p>
          </div>

          {/* DUAL MODE SWITCHER (Action Store vs Showroom) */}
          <div className="bg-[#fff] p-2 rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setMode('store')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-black text-sm md:text-base border-3 border-[#222] transition-all flex items-center justify-center gap-2 ${
                mode === 'store'
                  ? 'bg-[#f8d878] text-[#222] shadow-[3px_3px_0px_#222] scale-105'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">🛒</span>
              <span>{lang === 'zh' ? '零售商城 (PVP 2.8x)' : 'Modo Tienda (PVP 2.8x)'}</span>
            </button>

            <button
              onClick={() => setMode('showroom')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-black text-sm md:text-base border-3 border-[#222] transition-all flex items-center justify-center gap-2 ${
                mode === 'showroom'
                  ? 'bg-[#5c94fc] text-white shadow-[3px_3px_0px_#222] scale-105'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">🏛️</span>
              <span>{lang === 'zh' ? '展示厅 (无价格模式)' : 'Modo Showroom (Sin Precios)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. NOTICE BAR */}
      <div className="bg-[#f8d878] border-b-4 border-[#222] px-4 py-2.5 text-xs md:text-sm font-bold text-[#222] text-center flex items-center justify-center gap-3">
        <span>⚡</span>
        <span>
          {mode === 'store'
            ? lang === 'zh'
              ? '【特别提示】价格为建议零售价 (PVP 2.8x)。整箱批发进货及特批大宗优惠请联系客户经理。'
              : '【PVP OFICIAL】Precios calculados a factor retail 2.8x. Para compras al por mayor por caja completa consultar descuentos.'
            : lang === 'zh'
              ? '【展厅模式】已隐藏所有价格标签。您可以导出《学校文具清单》或通过 WhatsApp 发送意向备忘录。'
              : '【SHOWROOM ESCOLAR】Precios no visibles. Ideal para confeccionar listas de material escolar con centros educativos.'}
        </span>
        {onNavigateToNavidad && (
          <button
            onClick={onNavigateToNavidad}
            className="ml-2 underline text-[#e52521] hover:text-black font-black hidden sm:inline"
          >
            {lang === 'zh' ? '👉 前往圣诞爆品专区' : '👉 Ir a Campaña Navidad'}
          </button>
        )}
      </div>

      {/* 3. MAIN CONTROLS: SEARCH, DEPARTMENTS & QUICK FILTERS */}
      <div className="max-w-7xl mx-auto px-4 pt-6" ref={topGridRef}>
        {/* Search bar & quick statistics */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'zh'
                  ? '输入条码、型号(如MP000-162)、品名(中西文)、大类(如书写/美术)搜索商品...'
                  : 'Buscar por código EAN, referencia (ej. MP000-162), nombre en español o chino...'
              }
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] text-sm md:text-base font-bold bg-white text-[#222] focus:outline-none focus:ring-4 focus:ring-[#5c94fc]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 text-xs font-black flex items-center justify-center text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs font-black text-gray-600 whitespace-nowrap">
              {lang === 'zh' ? '排序:' : 'Ordenar:'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full md:w-auto px-4 py-3 rounded-xl border-3 border-[#222] font-black text-sm bg-white shadow-[2px_2px_0px_#222] focus:outline-none"
            >
              <option value="sku">
                {lang === 'zh' ? '🔢 官方目录顺序 (按货号 SKU)' : '🔢 Catálogo Oficial (Por Ref. / SKU)'}
              </option>
              <option value="featured">
                {lang === 'zh' ? '⭐ 推荐精选 (热销爆款优先)' : '⭐ Recomendados (Top Ventas)'}
              </option>
              {mode === 'store' && (
                <>
                  <option value="priceAsc">
                    {lang === 'zh' ? '🪙 零售价: 低到高' : '🪙 Precio: Menor a Mayor'}
                  </option>
                  <option value="priceDesc">
                    {lang === 'zh' ? '💎 零售价: 高到低' : '💎 Precio: Mayor a Menor'}
                  </option>
                </>
              )}
              <option value="newest">{lang === 'zh' ? '🆕 2026 新品先看' : '🆕 Nuevos lanzamientos'}</option>
              <option value="name">{lang === 'zh' ? '🔤 西语字母 A - Z' : '🔤 Nombre A - Z'}</option>
            </select>
          </div>
        </div>

        {/* 11 MASTER DEPARTMENTS CAROUSEL */}
        <div className="mb-4 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {MASTER_DEPARTMENTS.map((dept) => {
              const active = selectedDept === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => handleSelectDept(dept.id)}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs md:text-sm border-3 border-[#222] transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#e52521] text-white shadow-[3px_3px_0px_#222] -translate-y-0.5'
                      : 'bg-white text-gray-700 hover:bg-yellow-50 shadow-[2px_2px_0px_#222]'
                  }`}
                >
                  <span>{dept.icon}</span>
                  <span>{lang === 'zh' ? dept.labelZh : dept.labelEs}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CLEAN SUBCATEGORIES FOR SELECTED MASTER DEPARTMENT */}
        {subCategories.length > 0 && (
          <div className="mb-4 bg-white p-3 rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222]">
            <div className="text-xs font-black text-gray-500 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span>📂</span>
                <span>{lang === 'zh' ? '二级精准细分类目:' : 'Subcategorías específicas:'}</span>
              </div>
              <span className="text-[11px] text-gray-400">
                {subCategories.length} {lang === 'zh' ? '个子分类' : 'secciones'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] transition-all ${
                  selectedSubCategory === 'all'
                    ? 'bg-[#5c94fc] text-white shadow-[2px_2px_0px_#222]'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {lang === 'zh' ? '全部子类' : 'Todas'}
              </button>
              {subCategories.map((sub) => {
                const isSelected = selectedSubCategory === sub.key;
                return (
                  <button
                    key={sub.key}
                    onClick={() => setSelectedSubCategory(sub.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-[#222] transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#5c94fc] text-white shadow-[2px_2px_0px_#222]'
                        : 'bg-gray-50 hover:bg-amber-100/70 text-gray-700'
                    }`}
                  >
                    <span>{lang === 'zh' ? sub.labelZh : sub.labelEs}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {sub.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Badge Filters & Count Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#f8d878]/30 p-3 rounded-2xl border-3 border-[#222]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-gray-700 mr-1">
              {lang === 'zh' ? '快捷标签:' : 'Filtros:'}
            </span>
            <button
              onClick={() => setQuickFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-black border-2 border-[#222] ${
                quickFilter === 'all' ? 'bg-[#222] text-white' : 'bg-white text-gray-700'
              }`}
            >
              {lang === 'zh' ? '全部' : 'Todos'}
            </button>
            <button
              onClick={() => setQuickFilter('ishot')}
              className={`px-3 py-1 rounded-lg text-xs font-black border-2 border-[#222] flex items-center gap-1 ${
                quickFilter === 'ishot' ? 'bg-[#e52521] text-white' : 'bg-white text-[#e52521]'
              }`}
            >
              <span>🔥</span>
              <span>{lang === 'zh' ? '爆款' : 'Top Ventas'}</span>
            </button>
            <button
              onClick={() => setQuickFilter('isnew')}
              className={`px-3 py-1 rounded-lg text-xs font-black border-2 border-[#222] flex items-center gap-1 ${
                quickFilter === 'isnew' ? 'bg-[#5c94fc] text-white' : 'bg-white text-[#5c94fc]'
              }`}
            >
              <span>🌟</span>
              <span>{lang === 'zh' ? '新品' : 'Nuevos'}</span>
            </button>
            <button
              onClick={() => setQuickFilter('ispromote')}
              className={`px-3 py-1 rounded-lg text-xs font-black border-2 border-[#222] flex items-center gap-1 ${
                quickFilter === 'ispromote' ? 'bg-amber-600 text-white' : 'bg-white text-amber-700'
              }`}
            >
              <span>🏷️</span>
              <span>{lang === 'zh' ? '促销' : 'Promoción'}</span>
            </button>
          </div>

          <div className="text-xs md:text-sm font-black text-[#222] bg-white px-3 py-1 rounded-xl border-2 border-[#222]">
            {lang === 'zh'
              ? `找到 ${filteredProducts.length} 款符合条件的商品 (第 ${page}/${totalPages} 页)`
              : `Mostrando ${filteredProducts.length} productos (Pág. ${page}/${totalPages})`}
          </div>
        </div>
      </div>

      {/* 4. PRODUCT GRID / LOADING STATE */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222]">
            <div className="text-6xl animate-bounce mb-4">🍄</div>
            <div className="text-2xl font-black text-[#e52521] mb-2">
              {lang === 'zh' ? '正在装载官方商品目录...' : 'Cargando Catálogo Oficial...'}
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {lang === 'zh'
                ? '采用 2K 超高清实拍原图与规范化分类架构，稍候片刻即刻就绪！'
                : 'Optimizando imágenes Ultra HD 2K y catálogo interactivo...'}
            </p>
          </div>
        ) : loadError ? (
          <div className="p-8 bg-red-100 rounded-3xl border-4 border-red-500 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <div className="text-xl font-bold text-red-700">{loadError}</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border-4 border-[#222] text-center">
            <div className="text-5xl mb-3">👻</div>
            <div className="text-xl font-black text-[#222] mb-1">
              {lang === 'zh' ? '未找到相关商品' : 'No se encontraron productos'}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {lang === 'zh'
                ? '尝试更换搜索词，或清除分类与筛选标签'
                : 'Prueba con otro término de búsqueda o restablece los filtros'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('all');
                setSelectedSubCategory('all');
                setQuickFilter('all');
              }}
              className="px-4 py-2 bg-[#f8d878] text-[#222] font-black rounded-xl border-3 border-[#222] shadow-[2px_2px_0px_#222]"
            >
              {lang === 'zh' ? '重置所有筛选' : 'Restablecer filtros'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {currentProducts.map((p) => {
              const pvp = calculatePVP(p.price);
              const isAdded = addedAnimationId === p.id;
              const hasValidPrice = p.price > 0;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl md:rounded-3xl border-3 md:border-4 border-[#222] shadow-[4px_4px_0px_#222] hover:shadow-[6px_6px_0px_#222] hover:-translate-y-1 transition-all flex flex-col overflow-hidden relative group"
                >
                  {/* Floating Badges (HOT, NEW, PROMO) */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {p.ishot && (
                      <span className="bg-[#e52521] text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#222] shadow-[1px_1px_0px_#222]">
                        🔥 TOP
                      </span>
                    )}
                    {p.isnew && (
                      <span className="bg-[#5c94fc] text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#222] shadow-[1px_1px_0px_#222]">
                        ✨ 2026
                      </span>
                    )}
                    {p.ispromote && (
                      <span className="bg-[#f8d878] text-[#222] text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#222] shadow-[1px_1px_0px_#222]">
                        🏷️ PROMO
                      </span>
                    )}
                  </div>

                  {/* Stock indicator badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-400">
                      ✓ Stock
                    </span>
                  </div>

                  {/* Product Image Container */}
                  <div
                    onClick={() => setSelectedProduct(p)}
                    className="relative w-full aspect-square bg-[#f9fafb] p-3 flex items-center justify-center cursor-pointer border-b-3 border-[#222] overflow-hidden group-hover:bg-amber-50/40 transition-colors"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.namees}
                      loading="lazy"
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.opacity = '0.5';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#222] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                        🔍 {lang === 'zh' ? '点击看 2K 原图' : 'Ver 2K'}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Department / Category Pill */}
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1.5">
                        <span className="font-mono bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 truncate max-w-[140px]">
                          {lang === 'zh' ? p.subZh : p.subEs}
                        </span>
                        <span className="font-mono text-gray-400">{p.usercode || p.code}</span>
                      </div>

                      {/* Spanish Title */}
                      <h3
                        onClick={() => setSelectedProduct(p)}
                        className="text-xs md:text-sm font-black text-[#222] line-clamp-2 hover:text-[#e52521] cursor-pointer mb-1 leading-snug"
                        title={p.namees}
                      >
                        {p.namees}
                      </h3>

                      {/* Chinese Title Subtitle */}
                      {p.namecn && (
                        <div className="text-[11px] text-gray-500 line-clamp-1 mb-2 font-medium">
                          {p.namecn}
                        </div>
                      )}

                      {/* Packaging specification */}
                      <div className="text-[10px] md:text-[11px] text-gray-500 bg-gray-50 p-1.5 rounded-lg border border-gray-200 mb-2 flex justify-between">
                        <span>📦 Paq: {p.packet}u</span>
                        <span>Caja: {p.box}u</span>
                      </div>
                    </div>

                    {/* Price & Action Area */}
                    <div className="pt-2 border-t border-gray-100">
                      {mode === 'store' ? (
                        <div>
                          {/* Retail Price Display (Wholesale * 2.8) */}
                          <div className="flex items-baseline justify-between mb-2">
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 block leading-none">
                                PVP RECOMENDADO
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-base md:text-xl font-black text-[#e52521]">
                                  {hasValidPrice ? formatEuro(pvp) : 'Consultar'}
                                </span>
                              </div>
                            </div>
                            {hasValidPrice && p.packet > 1 && (
                              <div className="text-right">
                                <span className="text-[9px] text-gray-400 block">
                                  Paq ({p.packet}u)
                                </span>
                                <span className="text-xs font-bold text-gray-700">
                                  {formatEuro(pvp * p.packet)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            onClick={() => addToCart(p, 1)}
                            className={`w-full py-2 px-3 rounded-xl font-black text-xs md:text-sm border-3 border-[#222] shadow-[2px_2px_0px_#222] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-400 text-[#222]'
                                : 'bg-[#f8d878] text-[#222] hover:bg-yellow-400'
                            }`}
                          >
                            <span>{isAdded ? '✓' : '🛒'}</span>
                            <span>
                              {isAdded
                                ? lang === 'zh'
                                  ? '已加入!'
                                  : '¡Añadido!'
                                : lang === 'zh'
                                  ? '加入采购车'
                                  : 'Añadir'}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          {/* Showroom / Museum Mode (Zero Price) */}
                          <div className="mb-2 bg-[#5c94fc]/10 p-1.5 rounded-lg border border-[#5c94fc]/30 text-center">
                            <span className="text-[11px] font-black text-[#5c94fc] block">
                              🏛️ {lang === 'zh' ? '产品展示厅' : 'Exposición de Catálogo'}
                            </span>
                          </div>

                          <button
                            onClick={() => addToCart(p, 1)}
                            className={`w-full py-2 px-3 rounded-xl font-black text-xs md:text-sm border-3 border-[#222] shadow-[2px_2px_0px_#222] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-400 text-[#222]'
                                : 'bg-[#5c94fc] text-white hover:bg-blue-600'
                            }`}
                          >
                            <span>{isAdded ? '✓' : '📋'}</span>
                            <span>
                              {isAdded
                                ? lang === 'zh'
                                  ? '已存入清单!'
                                  : '¡En Lista!'
                                : lang === 'zh'
                                  ? '加入学校备忘单'
                                  : 'Añadir a Lista'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. MARIO STYLE PAGINATION CONTROLS */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                setPage((prev) => Math.max(1, prev - 1));
                scrollToGrid();
              }}
              disabled={page === 1}
              className="px-4 py-2.5 rounded-xl font-black text-sm border-3 border-[#222] shadow-[3px_3px_0px_#222] bg-white disabled:opacity-40 disabled:pointer-events-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {lang === 'zh' ? '« 上一页' : '« Anterior'}
            </button>

            {/* Jump pages */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pNum = page;
              if (page <= 3) {
                pNum = i + 1;
              } else if (page >= totalPages - 2) {
                pNum = totalPages - 4 + i;
              } else {
                pNum = page - 2 + i;
              }
              if (pNum < 1 || pNum > totalPages) return null;

              const isCurrent = pNum === page;
              return (
                <button
                  key={pNum}
                  onClick={() => {
                    setPage(pNum);
                    scrollToGrid();
                  }}
                  className={`w-10 h-10 rounded-xl font-black text-sm border-3 border-[#222] transition-all ${
                    isCurrent
                      ? 'bg-[#e52521] text-white shadow-[3px_3px_0px_#222] -translate-y-0.5'
                      : 'bg-white text-gray-700 hover:bg-yellow-100 shadow-[2px_2px_0px_#222]'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              onClick={() => {
                setPage((prev) => Math.min(totalPages, prev + 1));
                scrollToGrid();
              }}
              disabled={page === totalPages}
              className="px-4 py-2.5 rounded-xl font-black text-sm border-3 border-[#222] shadow-[3px_3px_0px_#222] bg-white disabled:opacity-40 disabled:pointer-events-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {lang === 'zh' ? '下一页 »' : 'Siguiente »'}
            </button>
          </div>
        )}
      </div>

      {/* 6. FLOATING CART / LIST LAUNCHER BUTTON */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce">
          <button
            onClick={() => setIsCartOpen(true)}
            className={`px-5 py-3.5 rounded-2xl border-4 border-[#222] shadow-[5px_5px_0px_#222] font-black text-sm md:text-base flex items-center gap-3 transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none ${
              mode === 'store' ? 'bg-[#f8d878] text-[#222]' : 'bg-[#5c94fc] text-white'
            }`}
          >
            <span className="text-2xl">{mode === 'store' ? '🛒' : '📋'}</span>
            <div className="text-left">
              <div className="text-xs uppercase font-extrabold opacity-80 leading-none">
                {mode === 'store'
                  ? lang === 'zh'
                    ? '已选商品'
                    : 'Mi Carrito'
                  : lang === 'zh'
                    ? '学校备忘单'
                    : 'Lista Escolar'}
              </div>
              <div className="text-sm md:text-base font-black">
                {totalItemsCount} {lang === 'zh' ? '件商品' : 'items'}
                {mode === 'store' && ` · ${formatEuro(totalCartPVP)}`}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* 7. CART / LIST SLIDE-OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#fff] border-l-4 border-[#222] h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div
              className={`p-4 border-b-4 border-[#222] flex items-center justify-between ${
                mode === 'store' ? 'bg-[#f8d878]' : 'bg-[#5c94fc] text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{mode === 'store' ? '🛒' : '📋'}</span>
                <div>
                  <h2 className="font-black text-lg text-[#222]">
                    {mode === 'store'
                      ? lang === 'zh'
                        ? '订货清单 (PVP 2.8x)'
                        : 'Carrito de Compra (PVP)'
                      : lang === 'zh'
                        ? '学校文具选品清单'
                        : 'Lista Escolar / Muestras'}
                  </h2>
                  <span className="text-xs font-bold text-gray-700">
                    {cart.length} {lang === 'zh' ? '款不同货品' : 'referencias'} · {totalItemsCount}{' '}
                    {lang === 'zh' ? '件' : 'unidades'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#222] text-white font-black flex items-center justify-center hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => {
                const pvp = calculatePVP(item.product.price);
                return (
                  <div
                    key={item.product.id}
                    className="p-3 bg-gray-50 rounded-2xl border-2 border-[#222] flex items-center gap-3 relative"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.namees}
                      className="w-16 h-16 object-contain bg-white rounded-xl border border-gray-300 p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono text-gray-500 font-bold">
                        {item.product.usercode || item.product.code}
                      </div>
                      <div className="text-xs font-black text-[#222] line-clamp-1">
                        {item.product.namees}
                      </div>
                      {mode === 'store' && (
                        <div className="text-xs font-black text-[#e52521] mt-0.5">
                          {formatEuro(pvp)}{' '}
                          <span className="text-[10px] text-gray-400 font-normal">
                            (Total: {formatEuro(pvp * item.quantity)})
                          </span>
                        </div>
                      )}

                      {/* Stepper buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartQty(item.product.id, -1)}
                          className="w-6 h-6 rounded-md bg-white border border-[#222] font-black text-xs flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, 1)}
                          className="w-6 h-6 rounded-md bg-white border border-[#222] font-black text-xs flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 p-1 font-bold text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-gray-100 border-t-4 border-[#222] space-y-3">
              {mode === 'store' && (
                <div className="flex items-center justify-between text-base font-black text-[#222]">
                  <span>{lang === 'zh' ? '总计估价 (PVP):' : 'Total Estimado (PVP):'}</span>
                  <span className="text-xl text-[#e52521]">{formatEuro(totalCartPVP)}</span>
                </div>
              )}

              {/* Direct WhatsApp Order Button */}
              <button
                onClick={generateWhatsAppOrder}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] font-black text-sm md:text-base flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span className="text-lg">📱</span>
                <span>
                  {mode === 'store'
                    ? lang === 'zh'
                      ? '通过 WhatsApp 发送报单'
                      : 'Enviar Pedido por WhatsApp'
                    : lang === 'zh'
                      ? '导出清单至 WhatsApp'
                      : 'Enviar Lista por WhatsApp'}
                </span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="flex-1 py-2 bg-white text-gray-700 hover:bg-gray-200 rounded-xl border-2 border-gray-400 text-xs font-bold"
                >
                  {lang === 'zh' ? '清空清单' : 'Vaciar'}
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-2 bg-white text-[#222] hover:bg-gray-200 rounded-xl border-2 border-[#222] text-xs font-black"
                >
                  {lang === 'zh' ? '继续选品' : 'Seguir mirando'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. PRODUCT LIGHTBOX DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[8px_8px_0px_#222] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#222] text-white font-black flex items-center justify-center hover:bg-gray-800"
            >
              ✕
            </button>

            <div className="p-6">
              {/* Image Preview with 2K Retina Indicator */}
              <div className="relative aspect-4/3 bg-[#fdfdfd] rounded-2xl border-3 border-[#222] mb-4 flex items-center justify-center overflow-hidden p-4">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.namees}
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  2K Ultra HD (2048px)
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#f8d878] text-[#222] text-xs font-black px-2.5 py-1 rounded-md border border-[#222]">
                    Ref: {selectedProduct.usercode || 'S/REF'}
                  </span>
                  <span className="bg-gray-100 text-gray-700 text-xs font-mono px-2.5 py-1 rounded-md border border-gray-300">
                    EAN: {selectedProduct.code}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                    ✓ Stock Disponible
                  </span>
                </div>

                <h2 className="text-xl font-black text-[#222] leading-tight">
                  {selectedProduct.namees}
                </h2>
                {selectedProduct.namecn && (
                  <p className="text-sm text-gray-500 font-bold">{selectedProduct.namecn}</p>
                )}

                <div className="grid grid-cols-2 gap-2 bg-yellow-50/60 p-3 rounded-xl border-2 border-yellow-200 text-xs">
                  <div>
                    <span className="text-gray-500 block">Departamento:</span>
                    <span className="font-bold">
                      {lang === 'zh' ? selectedProduct.deptZh : selectedProduct.deptEs}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Categoría:</span>
                    <span className="font-bold">
                      {lang === 'zh' ? selectedProduct.subZh : selectedProduct.subEs}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block">Embalaje estándar:</span>
                    <span className="font-bold">
                      {selectedProduct.packet} uds/paquete · {selectedProduct.box} uds/caja
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                {mode === 'store' ? (
                  <div className="bg-[#f8d878] p-4 rounded-2xl border-3 border-[#222] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-gray-700 block">
                        PVP VENTA AL PÚBLICO RECOMENDADO
                      </span>
                      <div className="text-2xl font-black text-[#e52521]">
                        {selectedProduct.price > 0
                          ? formatEuro(calculatePVP(selectedProduct.price))
                          : 'Consultar'}
                      </div>
                    </div>
                    {selectedProduct.price > 0 && selectedProduct.packet > 1 && (
                      <div className="text-right text-xs">
                        <span className="text-gray-600 block">Por paquete completo:</span>
                        <span className="font-black text-sm">
                          {formatEuro(calculatePVP(selectedProduct.price) * selectedProduct.packet)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#5c94fc]/15 p-4 rounded-2xl border-3 border-[#5c94fc] text-center">
                    <span className="text-sm font-black text-[#5c94fc]">
                      🏛️ {lang === 'zh' ? '产品展示厅 · 官方精选样品' : 'MODO SHOWROOM: Catálogo oficial de muestras'}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                      setIsCartOpen(true);
                    }}
                    className={`flex-1 py-3.5 rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] font-black text-base flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                      mode === 'store'
                        ? 'bg-[#e52521] text-white hover:bg-red-600'
                        : 'bg-[#5c94fc] text-white hover:bg-blue-600'
                    }`}
                  >
                    <span>{mode === 'store' ? '🛒' : '📋'}</span>
                    <span>
                      {mode === 'store'
                        ? lang === 'zh'
                          ? '立即选购并查看采购车'
                          : 'Añadir al Carrito'
                        : lang === 'zh'
                          ? '存入学校采购清单'
                          : 'Añadir a Lista Escolar'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
