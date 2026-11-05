import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Home } from './components/Home';
import { NavidadPromo } from './components/NavidadPromo';
import { CONFIG_I18N, Lang } from './data/christmas2026DB';

const MapApp = lazy(() => import('./components/MapApp').then((m) => ({ default: m.MapApp })));
const ActionStore = lazy(() =>
  import('./components/ActionStore').then((m) => ({ default: m.ActionStore }))
);
const Redemption = lazy(() =>
  import('./components/Redemption').then((m) => ({ default: m.Redemption }))
);

type ViewMode = 'home' | 'tienda' | 'navidad' | 'map' | 'canje';

export const App: React.FC = () => {
  // Auto-detect browser language per REBUILD_SOP §3
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('zh')) {
      return 'zh';
    }
    return 'zh'; // Default to zh for B2B Chinese bazaar owners in Spain, with 1-click ES toggle
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
        host.includes('shop.vueltacole.com') ||
        pathname.includes('shop') ||
        pathname.endsWith('shop.html') ||
        search.includes('page=tienda') ||
        search.includes('page=shop') ||
        hash.includes('tienda') ||
        hash.includes('shop')
      ) {
        return 'tienda';
      }
      if (initial === 'navidad' || pathname.endsWith('navidad.html') || search.includes('navidad')) {
        return 'navidad';
      }
    }
    return 'home';
  });
  const [canjeToken, setCanjeToken] = useState<string>('');

  useEffect(() => {
    const syncRouteFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const host = window.location.hostname.toLowerCase();
      const token = params.get('canje');
      const page = params.get('page')?.toLowerCase();
      const initial = (window as any).__INITIAL_PAGE__;

      if (token) {
        setCanjeToken(token);
        setView('canje');
      } else if (
        initial === 'tienda' ||
        host.startsWith('shop.') ||
        host.includes('shop.vueltacole.com') ||
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
        page === 'navidad' ||
        hash.includes('navidad') ||
        pathname.endsWith('navidad.html') ||
        initial === 'navidad'
      ) {
        setView('navidad');
      } else if (page === 'map' || hash.includes('map')) {
        setView('map');
      } else if (page === 'canje' || hash.includes('canje')) {
        setView('canje');
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
              <span className="font-black text-white text-base tracking-tighter">MP*</span>
            </div>
            <div>
              <div className="font-black text-white text-lg leading-none tracking-wide">
                MAIN PAPER <span className="text-[#f8d878] text-xs">20º ANIV.</span>
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
                  <span>{lang === 'zh' ? '全系商城 (6,109款)' : 'Tienda & Catálogo (6.109)'}</span>
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
                  onClick={() => navigateTo('navidad')}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs md:text-sm border-2 transition-all ${
                    view === 'navidad'
                      ? 'bg-[#e52521] text-white border-[#f8d878] shadow-[2px_2px_0px_#f8d878]'
                      : 'bg-[#14532d] text-[#f8d878] border-[#f8d878]/60 hover:bg-emerald-800'
                  }`}
                >
                  {t.navNavidad}
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

                <button
                  onClick={() => navigateTo('canje')}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs md:text-sm border-2 transition-all ${
                    view === 'canje'
                      ? 'bg-[#f8d878] text-[#222] border-[#222]'
                      : 'bg-slate-800 text-gray-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {t.navCanje}
                </button>

                <a
                  href="https://shop.vueltacole.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl font-black text-xs md:text-sm border-2 transition-all flex items-center gap-1.5 bg-[#f8d878] text-[#222] border-[#222] shadow-[2px_2px_0px_#e52521] hover:bg-yellow-300"
                >
                  <span>🏪</span>
                  <span>{lang === 'zh' ? '全品商城 ↗' : 'Tienda ↗'}</span>
                </a>
              </>
            )}

            {/* Bilingual Language Switcher (REBUILD_SOP §3) */}
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
            onNavigateToMap={() => navigateTo('map')}
            onNavigateToNavidad={() => navigateTo('navidad')}
            onNavigateToCanje={() => navigateTo('canje')}
          />
        )}
        {view === 'tienda' && (
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center bg-[#fcf8f2] text-[#e52521] font-black text-xl">
                🍄 Cargando Tienda & Catálogo Completo (6.109 Refs)...
              </div>
            }
          >
            <ActionStore
              lang={lang}
              onNavigateHome={() => navigateTo('home')}
              onNavigateToNavidad={() => navigateTo('navidad')}
            />
          </Suspense>
        )}
        {view === 'navidad' && (
          <NavidadPromo lang={lang} onNavigateHome={() => navigateTo('home')} />
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
        {view === 'canje' && (
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center bg-[#0f172a] text-[#f8d878] font-black text-xl">
                🎁 Cargando Sistema de Canje...
              </div>
            }
          >
            <Redemption
              initialToken={canjeToken || 'CP-SMN3BYY1HKUN'}
              onClose={() => navigateTo('home')}
            />
          </Suspense>
        )}
      </main>
    </div>
  );
};
