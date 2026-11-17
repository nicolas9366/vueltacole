import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Home } from './components/Home';
import { CONFIG_I18N, Lang } from './data/christmas2026DB';

const MapApp = lazy(() => import('./components/MapApp').then((m) => ({ default: m.MapApp })));
const ActionStore = lazy(() =>
  import('./components/ActionStore').then((m) => ({ default: m.ActionStore }))
);
const DailyVitrina = lazy(() =>
  import('./components/DailyVitrina').then((m) => ({ default: m.DailyVitrina }))
);

type ViewMode = 'home' | 'tienda' | 'map' | 'vitrina';

export const App: React.FC = () => {
  // Auto-detect browser language per REBUILD_SOP §3
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const qLang = new URLSearchParams(window.location.search).get('lang')?.toLowerCase();
      if (qLang === 'zh' || qLang === 'en' || qLang === 'es') return qLang;
    }
    if (typeof navigator !== 'undefined') {
      const devLang = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
      if (devLang.startsWith('zh')) return 'zh';
      if (devLang.startsWith('es')) return 'es';
      return 'en';
    }
    return 'en';
  });

  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const initial = (window as any).__INITIAL_PAGE__;

      if (
        initial === 'tienda' ||
        host.startsWith('shop.') ||
        host.startsWith('tienda.') ||
        host.startsWith('store.') ||
        host.includes('shop.vueltacole.com') ||
        host.includes('tienda.vueltacole.com') ||
        host.includes('store.vueltacole.com') ||
        pathname.includes('shop') ||
        pathname.endsWith('shop.html') ||
        search.includes('page=tienda') ||
        search.includes('page=shop') ||
        hash.includes('tienda') ||
        hash.includes('shop')
      ) {
        return 'tienda';
      }
      if (initial === 'vitrina' || pathname.endsWith('vitrina.html') || search.includes('vitrina') || hash.includes('vitrina')) {
        return 'vitrina';
      }
      if (pathname.includes('map') || search.includes('page=map') || hash.includes('map')) {
        return 'map';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const syncRouteFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const host = window.location.hostname.toLowerCase();
      const page = params.get('page')?.toLowerCase();
      const initial = (window as any).__INITIAL_PAGE__;

      if (
        initial === 'tienda' ||
        host.startsWith('shop.') ||
        host.startsWith('tienda.') ||
        host.startsWith('store.') ||
        host.includes('shop.vueltacole.com') ||
        host.includes('tienda.vueltacole.com') ||
        host.includes('store.vueltacole.com') ||
        page === 'tienda' ||
        page === 'shop' ||
        page === 'catalogo' ||
        pathname.includes('shop') ||
        pathname.endsWith('shop.html') ||
        hash.includes('tienda') ||
        hash.includes('catalogo') ||
        hash.includes('store') ||
        hash.includes('shop')
      ) {
        setView('tienda');
      } else if (
        page === 'vitrina' ||
        hash.includes('vitrina') ||
        pathname.endsWith('vitrina.html') ||
        initial === 'vitrina'
      ) {
        setView('vitrina');
      } else if (page === 'map' || hash.includes('map')) {
        setView('map');
      } else {
        setView('home');
      }
    };

    syncRouteFromUrl();
    window.addEventListener('hashchange', syncRouteFromUrl);
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromUrl);
      window.removeEventListener('popstate', syncRouteFromUrl);
    };
  }, []);

  const navigateTo = (target: ViewMode) => {
    setView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (target === 'home') {
      window.history.pushState({}, '', window.location.pathname);
    } else {
      window.history.pushState({}, '', `?page=${target}#/${target}`);
    }
  };

  const t = CONFIG_I18N[lang];

  return (
    <div className="min-h-screen flex flex-col font-['Fredoka',sans-serif]">
      {/* GLOBAL STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-[#111827] border-b-4 border-[#e52521] px-4 py-3 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-[#e52521] rounded-xl border-2 border-[#f8d878] flex items-center justify-center shadow-[2px_2px_0px_#f8d878]">
              <span className="font-black text-white text-base tracking-tighter">KM</span>
            </div>
            <div>
              <div className="font-black text-white text-lg leading-none tracking-wide">
                KYRMAX <span className="text-[#f8d878] text-xs">· {lang === 'zh' ? '文具贸易' : lang === 'en' ? 'Stationery' : 'Papelería'}</span>
              </div>
              <div className="text-[11px] text-gray-400 font-medium">{t.brandSub}</div>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="flex flex-wrap items-center gap-2">
            {view === 'tienda' ? (
              <>
                <button
                  onClick={() => navigateTo('tienda')}
                  className="px-3.5 py-2 rounded-xl font-black text-xs md:text-sm border-2 transition-all flex items-center gap-1.5 bg-[#f8d878] text-[#222] border-[#222] shadow-[2px_2px_0px_#e52521]"
                >
                  <span>🏪</span>
                  <span>{lang === 'zh' ? '全系商城' : 'Tienda & Catálogo'}</span>
                </button>
                <a
                  href="https://vueltacole.com"
                  className="px-3.5 py-2 rounded-xl font-black text-xs md:text-sm border-2 bg-slate-800 text-gray-200 border-slate-700 hover:bg-slate-700 flex items-center gap-1.5"
                >
                  <span>🏠</span>
                  <span>{lang === 'zh' ? '返回主站 vueltacole.com' : 'Ir a vueltacole.com'}</span>
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('home')}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs md:text-sm border-2 transition-all ${
                    view === 'home'
                      ? 'bg-[#f8d878] text-[#222] border-[#222] shadow-[2px_2px_0px_#e52521]'
                      : 'bg-slate-800 text-gray-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {t.navHome}
                </button>

                <button
                  onClick={() => navigateTo('vitrina')}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs md:text-sm border-2 transition-all ${
                    view === 'vitrina'
                      ? 'bg-[#e52521] text-white border-[#f8d878] shadow-[2px_2px_0px_#f8d878]'
                      : 'bg-amber-500 text-[#111827] border-[#222] hover:bg-amber-400'
                  }`}
                >
                  {lang === 'zh' ? '🔥 每日主推' : lang === 'en' ? '🔥 Daily Pick' : '🔥 Vitrina'}
                </button>

                <button
                  onClick={() => navigateTo('map')}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs md:text-sm border-2 transition-all ${
                    view === 'map'
                      ? 'bg-[#5c94fc] text-white border-[#f8d878]'
                      : 'bg-slate-800 text-gray-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {t.navMap}
                </button>

                <a
                  href="https://shop.vueltacole.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl font-black text-xs md:text-sm border-2 transition-all flex items-center gap-1.5 bg-[#f8d878] text-[#222] border-[#222] shadow-[2px_2px_0px_#e52521] hover:bg-yellow-300"
                >
                  <span>🏪</span>
                  <span>{lang === 'zh' ? '全品商城 ↗' : lang === 'en' ? 'Shop ↗' : 'Tienda ↗'}</span>
                </a>
              </>
            )}

            {/* Trilingual Language Switcher */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border-2 border-slate-700 ml-1">
              <button
                onClick={() => setLang('zh')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  lang === 'zh' ? 'bg-[#e52521] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  lang === 'en' ? 'bg-[#e52521] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  lang === 'es' ? 'bg-[#e52521] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                ES
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ACTIVE VIEW ROUTER */}
      <main className="flex-1">
        {view === 'home' && (
          <Home
            lang={lang}
            onNavigateToTienda={() => navigateTo('tienda')}
            onNavigateToMap={() => navigateTo('map')}
          />
        )}
        {view === 'tienda' && (
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center bg-[#fcf8f2] text-[#e52521] font-black text-xl">
                🍄 Cargando Tienda & Catálogo Oficial...
              </div>
            }
          >
            <ActionStore
              lang={lang === 'zh' ? 'zh' : 'es'}
              onNavigateHome={() => navigateTo('home')}
            />
          </Suspense>
        )}
        {view === 'vitrina' && (
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center bg-[#fcf8f2] text-[#e52521] font-black text-xl">
                🔥 Cargando Vitrina Diaria...
              </div>
            }
          >
            <DailyVitrina lang={lang} onNavigateHome={() => navigateTo('home')} />
          </Suspense>
        )}
        {view === 'map' && (
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center bg-[#0f172a] text-[#f8d878] font-black text-xl">
                🗺️ Cargando Mapa Interactivo Main Paper...
              </div>
            }
          >
            <MapApp onNavigateHome={() => navigateTo('home')} />
          </Suspense>
        )}
      </main>
    </div>
  );
};
