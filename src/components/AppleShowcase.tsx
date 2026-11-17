import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DAILY_VITRINA_ITEMS, DailyVitrinaEntry } from '../data/dailyVitrinaDB';
import { Lang } from '../data/christmas2026DB';

interface AppleShowcaseProps {
  lang: Lang;
  onSetLang?: (l: Lang) => void;
}

const EDITORIAL_UI: Record<
  Lang,
  {
    collection: string;
    overview: string;
    gallery: string;
    film: string;
    scrollCta: string;
    galleryKicker: string;
    galleryHeading: string;
    gallerySub: string;
    filmKicker: string;
    filmHeading: string;
    filmSub: string;
    footerBrand: string;
    footerTag: string;
  }
> = {
  zh: {
    collection: 'MP* STYLE · 精选系列',
    overview: '概览',
    gallery: '细节图集',
    film: '动态短片',
    scrollCta: '探索实效细节',
    galleryKicker: 'VISUAL ARCHIVE',
    galleryHeading: '每一处质感，清晰可见。',
    gallerySub: '真实使用场景与微距笔触表现，轻触图片可全屏放大赏析。',
    filmKicker: 'IN MOTION',
    filmHeading: '光影之间，看懂表现力。',
    filmSub: '从开盒上手到多材质落笔，一镜呈现真实创作体验。',
    footerBrand: 'MP* STYLE · KYRMAX STUDIO',
    footerTag: '专注日常创作美感与专业书写表现',
  },
  en: {
    collection: 'MP* STYLE · EDITION',
    overview: 'Overview',
    gallery: 'Gallery',
    film: 'Film',
    scrollCta: 'Explore the craft',
    galleryKicker: 'VISUAL ARCHIVE',
    galleryHeading: 'Every nuance, framed clearly.',
    gallerySub: 'Studio lighting and real-surface performance. Tap any frame to inspect in full screen.',
    filmKicker: 'IN MOTION',
    filmHeading: 'Precision in every stroke.',
    filmSub: 'Watch color payoff, ink flow, and everyday versatility unfold naturally.',
    footerBrand: 'MP* STYLE · KYRMAX STUDIO',
    footerTag: 'Crafted for modern studio creativity and everyday precision',
  },
  es: {
    collection: 'MP* STYLE · EDICIÓN',
    overview: 'Resumen',
    gallery: 'Galería',
    film: 'Vídeo',
    scrollCta: 'Descubrir detalles',
    galleryKicker: 'ARCHIVO VISUAL',
    galleryHeading: 'Cada matiz, en primer plano.',
    gallerySub: 'Resultados reales sobre distintas superficies. Toca cualquier imagen para ampliarla.',
    filmKicker: 'EN MOVIMIENTO',
    filmHeading: 'Color vivo en cada trazo.',
    filmSub: 'Observa la fluidez, cobertura y acabado en uso real.',
    footerBrand: 'MP* STYLE · KYRMAX STUDIO',
    footerTag: 'Diseño y color para crear cada día',
  },
};

export const AppleShowcase: React.FC<AppleShowcaseProps> = ({ lang, onSetLang }) => {
  const ui = EDITORIAL_UI[lang];
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const item: DailyVitrinaEntry = useMemo(() => {
    if (typeof window !== 'undefined') {
      const qSku = new URLSearchParams(window.location.search).get('sku');
      if (qSku) {
        const found = DAILY_VITRINA_ITEMS.find(
          (i) =>
            i.sku.toLowerCase() === qSku.toLowerCase() ||
            i.sku.split('/')[0].trim().toLowerCase() === qSku.toLowerCase() ||
            i.id === qSku.toLowerCase()
        );
        if (found) return found;
      }
    }
    return DAILY_VITRINA_ITEMS[0];
  }, []);

  const title = lang === 'zh' ? item.titleZh : lang === 'en' ? item.titleEn : item.titleEs;
  const tagline = lang === 'zh' ? item.taglineZh : lang === 'en' ? item.taglineEn : item.taglineEs;
  const highlights = lang === 'zh' ? item.highlightsZh : lang === 'en' ? item.highlightsEn : item.highlightsEs;
  const consumerVideo = item.videos[item.videos.length - 1] || item.videos[0];
  const heroPhoto = item.images[2]?.src || item.images[0]?.src || item.heroImage;
  const shortSku = item.sku.split('/')[0].trim();

  return (
    <div
      className="min-h-screen bg-[#FAFAFA] text-[#09090B] antialiased overflow-x-hidden selection:bg-[#EC4899]/20"
      style={{ fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Fullscreen Lightbox */}
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
            alt={title}
            className="max-w-full max-h-[88vh] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}

      {/* Minimalist Sticky Glass Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FAFAFA]/85 border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#EC4899] shrink-0" />
            <span
              className="font-bold text-sm sm:text-base tracking-tight text-[#09090B] truncate"
              style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
            >
              {shortSku}
            </span>
            <span className="hidden md:inline text-xs text-zinc-500 font-medium truncate">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <nav className="hidden sm:flex items-center gap-5 text-xs font-semibold text-zinc-600">
              <a href="#overview" className="hover:text-[#09090B] transition-colors">
                {ui.overview}
              </a>
              <a href="#gallery" className="hover:text-[#09090B] transition-colors">
                {ui.gallery}
              </a>
              {consumerVideo && (
                <a href="#film" className="hover:text-[#09090B] transition-colors">
                  {ui.film}
                </a>
              )}
            </nav>

            {onSetLang && (
              <div className="flex items-center bg-zinc-200/70 rounded-full p-0.5 text-[11px] font-semibold">
                {(['zh', 'en', 'es'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => onSetLang(l)}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      lang === l
                        ? 'bg-[#09090B] text-white shadow-sm'
                        : 'text-zinc-600 hover:text-[#09090B]'
                    }`}
                  >
                    {l === 'zh' ? '中' : l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 1. EDITORIAL ASYMMETRIC HERO */}
      <section id="overview" className="pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-5"
          >
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-[#EC4899]">
              <span>{ui.collection}</span>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-500">{shortSku}</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.06] text-[#09090B]"
              style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
            >
              {title}
            </h1>

            <p className="text-base sm:text-xl text-[#3F3F46] font-medium leading-relaxed max-w-xl">
              {tagline}
            </p>

            <div className="pt-2">
              <a
                href="#gallery"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#09090B] hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg shadow-zinc-900/15 cursor-pointer"
              >
                <span>{ui.scrollCta}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div
              onClick={() => setLightboxImg(heroPhoto)}
              className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-white shadow-[0_30px_80px_rgba(9,9,11,0.12)] border border-zinc-200/70 cursor-zoom-in group"
            >
              <img
                src={heroPhoto}
                alt={title}
                className="w-full aspect-square object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SCROLL-TRIGGERED ARCHITECTURAL BENTO HIGHLIGHTS */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-zinc-200/70">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {highlights.map((hl, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-[24px] p-7 sm:p-8 flex flex-col justify-between min-h-[170px] border transition-transform duration-300 hover:-translate-y-1 ${
                idx === 1
                  ? 'bg-[#18181B] text-white border-zinc-800 shadow-xl'
                  : 'bg-[#F4F4F5] text-[#09090B] border-zinc-200/80'
              }`}
            >
              <span
                className={`text-xs font-extrabold tracking-[0.2em] ${
                  idx === 1 ? 'text-[#EC4899]' : 'text-zinc-400'
                }`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                0{idx + 1}
              </span>
              <p className="text-base sm:text-lg font-semibold leading-snug mt-6">{hl}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE VISUAL GALLERY */}
      <section id="gallery" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-10 sm:mb-14"
          >
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#EC4899]">
              {ui.galleryKicker}
            </span>
            <h2
              className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[#09090B] mt-2"
              style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
            >
              {ui.galleryHeading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 font-medium">{ui.gallerySub}</p>
          </motion.div>

          <div
            className={`grid gap-5 sm:gap-6 ${
              item.images.length === 1
                ? 'grid-cols-1 max-w-xl mx-auto'
                : item.images.length === 6
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {item.images.map((img, i) => {
              const label = lang === 'zh' ? img.labelZh : lang === 'en' ? img.labelEn : img.labelEs;
              return (
                <motion.figure
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  onClick={() => setLightboxImg(img.src)}
                  className="bg-white rounded-[24px] overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-zoom-in group"
                >
                  <div className="aspect-square overflow-hidden bg-zinc-100 relative">
                    <img
                      src={img.src}
                      alt={label}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#09090B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </div>
                  </div>
                  <figcaption className="px-5 py-4 text-xs sm:text-sm font-semibold text-[#3F3F46]">
                    {label}
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. DARK CINEMA FILM SECTION */}
      {consumerVideo && (
        <section id="film" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#09090B] text-white">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55 }}
              className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
            >
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#EC4899]">
                {ui.filmKicker}
              </span>
              <h2
                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] mt-2"
                style={{ fontFamily: "'Syne', 'Manrope', sans-serif" }}
              >
                {ui.filmHeading}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-400 font-medium">{ui.filmSub}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.65)] bg-black"
            >
              <iframe
                src={consumerVideo.embedUrl}
                title={
                  lang === 'zh'
                    ? consumerVideo.titleZh
                    : lang === 'en'
                      ? consumerVideo.titleEn
                      : consumerVideo.titleEs
                }
                allow="autoplay; fullscreen"
                className="w-full aspect-video border-0"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* 5. ARCHITECTURAL FOOTER */}
      <footer className="py-10 px-4 sm:px-6 bg-[#FAFAFA] border-t border-zinc-200/80 text-center">
        <div
          className="text-xs font-bold tracking-[0.16em] uppercase text-[#09090B]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {ui.footerBrand}
        </div>
        <p className="text-xs text-zinc-500 mt-1.5 font-medium">{ui.footerTag}</p>
      </footer>
    </div>
  );
};
