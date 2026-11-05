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
  isTop500?: boolean;
  isTop1000?: boolean;
  salesRevenue?: number;
  salesUnits?: number;
  salesInvoices?: number;
  salesRank?: number;
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
  { id: 'all', labelEs: 'Todo el Catálogo', labelZh: '全部商品', icon: '⭐' },
  { id: '09', labelEs: 'Primeras Marcas (Bic, Milan...)', labelZh: '国际合作名牌 (Bic, Milan...)', icon: '🏷️' },
  { id: '01', labelEs: 'Agendas y Calendarios 2027', labelZh: '年历与日历 (2027专刊)', icon: '📅' },
  { id: '02', labelEs: 'Escritura y Corrección', labelZh: '书写与修正用品', icon: '✏️' },
  { id: '03', labelEs: 'Sobremesa y Oficina', labelZh: '桌面与办公用品', icon: '📎' },
  { id: '04', labelEs: 'Archivo y Clasificación', labelZh: '文件归档与分类', icon: '📁' },
  { id: '05', labelEs: 'Cuadernos y Manipulado', labelZh: '本册与纸品 (Manipulado)', icon: '📓' },
  { id: '06', labelEs: 'Mochilas y Escolar', labelZh: '箱包与学生用品', icon: '🎒' },
  { id: '07', labelEs: 'Manualidades y Adhesivos', labelZh: '手工与胶粘用品', icon: '✂️' },
  { id: '08', labelEs: 'Bellas Artes (Artix)', labelZh: '美术画材 (Artix)', icon: '🎨' },
  { id: '10', labelEs: 'Sanrio, Licencias y Regalo', labelZh: '三丽鸥、IP与贺卡', icon: '🎀' },
  { id: '11', labelEs: 'Expositores y PLV', labelZh: '展架与陈列物料', icon: '📦' },
];

export interface AIIntent {
  id: string;
  chipZh: string;
  chipEs: string;
  triggers: string[];
  filterFn: (p: ProductItem) => boolean;
  bannerZh: string;
  bannerEs: string;
}

export const AI_INTENTS: AIIntent[] = [
  {
    id: 'paint',
    chipZh: '🎨 我想画画',
    chipEs: '🎨 Quiero pintar',
    triggers: [
      '我想画画', '画画', '绘画', '画水彩', '素描', '丙烯', '油画', '水彩', 
      '画笔', '涂鸦', '速写', '学画画', 'pintar', 'dibujar', 'dibujo', 'acuarela', 'acrilica', 'acrilico', 'oleo', 'arte'
    ],
    filterFn: (p) => {
      const ne = (p.namees || '').toUpperCase();
      const nc = (p.namecn || '');
      return (
        p.masterId === '08' ||
        ne.includes('PINCEL') ||
        ne.includes('ACRILIC') ||
        ne.includes('ACUAREL') ||
        ne.includes('LIENZO') ||
        ne.includes('SKETCH') ||
        ne.includes('DIBUJO') ||
        nc.includes('画笔') ||
        nc.includes('颜料') ||
        nc.includes('油画')
      );
    },
    bannerZh: '🎨 AI 意图识别【我想画画】：已为您智能检索 Artix 专业丙烯/油画/水彩颜料、专业排刷画笔、画框画板与速写画册！',
    bannerEs: '🎨 Intención detectada 【Quiero pintar / dibujar】: Selección de Bellas Artes Artix, pinturas, pinceles, lienzos y blocs.'
  },
  {
    id: 'diary',
    chipZh: '📖 我想写日记',
    chipEs: '📖 Escribir diario',
    triggers: [
      '我想写日记', '写日记', '日记', '手账', '手帐', '日记本', '记事本', 
      '秘密日记', '做计划', '日程', 'escribir un diario', 'diario', 'planner', 'agenda bonita'
    ],
    filterFn: (p) => {
      const ne = (p.namees || '').toUpperCase();
      const sz = p.subZh || '';
      return (
        ne.includes('DIARIO') ||
        ne.includes('CANDADO') ||
        ne.includes('SECRETO') ||
        sz.includes('插画创意手账本') ||
        sz.includes('精装商务笔记本') ||
        sz.includes('时尚经典年历') ||
        sz.includes('高档塞万提斯年历') ||
        sz.includes('追梦女孩') ||
        sz.includes('三丽鸥')
      );
    },
    bannerZh: '📖 AI 意图识别【我想写日记】：已为您推荐带锁密码日记本、创意插画硬皮手账本、闪光手账中性笔与精美年历！',
    bannerEs: '📖 Intención detectada 【Quiero escribir un diario】: Diarios con candado secreto, libretas decoradas y bolígrafos gel.'
  },
  {
    id: 'craft',
    chipZh: '✂️ 我想做手工',
    chipEs: '✂️ Manualidades',
    triggers: [
      '我想做一个手工', '我想做手工', '做手工', '手工', '手工作业', '儿童手工', 
      '折纸', '剪纸', '卡纸', 'diy', 'hacer manualidades', 'manualidades', 'craft', 'bricolaje'
    ],
    filterFn: (p) => {
      const ne = (p.namees || '').toUpperCase();
      const sz = p.subZh || '';
      return (
        p.masterId === '07' ||
        ne.includes('PLASTILINA') ||
        ne.includes('JOVI') ||
        ne.includes('GOMA EVA') ||
        ne.includes('FIELTRO') ||
        sz.includes('手工纸') ||
        sz.includes('手工耗材')
      );
    },
    bannerZh: '✂️ AI 意图识别【我想做手工】：已为您匹配 EVA 海绵纸、彩色卡纸、手工毛毡布、安全儿童剪刀、无毒胶棒与彩泥！',
    bannerEs: '✂️ Intención detectada 【Hacer manualidades】: Goma EVA, cartulinas de colores, fieltro, pegamentos y herramientas.'
  },
  {
    id: 'school',
    chipZh: '🎒 开学备货清单',
    chipEs: '🎒 Vuelta al Cole',
    triggers: [
      '开学', '学生文具', '开学备货', '开学清单', '书包', '文具盒', '笔袋', 
      '包书皮', '买文具', 'vuelta al cole', 'material escolar', 'mochila'
    ],
    filterFn: (p) => {
      const ne = (p.namees || '').toUpperCase();
      const sz = p.subZh || '';
      return (
        p.masterId === '06' ||
        sz.includes('自粘包书皮') ||
        sz.includes('橡皮擦与卷笔刀') ||
        sz.includes('格式与横线学生本') ||
        sz.includes('软皮线圈练习本') ||
        ne.includes('MOCHILA') ||
        ne.includes('ESTUCHE') ||
        ne.includes('FORRO')
      );
    },
    bannerZh: '🎒 AI 意图识别【开学备货清单】：已为您推荐减负书包、大容量笔袋、自粘包书皮、米兰精品橡皮与标准练习本！',
    bannerEs: '🎒 Intención detectada 【Vuelta al Cole】: Mochilas, estuches, forros para libros, gomas Milan y libretas escolares.'
  },
  {
    id: 'office',
    chipZh: '📁 办公室文件整理',
    chipEs: '📁 Oficina y Archivo',
    triggers: [
      '办公室整理', '整理文件', '文件收纳', '文件归档', '资料收纳', '资料册', 
      '办公用品', 'organizar oficina', 'archivar', 'clasificar documentos'
    ],
    filterFn: (p) => {
      const sz = p.subZh || '';
      return (
        p.masterId === '04' ||
        p.masterId === '03' ||
        sz.includes('透明插页资料册') ||
        sz.includes('四孔活页') ||
        sz.includes('风琴包') ||
        sz.includes('档案归档')
      );
    },
    bannerZh: '📁 AI 意图识别【办公室文件整理】：已为您匹配多孔活页资料册、风琴扩展夹、归档文件盒、强力订书机与票夹！',
    bannerEs: '📁 Intención detectada 【Organizar Oficina】: Carpetas de anillas, fundas multitaladro, cajas de archivo y sobremesa.'
  },
  {
    id: 'caligrafia',
    chipZh: '✒️ 练字与书法',
    chipEs: '✒️ Caligrafía',
    triggers: [
      '我想练字', '练字', '书法', '练字帖', '字帖', '写好字', '钢笔', 
      'caligrafia', 'practicar caligrafia', 'rubio'
    ],
    filterFn: (p) => {
      const ne = (p.namees || '').toUpperCase();
      const sz = p.subZh || '';
      return (
        ne.includes('RUBIO') ||
        ne.includes('CALIGRAF') ||
        ne.includes('PLUMA') ||
        sz.includes('鲁比奥') ||
        sz.includes('钢笔')
      );
    },
    bannerZh: '✒️ AI 意图识别【书法与练字】：已为您挑选西班牙 Rubio 官方描红练习册、精装钢笔与高密度顺滑书写纸！',
    bannerEs: '✒️ Intención detectada 【Caligrafía y Escritura】: Cuadernos de caligrafía Rubio, plumas estilográficas y recambios.'
  },
  {
    id: 'gift',
    chipZh: '🎀 三丽鸥与送礼',
    chipEs: '🎀 Sanrio y Regalos',
    triggers: [
      '送礼', '儿童礼物', '生日礼物', '三丽鸥', '库洛米', '美乐蒂', '女孩喜欢', 
      '卡通文具', 'regalo', 'sanrio', 'kuromi'
    ],
    filterFn: (p) => {
      const ne = (p.namees || '').toUpperCase();
      const sz = p.subZh || '';
      return (
        p.masterId === '10' ||
        ne.includes('SANRIO') ||
        ne.includes('KUROMI') ||
        ne.includes('HELLO KITTY') ||
        sz.includes('三丽鸥') ||
        sz.includes('贺卡') ||
        sz.includes('追梦女孩')
      );
    },
    bannerZh: '🎀 AI 意图识别【三丽鸥与精美送礼】：已为您检索正版三丽鸥授权文具、Kuromi 主题礼盒、追梦女孩与节庆贺卡！',
    bannerEs: '🎀 Intención detectada 【Sanrio y Regalos】: Licencias oficiales Sanrio, Kuromi, sets de regalo y tarjetas.'
  }
];

export const ActionStore: React.FC<ActionStoreProps> = ({
  lang,
  onNavigateHome,
  onNavigateToNavidad,
}) => {
  // Dual-mode: 'store' (PVP with cart) vs 'showroom' (zero prices for schools/parents)
  const [mode, setMode] = useState<'store' | 'showroom'>('store');

  // Catalog data & loading state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [quickFilter, setQuickFilter] = useState<'all' | 'top500' | 'top1000' | 'isnew' | 'ispromote'>('all');
  // Default sort order is real PowerBI sales ranking (or SKU for 2027 agendas)
  const [sortBy, setSortBy] = useState<'sales' | 'sku' | 'featured' | 'priceAsc' | 'priceDesc' | 'name' | 'newest'>('sales');

  // Detect active AI Intent if searchQuery matches any trigger phrase
  const activeAIIntent = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return (
      AI_INTENTS.find((intent) =>
        intent.triggers.some((trigger) => q.includes(trigger.toLowerCase()) || trigger.toLowerCase().includes(q))
      ) || null
    );
  }, [searchQuery]);

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

    // Quick filter (top500, top1000, new, promo)
    if (quickFilter === 'top500') {
      result = result.filter((p) => p.isTop500);
    } else if (quickFilter === 'top1000') {
      result = result.filter((p) => p.isTop1000);
    } else if (quickFilter === 'isnew') {
      result = result.filter((p) => p.isnew);
    } else if (quickFilter === 'ispromote') {
      result = result.filter((p) => p.ispromote);
    }

    // AI Intent Search or standard query filter
    if (activeAIIntent) {
      result = result.filter(activeAIIntent.filterFn);
    } else {
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
    }

    // Natural alphanumeric sorting helper
    const naturalCompare = (strA: string, strB: string) => {
      return (strA || '').localeCompare(strB || '', undefined, { numeric: true, sensitivity: 'base' });
    };

    // Sorting
    return result.slice().sort((a, b) => {
      if (sortBy === 'sales') {
        // Special case: Dept 01 (Agendas 2027) are preorder / upcoming, sort by sequential SKU
        if (a.masterId === '01' && b.masterId === '01') {
          return naturalCompare(a.usercode || a.code || '', b.usercode || b.code || '');
        }
        const revDiff = (b.salesRevenue || 0) - (a.salesRevenue || 0);
        if (revDiff !== 0) return revDiff;
        const unitDiff = (b.salesUnits || 0) - (a.salesUnits || 0);
        if (unitDiff !== 0) return unitDiff;
        return naturalCompare(a.usercode || a.code || '', b.usercode || b.code || '');
      }
      if (sortBy === 'featured') {
        // 'featured' = Top 1000 selection first, then sales revenue
        const aScore = (a.isTop1000 ? 5 : 0) + (a.isnew ? 2 : 0) + (a.ispromote ? 1 : 0);
        const bScore = (b.isTop1000 ? 5 : 0) + (b.isnew ? 2 : 0) + (b.ispromote ? 1 : 0);
        if (bScore !== aScore) return bScore - aScore;
        const revDiff = (b.salesRevenue || 0) - (a.salesRevenue || 0);
        if (revDiff !== 0) return revDiff;
        const uA = a.usercode || a.code || '';
        const uB = b.usercode || b.code || '';
        return naturalCompare(uA, uB);
      }
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
      return naturalCompare(a.usercode || a.code || '', b.usercode || b.code || '');
    });
  }, [products, selectedDept, selectedSubCategory, quickFilter, searchQuery, sortBy, activeAIIntent]);

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
      text += `💰 *TOTAL ESTIMADO (PVP): ${formatEuro(totalCartPVP)}*\n`;
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
                  ? '🛒 支持一键挑选加购并快速生成采购订货单！'
                  : '🛒 Añade a tu cesta y tramita tu selección o pedido cómodamente.'
                : lang === 'zh'
                  ? '🏛️ 官方样品展厅：画册全景展示，不显示价格，专为学校机构、家委会及大宗选品定制！'
                  : '🏛️ Showroom de Catálogo: Exposición oficial de producto sin precios visibles, ideal para colegios y AMPAs.'}
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
              <span>{lang === 'zh' ? '零售商城 (PVP)' : 'Modo Tienda (PVP)'}</span>
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
              <span>{lang === 'zh' ? '样品展厅' : 'Modo Showroom'}</span>
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
              ? '【官方建议零售价】本店标价均为建议零售价 (PVP)。如需整箱批发进货及大宗采购合作，请直接联系业务经理。'
              : '【PVP RECOMENDADO】Precios oficiales recomendados al público. Para compras al por mayor y grandes cuentas, consultar tarifas especiales.'
            : lang === 'zh'
              ? '【展厅模式】已开启无标价陈列。支持挑选并导出意向文具清单，方便与采购团队、学校及家长沟通。'
              : '【SHOWROOM OFICIAL】Catálogo de exposición sin precios. Selecciona productos para confeccionar y exportar tu lista escolar.'}
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
        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
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
                  ? '✨ 试着输入自然场景：“我想画画”、“我想写日记”、“做手工”，或输入型号/条码...'
                  : '✨ Búsquedas naturales: "quiero pintar", "hacer un diario", o ref/código...'
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
              <option value="sales">
                {lang === 'zh' ? '🔥 权威畅销榜首 (前500)' : '🔥 Los Más Vendidos (Top 500)'}
              </option>
              <option value="featured">
                {lang === 'zh' ? '⭐ 推荐精选 (前1000优选)' : '⭐ Selección Destacada (Top 1000)'}
              </option>
              <option value="sku">
                {lang === 'zh' ? '🔢 官方货号目录 (按SKU自然序)' : '🔢 Catálogo Oficial (Ref. SKU)'}
              </option>
              {mode === 'store' && (
                <>
                  <option value="priceAsc">
                    {lang === 'zh' ? '🪙 建议零售价: 低到高' : '🪙 Precio: Menor a Mayor'}
                  </option>
                  <option value="priceDesc">
                    {lang === 'zh' ? '💎 建议零售价: 高到低' : '💎 Precio: Mayor a Menor'}
                  </option>
                </>
              )}
              <option value="newest">{lang === 'zh' ? '🆕 2026/27 新品先看' : '🆕 Novedades'}</option>
              <option value="name">{lang === 'zh' ? '🔤 西语字母 A - Z' : '🔤 Nombre A - Z'}</option>
            </select>
          </div>
        </div>

        {/* AI Natural Intent Prompts */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 px-1">
          <span className="text-[11px] font-black text-purple-700 flex items-center gap-1 mr-1">
            <span>✨</span>
            <span>{lang === 'zh' ? 'AI 场景灵感:' : 'Inspiración IA:'}</span>
          </span>
          {AI_INTENTS.map((intent) => {
            const isCurrentActive = activeAIIntent?.id === intent.id;
            return (
              <button
                key={intent.id}
                onClick={() => {
                  if (isCurrentActive) {
                    setSearchQuery('');
                  } else {
                    setSearchQuery(intent.triggers[0]);
                  }
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-black border-2 border-[#222] transition-all flex items-center gap-1 active:translate-y-0.5 ${
                  isCurrentActive
                    ? 'bg-purple-600 text-white shadow-[2px_2px_0px_#222] -translate-y-0.5'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-900 shadow-[1px_1px_0px_#222]'
                }`}
              >
                <span>{lang === 'zh' ? intent.chipZh : intent.chipEs}</span>
              </button>
            );
          })}
        </div>

        {/* AI Intent Active Banner */}
        {activeAIIntent && (
          <div className="mb-4 p-3.5 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 rounded-2xl border-3 border-purple-500 shadow-[3px_3px_0px_#222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white text-lg flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#222]">
                ✨
              </div>
              <div>
                <div className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                  <span className="bg-purple-200 text-purple-900 text-[10px] px-2 py-0.5 rounded-full font-black border border-purple-300">
                    AI 智能场景识别已生效
                  </span>
                  <span>{lang === 'zh' ? '已自动为您推荐全套关联商品：' : 'Resultados sugeridos por IA:'}</span>
                </div>
                <p className="text-xs font-bold text-gray-800 mt-0.5">
                  {lang === 'zh' ? activeAIIntent.bannerZh : activeAIIntent.bannerEs}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="self-end sm:self-center px-3 py-1.5 bg-white hover:bg-gray-100 text-purple-900 text-xs font-black rounded-xl border-2 border-purple-400 shadow-[1px_1px_0px_#222] transition-all flex items-center gap-1 shrink-0"
            >
              <span>✕</span>
              <span>{lang === 'zh' ? '退出 AI 场景' : 'Limpiar'}</span>
            </button>
          </div>
        )}

        {/* 12 MASTER DEPARTMENTS RESPONSIVE GRID (Zero horizontal scroll on desktop/tablet!) */}
        <div className="mb-4 bg-white/80 p-3.5 rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] backdrop-blur-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-black text-gray-800">
                {lang === 'zh' ? '📑 官方全系分类导航' : '📑 Categorías Principales'}
              </span>
              <span className="text-[11px] text-gray-500 font-bold hidden sm:inline">
                {lang === 'zh' ? '(11 大行业分类 · 直观全景平铺)' : '(11 departamentos oficiales)'}
              </span>
            </div>

            {/* Direct Brand Fast Pass Button */}
            <button
              onClick={() => {
                handleSelectDept('09');
                setSelectedSubCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] transition-all flex items-center gap-1.5 active:translate-y-0.5 ${
                selectedDept === '09'
                  ? 'bg-[#e52521] text-white shadow-[2px_2px_0px_#222]'
                  : 'bg-amber-300 hover:bg-amber-400 text-gray-950 shadow-[2px_2px_0px_#222]'
              }`}
            >
              <span>🏷️</span>
              <span>{lang === 'zh' ? '⭐ 国际名牌专区 (Bic · Milan · Pilot)' : '⭐ Marcas Oficiales (Bic · Milan)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {MASTER_DEPARTMENTS.map((dept) => {
              const active = selectedDept === dept.id;
              const isBrandDept = dept.id === '09';
              return (
                <button
                  key={dept.id}
                  onClick={() => handleSelectDept(dept.id)}
                  className={`p-2.5 rounded-xl font-black text-xs border-2 md:border-3 border-[#222] transition-all flex items-center gap-2 text-left justify-start ${
                    active
                      ? 'bg-[#e52521] text-white shadow-[3px_3px_0px_#222] -translate-y-0.5'
                      : isBrandDept
                      ? 'bg-amber-100 hover:bg-amber-200 text-gray-950 shadow-[2px_2px_0px_#222] ring-2 ring-amber-400'
                      : 'bg-white text-gray-700 hover:bg-yellow-50 shadow-[2px_2px_0px_#222]'
                  }`}
                >
                  <span className="text-base shrink-0">{dept.icon}</span>
                  <span className="leading-tight line-clamp-2">
                    {lang === 'zh' ? dept.labelZh : dept.labelEs}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* POPULAR BRANDS QUICK BAR WHEN IN 'ALL' VIEW */}
        {selectedDept === 'all' && (
          <div className="mb-4 bg-amber-50/90 p-2.5 rounded-2xl border-2 border-amber-300 shadow-[2px_2px_0px_#222] flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-amber-900 flex items-center gap-1 mr-1">
              <span>🏷️</span>
              <span>{lang === 'zh' ? '名牌直达:' : 'Marcas:'}</span>
            </span>
            {[
              { nameZh: 'Bic 比克', nameEs: 'Bic', subKey: 'Bic (Cristal y Plastidecor)' },
              { nameZh: 'Pilot 百乐', nameEs: 'Pilot', subKey: 'Pilot (Frixion y Bolígrafos G2)' },
              { nameZh: 'Milan 米兰', nameEs: 'Milan', subKey: 'Milan (Gomas y Sacapuntas)' },
              { nameZh: 'Stabilo 思笔乐', nameEs: 'Stabilo', subKey: 'Stabilo (Point 88 y Subrayadores)' },
              { nameZh: 'Edding 艾丁', nameEs: 'Edding', subKey: 'Edding (Marcadores Industriales)' },
              { nameZh: 'Jovi 彩泥', nameEs: 'Jovi', subKey: 'Jovi (Plastilina y Modelado)' },
              { nameZh: 'Faber-Castell 辉柏嘉', nameEs: 'Faber-Castell', subKey: 'Faber-Castell (Subrayadores y Dibujo)' },
              { nameZh: 'Rubio 字帖', nameEs: 'Rubio', subKey: 'Rubio (Cuadernos de Caligrafía)' },
              { nameZh: 'Oxford 牛津', nameEs: 'Oxford', subKey: 'Oxford (Cuadernos Europeanbook)' },
              { nameZh: 'Staedtler 施德楼', nameEs: 'Staedtler', subKey: 'Staedtler (Lápices Noris y Dibujo)' },
              { nameZh: 'Pritt 百特', nameEs: 'Pritt', subKey: 'Pritt (Pegamentos y Adhesivos)' },
              { nameZh: 'Uni-Ball / Posca', nameEs: 'Uni-Ball', subKey: 'Uni-Ball y Posca' },
            ].map((b) => (
              <button
                key={b.subKey}
                onClick={() => {
                  setSelectedDept('09');
                  setSelectedSubCategory(b.subKey);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-black bg-white hover:bg-amber-200 text-gray-900 border border-amber-400 shadow-[1px_1px_0px_#222] transition-all active:translate-y-0.5"
              >
                {lang === 'zh' ? b.nameZh : b.nameEs}
              </button>
            ))}
          </div>
        )}

        {/* CLEAN SUBCATEGORIES FOR SELECTED MASTER DEPARTMENT */}
        {subCategories.length > 0 && (
          <div
            className={`mb-4 p-3.5 rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] ${
              selectedDept === '09' ? 'bg-amber-50/90 border-amber-950' : 'bg-white'
            }`}
          >
            <div className="text-xs font-black text-gray-600 mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>{selectedDept === '09' ? '🏷️' : '📂'}</span>
                <span className="text-sm font-black text-gray-800">
                  {selectedDept === '09'
                    ? lang === 'zh'
                      ? '国际大牌专区 (点击品牌直接筛选):'
                      : 'Marcas Internacionales Oficiales:'
                    : lang === 'zh'
                    ? '二级细分类目筛选:'
                    : 'Subcategorías específicas:'}
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-bold">
                {subCategories.length}{' '}
                {selectedDept === '09'
                  ? lang === 'zh'
                    ? '个合作品牌'
                    : 'marcas'
                  : lang === 'zh'
                  ? '个细分子类'
                  : 'secciones'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] transition-all ${
                  selectedSubCategory === 'all'
                    ? selectedDept === '09'
                      ? 'bg-amber-500 text-white shadow-[2px_2px_0px_#222]'
                      : 'bg-[#5c94fc] text-white shadow-[2px_2px_0px_#222]'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {selectedDept === '09'
                  ? lang === 'zh'
                    ? '全部名牌 (522款)'
                    : 'Todas las Marcas (522)'
                  : lang === 'zh'
                  ? '全部子类'
                  : 'Todas'}
              </button>
              {subCategories.map((sub) => {
                const isSelected = selectedSubCategory === sub.key;
                return (
                  <button
                    key={sub.key}
                    onClick={() => setSelectedSubCategory(sub.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-[#222] transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? selectedDept === '09'
                          ? 'bg-amber-500 text-white shadow-[2px_2px_0px_#222] -translate-y-0.5'
                          : 'bg-[#5c94fc] text-white shadow-[2px_2px_0px_#222] -translate-y-0.5'
                        : selectedDept === '09'
                        ? 'bg-white hover:bg-amber-100 text-gray-900 shadow-[1px_1px_0px_#222]'
                        : 'bg-white hover:bg-blue-50 text-gray-700 shadow-[1px_1px_0px_#222]'
                    }`}
                  >
                    <span>{lang === 'zh' ? sub.labelZh : sub.labelEs}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
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
              onClick={() => setQuickFilter('top500')}
              className={`px-3 py-1 rounded-lg text-xs font-black border-2 border-[#222] flex items-center gap-1 ${
                quickFilter === 'top500' ? 'bg-[#e52521] text-white shadow-[1px_1px_0px_#222]' : 'bg-white text-[#e52521]'
              }`}
            >
              <span>🏆</span>
              <span>{lang === 'zh' ? '年度畅销榜 (前500)' : 'Top 500 Ventas'}</span>
            </button>
            <button
              onClick={() => setQuickFilter('top1000')}
              className={`px-3 py-1 rounded-lg text-xs font-black border-2 border-[#222] flex items-center gap-1 ${
                quickFilter === 'top1000' ? 'bg-amber-500 text-white shadow-[1px_1px_0px_#222]' : 'bg-white text-amber-700'
              }`}
            >
              <span>⭐</span>
              <span>{lang === 'zh' ? '推荐精选 (前1000)' : 'Top 1000 Selección'}</span>
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
                    {p.isTop500 ? (
                      <span className="bg-[#e52521] text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#222] shadow-[1px_1px_0px_#222] animate-pulse">
                        🔥 {lang === 'zh' ? '年度畅销' : 'Top 500'}
                      </span>
                    ) : p.isTop1000 ? (
                      <span className="bg-amber-500 text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#222] shadow-[1px_1px_0px_#222]">
                        ⭐ {lang === 'zh' ? '推荐精选' : 'Top 1000'}
                      </span>
                    ) : p.ishot ? (
                      <span className="bg-[#e52521] text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#222] shadow-[1px_1px_0px_#222]">
                        🔥 HOT
                      </span>
                    ) : null}
                    {p.isnew && (
                      <span className="bg-[#5c94fc] text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#222] shadow-[1px_1px_0px_#222]">
                        ✨ 2026/27
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
                        ? '我的采购清单 (PVP)'
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
                  {selectedProduct.isTop500 ? (
                    <span className="bg-[#e52521] text-white text-xs font-black px-2.5 py-1 rounded-md border border-[#222]">
                      🔥 {lang === 'zh' ? '年度权威畅销榜 (Top 500)' : 'Top 500 Más Vendidos'}
                    </span>
                  ) : selectedProduct.isTop1000 ? (
                    <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-md border border-[#222]">
                      ⭐ {lang === 'zh' ? '官方优选推荐 (Top 1000)' : 'Top 1000 Selección'}
                    </span>
                  ) : null}
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
