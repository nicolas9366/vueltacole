import React, { useMemo } from 'react';
import { DAILY_VITRINA_ITEMS, DailyVitrinaEntry } from '../data/dailyVitrinaDB';
import { Lang } from '../data/christmas2026DB';

interface AppleShowcaseProps {
  lang: Lang;
  onSetLang?: (l: Lang) => void;
}

const APPLE_UI: Record<
  Lang,
  {
    overview: string;
    gallery: string;
    film: string;
    heroEyebrow: string;
    galleryHeading: string;
    gallerySub: string;
    filmHeading: string;
    filmSub: string;
    footerNote: string;
  }
> = {
  zh: {
    overview: '概览',
    gallery: '效果展示',
    film: '宣传短片',
    heroEyebrow: 'MP* STYLE 精选系列',
    galleryHeading: '每一处细节，真实呈现。',
    gallerySub: '多场景实效呈现，色彩饱和度与材质附着力一目了然。',
    filmHeading: '动态演示。',
    filmSub: '真实使用场景与质感近景，一镜看懂核心体验。',
    footerNote: 'MP* STYLE · 专注日常创作与专业书写体验',
  },
  en: {
    overview: 'Overview',
    gallery: 'Gallery',
    film: 'Film',
    heroEyebrow: 'MP* STYLE COLLECTION',
    galleryHeading: 'Every detail, clearly revealed.',
    gallerySub: 'Designed for vivid expression across paper, studio, and everyday surfaces.',
    filmHeading: 'In motion.',
    filmSub: 'See the color payoff, precision, and everyday versatility in action.',
    footerNote: 'MP* STYLE · Crafted for everyday creativity and precision',
  },
  es: {
    overview: 'Resumen',
    gallery: 'Galería',
    film: 'Vídeo',
    heroEyebrow: 'COLECCIÓN MP* STYLE',
    galleryHeading: 'Cada detalle, al descubierto.',
    gallerySub: 'Pensado para ofrecer color intenso, precisión y un acabado impecable en cualquier superficie.',
    filmHeading: 'En movimiento.',
    filmSub: 'Descubre su fluidez, cobertura y resultado real en uso.',
    footerNote: 'MP* STYLE · Diseño y color para crear cada día',
  },
};

export const AppleShowcase: React.FC<AppleShowcaseProps> = ({ lang, onSetLang }) => {
  const ui = APPLE_UI[lang];

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

  // Prefer the B2C consumer video on the customer-facing Apple showcase page
  const consumerVideo = item.videos[item.videos.length - 1] || item.videos[0];
  const heroPhoto = item.images[2]?.src || item.images[0]?.src || item.heroImage;

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Helvetica_Neue',sans-serif] antialiased selection:bg-blue-100">
      {/* Apple-style Minimal Sticky Product Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-[#d2d2d7]/60">
        <div className="max-w-5xl mx-auto px-5 h-12 flex items-center justify-between">
          <div className="font-semibold text-sm md:text-base tracking-tight text-[#1d1d1f] truncate">
            {item.sku.split('/')[0].trim()} · {title}
          </div>
          <div className="flex items-center gap-5 text-xs text-[#1d1d1f]/80">
            <a href="#overview" className="hidden sm:inline hover:text-[#1d1d1f] transition-colors">
              {ui.overview}
            </a>
            <a href="#gallery" className="hidden sm:inline hover:text-[#1d1d1f] transition-colors">
              {ui.gallery}
            </a>
            {consumerVideo && (
              <a href="#film" className="hidden sm:inline hover:text-[#1d1d1f] transition-colors">
                {ui.film}
              </a>
            )}
            {onSetLang && (
              <div className="flex items-center gap-1 bg-[#f5f5f7] rounded-full p-0.5 text-[11px] font-medium">
                {(['zh', 'en', 'es'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => onSetLang(l)}
                    className={`px-2 py-0.5 rounded-full transition-all ${
                      lang === l ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold' : 'text-[#6e6e73]'
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

      {/* Hero Section */}
      <section id="overview" className="pt-16 pb-14 px-5 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">
            {ui.heroEyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08]">
            {title}
          </h1>
          <p className="mt-5 text-lg md:text-2xl text-[#6e6e73] font-normal max-w-2xl mx-auto leading-relaxed">
            {tagline}
          </p>

          <div className="mt-12 rounded-[28px] overflow-hidden bg-[#f5f5f7] shadow-[0_24px_60px_rgba(0,0,0,0.08)] max-w-3xl mx-auto">
            <img
              src={heroPhoto}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Apple Bento Feature Highlights */}
      <section className="py-16 px-5 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {highlights.map((hl, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[24px] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between"
              >
                <span className="text-xs font-semibold tracking-wider text-[#0066cc] mb-3">
                  0{idx + 1}
                </span>
                <p className="text-base md:text-lg font-medium text-[#1d1d1f] leading-snug">
                  {hl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Gallery */}
      <section id="gallery" className="py-20 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
              {ui.galleryHeading}
            </h2>
            <p className="mt-3 text-base md:text-lg text-[#6e6e73]">{ui.gallerySub}</p>
          </div>

          <div
            className={`grid gap-6 ${
              item.images.length === 1
                ? 'grid-cols-1 max-w-xl mx-auto'
                : item.images.length === 6
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {item.images.map((img, i) => {
              const label = lang === 'zh' ? img.labelZh : lang === 'en' ? img.labelEn : img.labelEs;
              return (
                <figure
                  key={i}
                  className="bg-[#f5f5f7] rounded-[24px] overflow-hidden group transition-transform duration-300 hover:scale-[1.01]"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={img.src}
                      alt={label}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="px-5 py-3.5 text-xs md:text-sm font-medium text-[#6e6e73]">
                    {label}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dark Cinema Film Section */}
      {consumerVideo && (
        <section id="film" className="py-20 px-5 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{ui.filmHeading}</h2>
            <p className="mt-3 text-base md:text-lg text-[#a1a1a6] max-w-xl mx-auto">{ui.filmSub}</p>

            <div className="mt-10 rounded-[24px] overflow-hidden border border-white/10 shadow-2xl bg-[#111]">
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
            </div>
          </div>
        </section>
      )}

      {/* Minimal Footer */}
      <footer className="py-10 px-5 bg-[#f5f5f7] border-t border-[#d2d2d7]/60 text-center text-xs text-[#6e6e73]">
        {ui.footerNote}
      </footer>
    </div>
  );
};
