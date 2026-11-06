import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';

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

export interface AuthUser {
  username: string;
  email: string;
  role: 'vip' | 'retailer' | 'school' | 'customer';
  companyName?: string;
  phone?: string;
  loginAt: string;
}

export const TEST_ACCOUNT = {
  username: 'test',
  password: 'test..',
  email: 'madyu001@gmail.com',
  companyName: 'KYRMAX VIP 采购商户',
  phone: '+34 604 229 098',
  role: 'vip' as const,
};

interface ActionStoreProps {
  lang: 'zh' | 'es';
  onNavigateHome: () => void;
  onNavigateToNavidad?: () => void;
}

const PVP_MULTIPLIER = 2.8;

// 12 Official Master Catalog Departments covering 100% of products cleanly
// Strictly aligned with official catalogs & verified subcategories
export const MASTER_DEPARTMENTS = [
  { id: 'all', labelEs: 'Todo el Catálogo', labelZh: '全部商品', icon: '⭐' },
  { id: '09', labelEs: 'Primeras Marcas', labelZh: '国际知名品牌', icon: '🏷️' },
  { id: '12', labelEs: 'Línea BeBasic', labelZh: 'BeBasic 超值系列', icon: '⚡' },
  { id: '01', labelEs: 'Agendas y Calendarios', labelZh: '年历与日历', icon: '📅' },
  { id: '02', labelEs: 'Escritura', labelZh: '书写用品', icon: '✏️' },
  { id: '03', labelEs: 'Sobremesa, Corrección y Oficina', labelZh: '桌面办公与修正工具', icon: '📎' },
  { id: '04', labelEs: 'Archivo y Clasificación', labelZh: '文件归档与分类', icon: '📁' },
  { id: '05', labelEs: 'Cuadernos y Papel', labelZh: '本册与纸品', icon: '📓' },
  { id: '06', labelEs: 'Mochilas y Escolar', labelZh: '箱包与学生用品', icon: '🎒' },
  { id: '07', labelEs: 'Manualidades y Adhesivos', labelZh: '手工与胶粘用品', icon: '✂️' },
  { id: '08', labelEs: 'Bellas Artes', labelZh: '美术画材', icon: '🎨' },
  { id: '10', labelEs: 'Sanrio y Licencias', labelZh: '三丽鸥与IP周边', icon: '🎀' },
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
    bannerZh: '🎨 场景精选：Artix 专业丙烯/油画/水彩颜料、排刷画笔、画框画板与速写画册',
    bannerEs: '🎨 Selección recomendada: Bellas Artes Artix, pinturas, pinceles, lienzos y blocs.'
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
    bannerZh: '📖 场景精选：带锁密码日记本、创意插画硬皮手账本、闪光中性笔与精美年历',
    bannerEs: '📖 Selección recomendada: Diarios con candado secreto, libretas decoradas y bolígrafos gel.'
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
    bannerZh: '✂️ 场景精选：EVA 海绵纸、彩色卡纸、手工毛毡布、安全剪刀、胶棒与彩泥',
    bannerEs: '✂️ Selección recomendada: Goma EVA, cartulinas de colores, fieltro, pegamentos y herramientas.'
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
    bannerZh: '🎒 场景精选：减负书包、大容量笔袋、自粘包书皮、米兰精品橡皮与标准练习本',
    bannerEs: '🎒 Selección recomendada: Mochilas, estuches, forros para libros, gomas Milan y libretas escolares.'
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
    bannerZh: '📁 场景精选：多孔活页资料册、风琴扩展夹、归档文件盒、强力订书机与票夹',
    bannerEs: '📁 Selección recomendada: Carpetas de anillas, fundas multitaladro, cajas de archivo y sobremesa.'
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
    bannerZh: '✒️ 场景精选：Rubio 官方描红练习册、精装钢笔与高密度顺滑书写纸',
    bannerEs: '✒️ Selección recomendada: Cuadernos de caligrafía Rubio, plumas estilográficas y recambios.'
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
    bannerZh: '🎀 场景精选：正版三丽鸥授权文具、Kuromi 主题礼盒、追梦女孩与节庆贺卡',
    bannerEs: '🎀 Selección recomendada: Licencias oficiales Sanrio, Kuromi, sets de regalo y tarjetas.'
  }
];

// Anti-scanning and anti-printing protective watermark (light enough for human viewing, disrupts machine scanning/printing)
const WatermarkOverlay: React.FC<{ isHD?: boolean; className?: string }> = ({
  isHD = false,
  className = '',
}) => {
  const w = isHD ? 280 : 200;
  const h = isHD ? 140 : 100;
  const cx = w / 2;
  const cy = h / 2;
  const fontSize = isHD ? 13 : 10;

  const patternSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
      <text 
        x='${cx}' 
        y='${cy}' 
        fill='rgba(30,30,30,0.14)' 
        stroke='rgba(255,255,255,0.25)' 
        stroke-width='0.4'
        font-family='sans-serif' 
        font-weight='bold' 
        font-size='${fontSize}' 
        text-anchor='middle' 
        transform='rotate(-24 ${cx} ${cy})'
      >
        KYRMAX · info@kyrmax.com
      </text>
    </svg>
  `.trim();

  const dataUri = `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`;

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none z-10 watermark-layer ${className}`}
      style={{
        backgroundImage: dataUri,
        backgroundRepeat: 'repeat',
      }}
      aria-hidden="true"
    >
      {isHD && (
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white/95 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 select-none flex items-center gap-1 shadow">
          <span>🔒</span>
          <span>KYRMAX · info@kyrmax.com</span>
        </div>
      )}
    </div>
  );
};

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
  // Default sort order is official SKU catalog order
  const [sortBy, setSortBy] = useState<'sku' | 'sales' | 'featured' | 'priceAsc' | 'priceDesc' | 'name' | 'newest'>('sku');

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

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('vueltacole_logged_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Auth Inputs
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  const [regUsername, setRegUsername] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regCompany, setRegCompany] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const id = loginIdentifier.trim().toLowerCase();
    const pwd = loginPassword.trim();

    if (!id || !pwd) {
      setAuthError(lang === 'zh' ? '请输入用户名或邮箱及密码' : 'Introduce usuario/email y contraseña');
      return;
    }

    // Official test account: test / test.. / madyu001@gmail.com
    const isTestMatch =
      (id === TEST_ACCOUNT.username.toLowerCase() || id === TEST_ACCOUNT.email.toLowerCase()) &&
      pwd === TEST_ACCOUNT.password;

    if (isTestMatch) {
      const user: AuthUser = {
        username: TEST_ACCOUNT.username,
        email: TEST_ACCOUNT.email,
        role: TEST_ACCOUNT.role,
        companyName: TEST_ACCOUNT.companyName,
        phone: TEST_ACCOUNT.phone,
        loginAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      localStorage.setItem('vueltacole_logged_user', JSON.stringify(user));
      setAuthSuccess(lang === 'zh' ? '欢迎回来，VIP 商户！' : '¡Bienvenido de nuevo!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setAuthSuccess(null);
      }, 700);
      return;
    }

    // Check custom registered users
    try {
      const savedAccounts: any[] = JSON.parse(localStorage.getItem('vueltacole_registered_users') || '[]');
      const found = savedAccounts.find(
        (u) => (u.username.toLowerCase() === id || u.email.toLowerCase() === id) && u.password === pwd
      );
      if (found) {
        const user: AuthUser = {
          username: found.username,
          email: found.email,
          role: 'retailer',
          companyName: found.companyName || found.username,
          phone: found.phone,
          loginAt: new Date().toISOString(),
        };
        setCurrentUser(user);
        localStorage.setItem('vueltacole_logged_user', JSON.stringify(user));
        setAuthSuccess(lang === 'zh' ? `欢迎，${user.username}！` : `¡Bienvenido, ${user.username}!`);
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setAuthSuccess(null);
        }, 700);
        return;
      }
    } catch {
      // ignore
    }

    setAuthError(
      lang === 'zh'
        ? '账号或密码不正确'
        : 'Credenciales incorrectas'
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!regUsername.trim() || !regEmail.trim() || !regPassword) {
      setAuthError(lang === 'zh' ? '请填写完整的用户名、邮箱和密码' : 'Completa todos los campos obligatorios');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError(lang === 'zh' ? '两次输入的密码不一致' : 'Las contraseñas no coinciden');
      return;
    }
    if (!regEmail.includes('@')) {
      setAuthError(lang === 'zh' ? '请输入有效的邮箱地址' : 'Introduce un email válido');
      return;
    }

    const newUser = {
      username: regUsername.trim(),
      email: regEmail.trim(),
      password: regPassword,
      companyName: regCompany.trim() || regUsername.trim(),
      phone: regPhone.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const savedAccounts: any[] = JSON.parse(localStorage.getItem('vueltacole_registered_users') || '[]');
      if (
        savedAccounts.some(
          (u) =>
            u.username.toLowerCase() === newUser.username.toLowerCase() ||
            u.email.toLowerCase() === newUser.email.toLowerCase()
        )
      ) {
        setAuthError(lang === 'zh' ? '该用户名或邮箱已被注册' : 'El usuario o email ya está registrado');
        return;
      }
      savedAccounts.push(newUser);
      localStorage.setItem('vueltacole_registered_users', JSON.stringify(savedAccounts));
    } catch {
      // ignore
    }

    const user: AuthUser = {
      username: newUser.username,
      email: newUser.email,
      role: 'retailer',
      companyName: newUser.companyName,
      phone: newUser.phone,
      loginAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    localStorage.setItem('vueltacole_logged_user', JSON.stringify(user));
    setAuthSuccess(lang === 'zh' ? '注册成功并已自动登录！' : '¡Registro completado con éxito!');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setAuthSuccess(null);
    }, 800);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vueltacole_logged_user');
  };

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

    const isAIOrBestseller = Boolean(activeAIIntent || quickFilter === 'top500' || quickFilter === 'top1000');

    // Sorting
    return result.slice().sort((a, b) => {
      // 1. If AI scenario search or Bestseller category filter is active, sort strictly by SKU naturally
      if (isAIOrBestseller) {
        if (sortBy === 'priceAsc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'priceDesc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name') return naturalCompare(a.namees, b.namees);
        return naturalCompare(a.usercode || a.code || '', b.usercode || b.code || '');
      }

      if (sortBy === 'sales') {
        // Special case: Dept 01 (Agendas 2027) are preorder / upcoming, sort by sequential SKU
        if (a.masterId === '01' && b.masterId === '01') {
          return naturalCompare(a.usercode || a.code || '', b.usercode || b.code || '');
        }
        // Primary sort: Nº Facturas (purchase frequency / actual invoices count)
        const invDiff = (b.salesInvoices || 0) - (a.salesInvoices || 0);
        if (invDiff !== 0) return invDiff;
        // Secondary sort: Units sold
        const unitDiff = (b.salesUnits || 0) - (a.salesUnits || 0);
        if (unitDiff !== 0) return unitDiff;
        // Tertiary sort: Sales revenue
        const revDiff = (b.salesRevenue || 0) - (a.salesRevenue || 0);
        if (revDiff !== 0) return revDiff;
        return naturalCompare(a.usercode || a.code || '', b.usercode || b.code || '');
      }
      if (sortBy === 'featured') {
        // Recommended selection first, then tie-break by Nº Facturas (purchase frequency)
        const aScore = (a.isTop1000 ? 5 : 0) + (a.isnew ? 2 : 0) + (a.ispromote ? 1 : 0);
        const bScore = (b.isTop1000 ? 5 : 0) + (b.isnew ? 2 : 0) + (b.ispromote ? 1 : 0);
        if (bScore !== aScore) return bScore - aScore;
        const invDiff = (b.salesInvoices || 0) - (a.salesInvoices || 0);
        if (invDiff !== 0) return invDiff;
        const unitDiff = (b.salesUnits || 0) - (a.salesUnits || 0);
        if (unitDiff !== 0) return unitDiff;
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
      ? `📋 *LISTA DE CONSULTA Y MUESTRAS*\n`
      : `🛒 *PEDIDO DE PAPELERÍA*\n`;

    text += `📅 Fecha: ${new Date().toLocaleDateString('es-ES')}\n`;
    if (currentUser) {
      text += `👤 *Cliente:* ${currentUser.companyName || currentUser.username} · ${currentUser.email}\n`;
      if (currentUser.phone) {
        text += `📞 *Teléfono:* ${currentUser.phone}\n`;
      }
      text += `⭐ *Cuenta:* VIP Registrado\n`;
    }
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
      text += `💰 *TOTAL ESTIMADO: ${formatEuro(totalCartPVP)}*\n`;
    }
    text += `\n*Nota:* Generado automáticamente desde vueltacole.com`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/34604229098?text=${encoded}`, '_blank');
  };

  // Export Cart to Excel (.xlsx) including SKU, EAN, and Packages count (包数)
  const exportCartToExcel = () => {
    if (cart.length === 0) {
      alert(lang === 'zh' ? '购物车为空，请先挑选并加入商品！' : 'La cesta está vacía.');
      return;
    }

    const isShowroom = mode === 'showroom';
    const data = cart.map((item, index) => {
      const pvp = calculatePVP(item.product.price);
      const row: Record<string, any> = {
        '序号': index + 1,
        'SKU': item.product.usercode || item.product.code,
        'EAN': item.product.code,
        '包数': item.quantity,
        '每包数量': item.product.packet,
        '总件数': item.quantity * item.product.packet,
        '箱规': item.product.box,
        '商品名称': item.product.namees,
        '中文名称': item.product.namecn || '',
        '分类': item.product.deptZh || item.product.deptEs || '',
        '细分类': item.product.subZh || item.product.subEs || '',
      };
      if (!isShowroom) {
        row['单价'] = pvp > 0 ? Number(pvp.toFixed(2)) : '';
        row['小计'] = pvp > 0 ? Number((pvp * item.quantity).toFixed(2)) : '';
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 16 },
      { wch: 18 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 38 },
      { wch: 28 },
      { wch: 20 },
      { wch: 20 },
      { wch: 14 },
      { wch: 14 },
    ];

    const workbook = XLSX.utils.book_new();
    const sheetTitle = isShowroom ? '预定清单' : '订货清单';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = isShowroom
      ? `Reserva_${dateStr}.xlsx`
      : `Pedido_${dateStr}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#222] font-['Fredoka',sans-serif] pb-24">
      {/* 1. TOP MARIO BOARD-GAME HERO HEADER */}
      <div className="bg-[#e52521] border-b-4 border-[#222] text-white px-4 py-3 md:py-6 shadow-md relative overflow-hidden">
        {/* Background decorative question marks & bricks */}
        <div className="absolute -top-6 -right-6 text-white/10 text-9xl font-black select-none pointer-events-none hidden sm:block">
          ★
        </div>
        <div className="absolute bottom-1 right-20 text-white/10 text-7xl font-black select-none pointer-events-none hidden sm:block">
          ?
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 relative z-10">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="bg-[#f8d878] text-[#222] text-[11px] md:text-xs font-black px-2.5 py-0.5 md:py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222] uppercase tracking-wider">
                {lang === 'zh' ? '✨ 2026 全系现货商品' : '✨ Catálogo Completo 2026'}
              </span>
              <span className="bg-[#5c94fc] text-white text-[11px] md:text-xs font-black px-2 py-0.5 md:py-1 rounded-full border-2 border-[#222] shadow-[2px_2px_0px_#222]">
                {lang === 'zh' ? '现货直配' : 'Stock Inmediato'}
              </span>
            </div>
            <h1 className="text-xl md:text-4xl font-black tracking-tight text-white drop-shadow-[2px_2px_0px_#222]">
              {lang === 'zh'
                ? '全景文具商城 & 样品展厅'
                : 'CATÁLOGO & SHOWROOM DE PAPELERÍA'}
            </h1>
            <p className="hidden md:block text-sm md:text-base text-yellow-100 font-medium max-w-2xl mt-1">
              {mode === 'store'
                ? lang === 'zh'
                  ? '🛒 支持一键挑选加购并快速生成采购订货单！'
                  : '🛒 Añade a tu cesta y tramita tu selección o pedido cómodamente.'
                : lang === 'zh'
                  ? '🏛️ 官方样品展厅：画册全景展示，不显示价格，专为学校机构、家委会及大宗选品定制！'
                  : '🏛️ Showroom de Catálogo: Exposición oficial de producto sin precios visibles, ideal para colegios y AMPAs.'}
            </p>
          </div>

          {/* USER AUTH & DUAL MODE SWITCHER */}
          <div className="flex flex-row items-center gap-2 w-full md:w-auto justify-center md:justify-end">
            {currentUser ? (
              <div className="bg-white px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl md:rounded-2xl border-3 md:border-4 border-[#222] shadow-[3px_3px_0px_#222] flex items-center gap-1.5 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-gray-900 truncate max-w-[90px] md:max-w-[120px]">
                  👤 {currentUser.username}
                </span>
                <span className="bg-[#f8d878] text-[#222] px-1 py-0.5 rounded text-[9px] border border-[#222]">
                  VIP
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[#e52521] hover:underline font-black text-xs ml-1 cursor-pointer"
                >
                  {lang === 'zh' ? '退出' : 'Salir'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 md:px-4 md:py-2.5 bg-white hover:bg-yellow-100 text-[#222] rounded-xl md:rounded-2xl border-3 md:border-4 border-[#222] shadow-[3px_3px_0px_#222] text-xs md:text-sm font-black flex items-center justify-center gap-1 transition-all active:translate-y-0.5 cursor-pointer shrink-0"
              >
                <span>🔑</span>
                <span>{lang === 'zh' ? '商户登录 / 注册' : 'Acceder / Registro'}</span>
              </button>
            )}

            {/* DUAL MODE SWITCHER (Action Store vs Showroom) */}
            <div className="bg-[#fff] p-1 md:p-2 rounded-xl md:rounded-2xl border-3 md:border-4 border-[#222] shadow-[3px_3px_0px_#222] flex flex-row items-center gap-1.5">
              <button
                onClick={() => setMode('store')}
                className={`px-2.5 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl font-black text-xs md:text-base border-2 md:border-3 border-[#222] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  mode === 'store'
                    ? 'bg-[#f8d878] text-[#222] shadow-[2px_2px_0px_#222] scale-102'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span>🛒</span>
                <span>{lang === 'zh' ? '零售商城' : 'Catálogo Comercial'}</span>
              </button>

              <button
                onClick={() => setMode('showroom')}
                className={`px-2.5 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl font-black text-xs md:text-base border-2 md:border-3 border-[#222] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  mode === 'showroom'
                    ? 'bg-[#5c94fc] text-white shadow-[2px_2px_0px_#222] scale-102'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span>🏛️</span>
                <span>{lang === 'zh' ? '样品展厅' : 'Sala de Muestras'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTROLS: SEARCH, DEPARTMENTS & QUICK FILTERS */}
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

          {/* Desktop Sort Selector */}
          <div className="hidden md:flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs font-black text-gray-600 whitespace-nowrap">
              {lang === 'zh' ? '排序:' : 'Ordenar:'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full md:w-auto px-4 py-3 rounded-xl border-3 border-[#222] font-black text-sm bg-white shadow-[2px_2px_0px_#222] focus:outline-none"
            >
              <option value="sku">
                {lang === 'zh' ? '🔢 官方货号' : '🔢 Referencia SKU'}
              </option>
              <option value="sales">
                {lang === 'zh' ? '🔥 畅销排行' : '🔥 Más Vendidos'}
              </option>
              <option value="featured">
                {lang === 'zh' ? '⭐ 推荐精选' : '⭐ Destacados'}
              </option>
              {mode === 'store' && currentUser && (
                <>
                  <option value="priceAsc">
                    {lang === 'zh' ? '🪙 价格低到高' : '🪙 Precio menor a mayor'}
                  </option>
                  <option value="priceDesc">
                    {lang === 'zh' ? '💎 价格高到低' : '💎 Precio mayor a menor'}
                  </option>
                </>
              )}
              <option value="newest">{lang === 'zh' ? '🆕 新品' : '🆕 Novedades'}</option>
              <option value="name">{lang === 'zh' ? '🔤 字母顺序' : '🔤 Nombre'}</option>
            </select>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE COMPACT DROPDOWN CONTROLS (Brand Standard: Shein/Amazon) */}
        {/* ======================================================== */}
        <div className="block md:hidden space-y-2 mb-3">
          {/* Row 1: Two Cascading Dropdowns: Department + Subcategory / Brand */}
          <div className="grid grid-cols-2 gap-2">
            {/* Dropdown 1: Master Department */}
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => {
                  handleSelectDept(e.target.value);
                  setSelectedSubCategory('all');
                }}
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl border-3 border-[#222] bg-white text-[#222] font-black text-xs shadow-[2px_2px_0px_#222] focus:outline-none focus:ring-2 focus:ring-[#5c94fc] truncate"
              >
                {MASTER_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.icon} {lang === 'zh' ? dept.labelZh : dept.labelEs}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 font-black text-[10px]">
                ▼
              </span>
            </div>

            {/* Dropdown 2: Subcategory OR Popular Brand if in 'all' */}
            {selectedDept === 'all' ? (
              <div className="relative">
                <select
                  value="all"
                  onChange={(e) => {
                    if (e.target.value !== 'all') {
                      setSelectedDept('09');
                      setSelectedSubCategory(e.target.value);
                    }
                  }}
                  className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl border-3 border-[#222] bg-amber-50 text-[#222] font-black text-xs shadow-[2px_2px_0px_#222] focus:outline-none focus:ring-2 focus:ring-amber-400 truncate"
                >
                  <option value="all">🏷️ {lang === 'zh' ? '品牌精选直达' : 'Todas las Marcas'}</option>
                  <option value="Bic">Bic 比克</option>
                  <option value="Pilot">Pilot 百乐</option>
                  <option value="Milan">Milan 米兰</option>
                  <option value="Stabilo">Stabilo 思笔乐</option>
                  <option value="Edding">Edding 艾丁</option>
                  <option value="Jovi">Jovi 彩泥</option>
                  <option value="Faber-Castell">Faber-Castell 辉柏嘉</option>
                  <option value="Rubio">Rubio 鲁比奥字帖</option>
                  <option value="Oxford">Oxford 牛津</option>
                  <option value="Staedtler">Staedtler 施德楼</option>
                  <option value="Pritt">Pritt 百特</option>
                  <option value="Uni-Ball y Posca">Uni-Ball / Posca</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 font-black text-[10px]">
                  ▼
                </span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl border-3 border-[#222] bg-white text-[#222] font-black text-xs shadow-[2px_2px_0px_#222] focus:outline-none focus:ring-2 focus:ring-[#5c94fc] truncate"
                >
                  <option value="all">
                    📂 {lang === 'zh' ? '全部细分类目' : 'Todas las Subcategorías'}
                  </option>
                  {subCategories.map((sub) => (
                    <option key={sub.key} value={sub.key}>
                      {lang === 'zh' ? sub.labelZh : sub.labelEs}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 font-black text-[10px]">
                  ▼
                </span>
              </div>
            )}
          </div>

          {/* Row 2: Sort By + AI Natural Scenario Dropdowns */}
          <div className="grid grid-cols-2 gap-2">
            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl border-2 border-[#222] bg-white text-[#222] font-black text-xs shadow-[1px_1px_0px_#222] focus:outline-none truncate"
              >
                <option value="sku">{lang === 'zh' ? '🔢 官方货号' : '🔢 Referencia SKU'}</option>
                <option value="sales">{lang === 'zh' ? '🔥 畅销排行' : '🔥 Más Vendidos'}</option>
                <option value="featured">{lang === 'zh' ? '⭐ 推荐精选' : '⭐ Destacados'}</option>
                {mode === 'store' && currentUser && (
                  <>
                    <option value="priceAsc">{lang === 'zh' ? '🪙 价格低到高' : '🪙 Precio menor'}</option>
                    <option value="priceDesc">{lang === 'zh' ? '💎 价格高到低' : '💎 Precio mayor'}</option>
                  </>
                )}
                <option value="newest">{lang === 'zh' ? '🆕 新品上市' : '🆕 Novedades'}</option>
                <option value="name">{lang === 'zh' ? '🔤 字母顺序' : '🔤 Nombre'}</option>
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 font-black text-[10px]">
                ▼
              </span>
            </div>

            {/* AI Scenario Selector */}
            <div className="relative">
              <select
                value={activeAIIntent?.id || ''}
                onChange={(e) => {
                  const intentId = e.target.value;
                  if (!intentId) {
                    setSearchQuery('');
                  } else {
                    const found = AI_INTENTS.find((i) => i.id === intentId);
                    if (found) {
                      setSearchQuery(found.triggers[0]);
                      setSortBy('sku');
                    }
                  }
                }}
                className={`w-full appearance-none pl-3 pr-7 py-2 rounded-xl border-2 border-[#222] font-black text-xs shadow-[1px_1px_0px_#222] focus:outline-none truncate ${
                  activeAIIntent
                    ? 'bg-purple-600 text-white border-purple-800'
                    : 'bg-purple-50 text-purple-950'
                }`}
              >
                <option value="">{lang === 'zh' ? '✨ AI 场景找货...' : '✨ Inspiración IA...'}</option>
                {AI_INTENTS.map((intent) => (
                  <option key={intent.id} value={intent.id}>
                    {lang === 'zh' ? intent.chipZh : intent.chipEs}
                  </option>
                ))}
              </select>
              <span className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-black text-[10px] ${activeAIIntent ? 'text-white' : 'text-purple-700'}`}>
                ▼
              </span>
            </div>
          </div>

          {/* Row 3: Single Touch-Swipeable Quick Pill Bar (Zero vertical bloat!) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
            <button
              onClick={() => {
                setQuickFilter('all');
                handleSelectDept('all');
                setSelectedSubCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] shrink-0 transition-all ${
                quickFilter === 'all' && selectedDept === 'all'
                  ? 'bg-[#222] text-white shadow-[2px_2px_0px_#222]'
                  : 'bg-white text-gray-800 shadow-[1px_1px_0px_#222]'
              }`}
            >
              {lang === 'zh' ? '全部' : 'Todos'}
            </button>

            <button
              onClick={() => {
                setQuickFilter('top500');
                setSortBy('sku');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] shrink-0 flex items-center gap-1 transition-all ${
                quickFilter === 'top500'
                  ? 'bg-[#e52521] text-white shadow-[2px_2px_0px_#222]'
                  : 'bg-white text-[#e52521] shadow-[1px_1px_0px_#222]'
              }`}
            >
              <span>🏆</span>
              <span>{lang === 'zh' ? '年度畅销榜' : 'Más Vendidos'}</span>
            </button>

            <button
              onClick={() => {
                handleSelectDept('12');
                setSelectedSubCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] shrink-0 flex items-center gap-1 transition-all ${
                selectedDept === '12'
                  ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_#222]'
                  : 'bg-emerald-100 text-emerald-950 shadow-[1px_1px_0px_#222]'
              }`}
            >
              <span>⚡</span>
              <span>{lang === 'zh' ? 'BeBasic 超值' : 'BeBasic'}</span>
            </button>

            <button
              onClick={() => {
                handleSelectDept('09');
                setSelectedSubCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] shrink-0 flex items-center gap-1 transition-all ${
                selectedDept === '09'
                  ? 'bg-amber-500 text-white shadow-[2px_2px_0px_#222]'
                  : 'bg-amber-100 text-amber-950 shadow-[1px_1px_0px_#222]'
              }`}
            >
              <span>⭐</span>
              <span>{lang === 'zh' ? '国际名牌' : 'Marcas'}</span>
            </button>

            <button
              onClick={() => {
                setQuickFilter('top1000');
                setSortBy('sku');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] shrink-0 flex items-center gap-1 transition-all ${
                quickFilter === 'top1000'
                  ? 'bg-amber-500 text-white shadow-[2px_2px_0px_#222]'
                  : 'bg-white text-amber-800 shadow-[1px_1px_0px_#222]'
              }`}
            >
              <span>⭐</span>
              <span>{lang === 'zh' ? '推荐精选' : 'Destacados'}</span>
            </button>

            <button
              onClick={() => setQuickFilter('isnew')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] shrink-0 flex items-center gap-1 transition-all ${
                quickFilter === 'isnew'
                  ? 'bg-[#5c94fc] text-white shadow-[2px_2px_0px_#222]'
                  : 'bg-white text-[#5c94fc] shadow-[1px_1px_0px_#222]'
              }`}
            >
              <span>🌟</span>
              <span>{lang === 'zh' ? '新品' : 'Nuevos'}</span>
            </button>

            <button
              onClick={() => setQuickFilter('ispromote')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] shrink-0 flex items-center gap-1 transition-all ${
                quickFilter === 'ispromote'
                  ? 'bg-rose-500 text-white shadow-[2px_2px_0px_#222]'
                  : 'bg-white text-rose-700 shadow-[1px_1px_0px_#222]'
              }`}
            >
              <span>🏷️</span>
              <span>{lang === 'zh' ? '促销' : 'Promoción'}</span>
            </button>
          </div>

          {/* Active AI scenario alert if active on mobile */}
          {activeAIIntent && (
            <div className="p-2 bg-purple-100 rounded-xl border-2 border-purple-400 flex items-center justify-between text-xs">
              <span className="font-bold text-purple-950 truncate">
                ✨ {lang === 'zh' ? activeAIIntent.chipZh : activeAIIntent.chipEs}
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 px-2 py-0.5 bg-white text-purple-900 rounded font-black border border-purple-300 shrink-0"
              >
                ✕ {lang === 'zh' ? '退出' : 'Quitar'}
              </button>
            </div>
          )}

          {/* Mobile Slim Result Summary */}
          <div className="pt-0.5 px-0.5 flex items-center justify-between text-[11px] font-black text-gray-600">
            <span>
              {lang === 'zh'
                ? `共 ${filteredProducts.length} 款商品 · 第 ${page}/${totalPages} 页`
                : `${filteredProducts.length} refs · Pág. ${page}/${totalPages}`}
            </span>
            <span className="text-gray-400">
              {mode === 'store'
                ? lang === 'zh' ? '🛒 零售选品' : '🛒 Pedido'
                : lang === 'zh' ? '🏛️ 展厅模式' : '🏛️ Showroom'}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP RICH LAYOUT (Preserved for Laptop & Desktop Screens) */}
        {/* ======================================================== */}
        <div className="hidden md:block">
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
                    setSortBy('sku');
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
                {lang === 'zh' ? '📑 全部分类' : '📑 Todas las Categorías'}
              </span>
            </div>

            {/* Direct Brand & BeBasic Fast Pass Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  handleSelectDept('09');
                  setSelectedSubCategory('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] transition-all flex items-center gap-1.5 active:translate-y-0.5 cursor-pointer ${
                  selectedDept === '09'
                    ? 'bg-[#e52521] text-white shadow-[2px_2px_0px_#222]'
                    : 'bg-amber-300 hover:bg-amber-400 text-gray-950 shadow-[2px_2px_0px_#222]'
                }`}
              >
                <span>🏷️</span>
                <span>{lang === 'zh' ? '⭐ 国际品牌' : '⭐ Primeras Marcas'}</span>
              </button>

              <button
                onClick={() => {
                  handleSelectDept('12');
                  setSelectedSubCategory('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#222] transition-all flex items-center gap-1.5 active:translate-y-0.5 cursor-pointer ${
                  selectedDept === '12'
                    ? 'bg-[#e52521] text-white shadow-[2px_2px_0px_#222]'
                    : 'bg-emerald-300 hover:bg-emerald-400 text-gray-950 shadow-[2px_2px_0px_#222]'
                }`}
              >
                <span>⚡</span>
                <span>{lang === 'zh' ? '⚡ BeBasic 系列' : '⚡ Línea BeBasic'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
            {MASTER_DEPARTMENTS.map((dept) => {
              const active = selectedDept === dept.id;
              const isBrandDept = dept.id === '09';
              const isBeBasicDept = dept.id === '12';
              return (
                <button
                  key={dept.id}
                  onClick={() => handleSelectDept(dept.id)}
                  className={`p-2.5 rounded-xl font-black text-xs border-2 md:border-3 border-[#222] transition-all flex items-center gap-2 text-left justify-start cursor-pointer ${
                    active
                      ? 'bg-[#e52521] text-white shadow-[3px_3px_0px_#222] -translate-y-0.5'
                      : isBrandDept
                      ? 'bg-amber-100 hover:bg-amber-200 text-gray-950 shadow-[2px_2px_0px_#222] ring-2 ring-amber-400'
                      : isBeBasicDept
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-gray-950 shadow-[2px_2px_0px_#222] ring-2 ring-emerald-400'
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
              { nameZh: 'Bic 比克', nameEs: 'Bic', subKey: 'Bic' },
              { nameZh: 'Pilot 百乐', nameEs: 'Pilot', subKey: 'Pilot' },
              { nameZh: 'Milan 米兰', nameEs: 'Milan', subKey: 'Milan' },
              { nameZh: 'Stabilo 思笔乐', nameEs: 'Stabilo', subKey: 'Stabilo' },
              { nameZh: 'Edding 艾丁', nameEs: 'Edding', subKey: 'Edding' },
              { nameZh: 'Jovi 彩泥', nameEs: 'Jovi', subKey: 'Jovi' },
              { nameZh: 'Faber-Castell 辉柏嘉', nameEs: 'Faber-Castell', subKey: 'Faber-Castell' },
              { nameZh: 'Rubio 字帖', nameEs: 'Rubio', subKey: 'Rubio' },
              { nameZh: 'Oxford 牛津', nameEs: 'Oxford', subKey: 'Oxford' },
              { nameZh: 'Staedtler 施德楼', nameEs: 'Staedtler', subKey: 'Staedtler' },
              { nameZh: 'Pritt 百特', nameEs: 'Pritt', subKey: 'Pritt' },
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
                      ? '国际大牌专区：'
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
                    ? '全部名牌'
                    : 'Todas las Marcas'
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
              onClick={() => {
                setQuickFilter('top500');
                setSortBy('sku');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black border-2 border-[#222] flex items-center gap-1 ${
                quickFilter === 'top500' ? 'bg-[#e52521] text-white shadow-[1px_1px_0px_#222]' : 'bg-white text-[#e52521]'
              }`}
            >
              <span>🏆</span>
              <span>{lang === 'zh' ? '年度畅销榜' : 'Los Más Vendidos'}</span>
            </button>
            <button
              onClick={() => {
                setQuickFilter('top1000');
                setSortBy('sku');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black border-2 border-[#222] flex items-center gap-1 ${
                quickFilter === 'top1000' ? 'bg-amber-500 text-white shadow-[1px_1px_0px_#222]' : 'bg-white text-amber-700'
              }`}
            >
              <span>⭐</span>
              <span>{lang === 'zh' ? '推荐精选' : 'Selección Destacada'}</span>
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

          <div className="flex items-center gap-2">
            <div className="text-xs md:text-sm font-black text-[#222] bg-white px-3 py-1.5 rounded-xl border-2 border-[#222]">
              {lang === 'zh'
                ? `共 ${filteredProducts.length} 款商品 · 第 ${page}/${totalPages} 页`
                : `${filteredProducts.length} productos · Pág. ${page}/${totalPages}`}
            </div>
          </div>
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
                        🔥 {lang === 'zh' ? '年度畅销' : 'Más Vendido'}
                      </span>
                    ) : p.isTop1000 ? (
                      <span className="bg-amber-500 text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#222] shadow-[1px_1px_0px_#222]">
                        ⭐ {lang === 'zh' ? '推荐精选' : 'Destacado'}
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
                    className="relative w-full aspect-square bg-[#f9fafb] p-3 flex items-center justify-center cursor-pointer border-b-3 border-[#222] overflow-hidden group-hover:bg-amber-50/40 transition-colors select-none"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.namees}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                      onError={(e) => {
                        (e.target as HTMLElement).style.opacity = '0.5';
                      }}
                    />
                    <WatermarkOverlay />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
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
                        currentUser ? (
                          <div>
                            {/* Retail Price Display */}
                            <div className="flex items-baseline justify-between mb-2">
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 block leading-none">
                                  {lang === 'zh' ? '建议零售价' : 'PRECIO RECOMENDADO'}
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
                                    Paq. {p.packet}u
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
                              className={`w-full py-2 px-3 rounded-xl font-black text-xs md:text-sm border-3 border-[#222] shadow-[2px_2px_0px_#222] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-400 text-[#222]'
                                  : 'bg-[#f8d878] text-[#222] hover:bg-yellow-400'
                              }`}
                            >
                              <span>{isAdded ? '✓' : '🛒'}</span>
                              <span>
                                {isAdded
                                  ? lang === 'zh'
                                    ? '已加入购物车!'
                                    : '¡Añadido!'
                                  : lang === 'zh'
                                    ? '加入购物车'
                                    : 'Añadir al Carrito'}
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div>
                            {/* Locked Price for Non-Logged-in Guest */}
                            <div className="mb-2 bg-amber-50 p-1.5 rounded-lg border border-amber-200 text-center">
                              <span className="text-[10px] md:text-[11px] font-bold text-amber-900 block leading-tight">
                                🔒 {lang === 'zh' ? '登录查看价格' : 'Inicia sesión'}
                              </span>
                            </div>

                            <button
                              onClick={() => setIsAuthModalOpen(true)}
                              className="w-full py-2 px-3 rounded-xl font-black text-xs md:text-sm bg-white hover:bg-amber-100 text-[#222] border-3 border-[#222] shadow-[2px_2px_0px_#222] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>🔑</span>
                              <span>{lang === 'zh' ? '登录查看价格' : 'Iniciar sesión'}</span>
                            </button>
                          </div>
                        )
                      ) : (
                        <div>
                          {/* Showroom / Museum Mode (Zero Price) */}
                          <div className="mb-2 bg-[#5c94fc]/10 p-1.5 rounded-lg border border-[#5c94fc]/30 text-center">
                            <span className="text-[11px] font-black text-[#5c94fc] block">
                              🏛️ {lang === 'zh' ? '样品展品' : 'Muestra'}
                            </span>
                          </div>

                          <button
                            onClick={() => addToCart(p, 1)}
                            className={`w-full py-2 px-3 rounded-xl font-black text-xs md:text-sm border-3 border-[#222] shadow-[2px_2px_0px_#222] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-400 text-[#222]'
                                : 'bg-[#5c94fc] text-white hover:bg-blue-600'
                            }`}
                          >
                            <span>{isAdded ? '✓' : '📋'}</span>
                            <span>
                              {isAdded
                                ? lang === 'zh'
                                  ? '已加入预定车!'
                                  : '¡Añadido!'
                                : lang === 'zh'
                                  ? '加入预定车'
                                  : 'Añadir a Reserva'}
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
            <span className="text-2xl">🛒</span>
            <div className="text-left">
              <div className="text-xs uppercase font-extrabold opacity-80 leading-none">
                {mode === 'store'
                  ? lang === 'zh'
                    ? '已选订货车'
                    : 'Mi Carrito'
                  : lang === 'zh'
                    ? '已选样品预定车'
                    : 'Lista Muestras'}
              </div>
              <div className="text-sm md:text-base font-black">
                {totalItemsCount} {lang === 'zh' ? '包/件商品' : 'items'}
                {mode === 'store' && currentUser && ` · ${formatEuro(totalCartPVP)}`}
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
                <span className="text-2xl">🛒</span>
                <div>
                  <h2 className="font-black text-lg text-[#222]">
                    {mode === 'store'
                      ? lang === 'zh'
                        ? '我的采购订货车'
                        : 'Mi Carrito de Compra'
                      : lang === 'zh'
                        ? '我的样品预定清单'
                        : 'Mi Lista de Reserva'}
                  </h2>
                  <span className="text-xs font-bold text-gray-700">
                    {cart.length} {lang === 'zh' ? '款不同货品' : 'referencias'} · {totalItemsCount}{' '}
                    {lang === 'zh' ? '包/件' : 'unidades'}
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
                          {formatEuro(pvp)} × {item.quantity} = {formatEuro(pvp * item.quantity)}
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
                  <span>{lang === 'zh' ? '总计预估:' : 'Total Estimado:'}</span>
                  <span className="text-xl text-[#e52521]">{formatEuro(totalCartPVP)}</span>
                </div>
              )}

              {/* Direct WhatsApp Order Button */}
              <button
                onClick={generateWhatsAppOrder}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] font-black text-sm md:text-base flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                <span className="text-lg">📱</span>
                <span>
                  {mode === 'store'
                    ? lang === 'zh'
                      ? '通过 WhatsApp 发送订货单'
                      : 'Enviar Pedido por WhatsApp'
                    : lang === 'zh'
                      ? '通过 WhatsApp 咨询样品清单'
                      : 'Consultar Lista por WhatsApp'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCart}
                  className="py-2 px-3 bg-white text-gray-600 hover:text-red-600 rounded-xl border-2 border-gray-300 text-xs font-bold"
                >
                  {lang === 'zh' ? '清空' : 'Vaciar'}
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-2 bg-white text-[#222] hover:bg-gray-200 rounded-xl border-2 border-[#222] text-xs font-black"
                >
                  {lang === 'zh' ? '继续选品' : 'Seguir mirando'}
                </button>
                <button
                  onClick={exportCartToExcel}
                  title="后台导出"
                  className="py-2 px-3 bg-white text-gray-400 hover:text-gray-700 rounded-xl border border-gray-300 text-xs font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span>📊</span>
                  <span>{lang === 'zh' ? '后台导出' : 'Excel'}</span>
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
              {/* Image Preview with 2K Retina Indicator & KYRMAX Anti-Scan Watermark */}
              <div
                className="relative aspect-4/3 bg-[#fdfdfd] rounded-2xl border-3 border-[#222] mb-4 flex items-center justify-center overflow-hidden p-4 select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.namees}
                  draggable={false}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
                <WatermarkOverlay isHD={true} />
                <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20 z-20">
                  2K Ultra HD
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
                      🔥 {lang === 'zh' ? '年度权威畅销' : 'Superventas Oficial'}
                    </span>
                  ) : selectedProduct.isTop1000 ? (
                    <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-md border border-[#222]">
                      ⭐ {lang === 'zh' ? '官方推荐精选' : 'Selección Oficial'}
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
                  currentUser ? (
                    <div className="bg-[#f8d878] p-4 rounded-2xl border-3 border-[#222] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-gray-700 block">
                          {lang === 'zh' ? '建议零售价' : 'PRECIO RECOMENDADO'}
                        </span>
                        <div className="text-2xl font-black text-[#e52521]">
                          {selectedProduct.price > 0
                            ? formatEuro(calculatePVP(selectedProduct.price))
                            : 'Consultar'}
                        </div>
                      </div>
                      {selectedProduct.price > 0 && selectedProduct.packet > 1 && (
                        <div className="text-right text-xs">
                          <span className="text-gray-600 block">{lang === 'zh' ? '整包参考价:' : 'Por paquete:'}</span>
                          <span className="font-black text-sm">
                            {formatEuro(calculatePVP(selectedProduct.price) * selectedProduct.packet)}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-50 p-4 rounded-2xl border-3 border-[#222] flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <span className="text-sm font-black text-amber-900 block">
                          🔒 {lang === 'zh' ? '登录查看价格' : 'Inicia sesión para ver precios'}
                        </span>
                        <span className="text-xs text-gray-600 block mt-0.5">
                          {lang === 'zh' ? '登录后可查看指导价格并加入采购清单' : 'Inicia sesión para ver precios y formalizar pedidos.'}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-4 py-2 bg-[#f8d878] hover:bg-yellow-400 text-[#222] font-black rounded-xl border-2 border-[#222] shadow-[2px_2px_0px_#222] text-xs shrink-0 cursor-pointer"
                      >
                        🔑 {lang === 'zh' ? '登录 / 注册' : 'Acceder'}
                      </button>
                    </div>
                  )
                ) : (
                  <div className="bg-[#5c94fc]/15 p-4 rounded-2xl border-3 border-[#5c94fc] text-center">
                    <span className="text-sm font-black text-[#5c94fc] block">
                      🏛️ {lang === 'zh' ? '样品展厅' : 'Sala de Muestras'}
                    </span>
                    <span className="text-xs text-gray-600 block mt-0.5">
                      {lang === 'zh' ? '样品展示，支持添加至预定清单' : 'Exposición para selección y reserva de muestras.'}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {mode === 'store' ? (
                    currentUser ? (
                      <button
                        onClick={() => {
                          addToCart(selectedProduct, 1);
                          setSelectedProduct(null);
                          setIsCartOpen(true);
                        }}
                        className="flex-1 py-3.5 rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] font-black text-base flex items-center justify-center gap-2 bg-[#e52521] text-white hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                      >
                        <span>🛒</span>
                        <span>{lang === 'zh' ? '加入购物车' : 'Añadir al Carrito'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="flex-1 py-3.5 rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] font-black text-base flex items-center justify-center gap-2 bg-[#f8d878] hover:bg-yellow-400 text-[#222] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                      >
                        <span>🔑</span>
                        <span>{lang === 'zh' ? '登录商户账号后加购' : 'Inicia sesión para pedir'}</span>
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, 1);
                        setSelectedProduct(null);
                        setIsCartOpen(true);
                      }}
                      className="flex-1 py-3.5 rounded-2xl border-3 border-[#222] shadow-[3px_3px_0px_#222] font-black text-base flex items-center justify-center gap-2 bg-[#5c94fc] text-white hover:bg-blue-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                      <span>📋</span>
                      <span>{lang === 'zh' ? '加入样品预定车' : 'Añadir a Reserva'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. USER LOGIN & REGISTRATION MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[8px_8px_0px_#222] max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-[#e52521] p-4 text-white border-b-4 border-[#222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <span className="font-black text-lg md:text-xl">
                  {lang === 'zh' ? '商户与采购客户中心' : 'Acceso Clientes y Empresas'}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#222] font-black flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b-3 border-[#222] bg-gray-100">
              <button
                onClick={() => {
                  setAuthTab('login');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`flex-1 py-3 text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-white text-[#222] border-b-4 border-[#e52521] -mb-[3px]'
                    : 'text-gray-500 hover:text-[#222]'
                }`}
              >
                <span>🔑</span>
                <span>{lang === 'zh' ? '账号登录' : 'Iniciar Sesión'}</span>
              </button>
              <button
                onClick={() => {
                  setAuthTab('register');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`flex-1 py-3 text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-white text-[#222] border-b-4 border-[#e52521] -mb-[3px]'
                    : 'text-gray-500 hover:text-[#222]'
                }`}
              >
                <span>✨</span>
                <span>{lang === 'zh' ? '新商户注册' : 'Crear Cuenta'}</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Alert message */}
              {authError && (
                <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{authError}</span>
                </div>
              )}
              {authSuccess && (
                <div className="mb-4 p-3 bg-emerald-100 border-2 border-emerald-500 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <span>✅</span>
                  <span>{authSuccess}</span>
                </div>
              )}

              {authTab === 'login' ? (
                <div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        {lang === 'zh' ? '用户名或邮箱' : 'Usuario o email'}
                      </label>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder={lang === 'zh' ? '请输入用户名或邮箱' : 'Usuario o email'}
                        className="w-full px-3.5 py-2.5 rounded-xl border-3 border-[#222] text-sm font-bold bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        {lang === 'zh' ? '密码' : 'Contraseña'}
                      </label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border-3 border-[#222] text-sm font-bold bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#e52521] hover:bg-red-600 text-white rounded-xl border-3 border-[#222] shadow-[3px_3px_0px_#222] text-sm font-black transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>🚀</span>
                      <span>{lang === 'zh' ? '立即登录' : 'Entrar en la Tienda'}</span>
                    </button>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      {lang === 'zh' ? '用户名 *' : 'Nombre de Usuario *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="ej: papeleria_sol"
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#222] text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      {lang === 'zh' ? '商户邮箱 *' : 'Email de Contacto *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="tienda@ejemplo.com"
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#222] text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        {lang === 'zh' ? '密码 *' : 'Contraseña *'}
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full px-3 py-2 rounded-xl border-2 border-[#222] text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        {lang === 'zh' ? '确认密码 *' : 'Confirmar *'}
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full px-3 py-2 rounded-xl border-2 border-[#222] text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        {lang === 'zh' ? '商户/店铺名称' : 'Nombre de Tienda'}
                      </label>
                      <input
                        type="text"
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        placeholder="ej: Librería Madrid"
                        className="w-full px-3 py-2 rounded-xl border-2 border-[#222] text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        {lang === 'zh' ? 'WhatsApp/电话' : 'WhatsApp/Tel'}
                      </label>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+34 600..."
                        className="w-full px-3 py-2 rounded-xl border-2 border-[#222] text-xs font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-[#5c94fc] hover:bg-blue-600 text-white rounded-xl border-3 border-[#222] shadow-[3px_3px_0px_#222] text-sm font-black transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>✨</span>
                    <span>{lang === 'zh' ? '立即创建商户账号' : 'Completar Registro'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
