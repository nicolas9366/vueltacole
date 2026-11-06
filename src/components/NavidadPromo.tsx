import React, { useState } from 'react';
import {
  CHRISTMAS_PRODUCTS,
  CLOUD_MEDIA_CONFIG,
  CONFIG_I18N,
  ChristmasProduct,
  Lang,
  getGdriveFallbackUrl,
  getGdriveImageUrl,
} from '../data/christmas2026DB';

interface NavidadPromoProps {
  lang: Lang;
  onNavigateHome: () => void;
}

type ZoomStage = {
  id: string;
  labelKey: 'zoomPreset1' | 'zoomPreset2' | 'zoomPreset3' | 'zoomPreset4';
  scale: number;
  originX: number; // %
  originY: number; // %
};

const ZOOM_STAGES: ZoomStage[] = [
  { id: 'full', labelKey: 'zoomPreset1', scale: 1.0, originX: 50, originY: 50 },
  { id: 'left', labelKey: 'zoomPreset2', scale: 1.85, originX: 20, originY: 55 },
  { id: 'center', labelKey: 'zoomPreset3', scale: 1.85, originX: 50, originY: 50 },
  { id: 'right', labelKey: 'zoomPreset4', scale: 2.05, originX: 84, originY: 48 },
];

export const NavidadPromo: React.FC<NavidadPromoProps> = ({ lang, onNavigateHome }) => {
  const t = CONFIG_I18N[lang];
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [videoPlatform, setVideoPlatform] = useState<'gdrive' | 'youtube' | 'tiktok' | 'instagram'>('gdrive');
  const [activeProduct, setActiveProduct] = useState<ChristmasProduct | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [zoomStage, setZoomStage] = useState<ZoomStage>(ZOOM_STAGES[0]);

  const filteredProducts = CHRISTMAS_PRODUCTS.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      p.code.toLowerCase().includes(q) ||
      p.nameZh.toLowerCase().includes(q) ||
      p.nameEs.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const openMagnifier = (prod: ChristmasProduct, imgIndex = 0) => {
    setActiveProduct(prod);
    setActiveImgIdx(imgIndex);
    setZoomStage(ZOOM_STAGES[1]); // Default to 1.85x zoom when user clicks "Zoom HD"
  };

  return (
    <div className="min-h-screen bg-[#0c261a] text-white font-['Fredoka',sans-serif] pb-20">
      {/* 1. SUBPAGE HERO BANNER */}
      <section className="relative overflow-hidden border-b-4 border-[#222] bg-gradient-to-br from-[#991b1b] via-[#b91c1c] to-[#14532d] py-10 px-4 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={onNavigateHome}
              className="px-5 py-2.5 bg-[#f8d878] text-[#222] font-black rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222] hover:translate-y-0.5 transition-all flex items-center gap-2 text-sm"
            >
              ← {t.navHome}
            </button>
            <span className="px-4 py-1.5 bg-[#222] text-[#f8d878] font-bold rounded-full border-2 border-[#f8d878] text-xs md:text-sm tracking-wide">
              {t.navidadHeroBadge}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_4px_0_#222] mb-3">
            {t.navidadHeroTitle}
          </h1>
          <p className="text-base md:text-xl text-yellow-100 font-semibold max-w-4xl">
            {t.navidadHeroSub}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-10">
        {/* 2. FIVE MAJOR PERKS BENTO BAR */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {t.perks.map((perk, idx) => {
            const bgColors = [
              'bg-[#165b38]',
              'bg-[#1d4ed8]',
              'bg-[#b45309]',
              'bg-[#be123c]',
              'bg-[#6d28d9]',
            ];
            return (
              <div
                key={idx}
                className={`${bgColors[idx % bgColors.length]} border-4 border-[#222] rounded-2xl p-4 shadow-[4px_4px_0px_#222] flex flex-col justify-between`}
              >
                <div className="text-lg font-black text-[#fde047] mb-1">{perk.title}</div>
                <div className="text-sm font-bold text-white leading-snug">{perk.desc}</div>
              </div>
            );
          })}
        </section>

        {/* 4. CLOUD VIDEO STREAM SECTION (YOUTUBE / TIKTOK / IG / GOOGLE DRIVE) */}
        <section className="bg-[#133826] border-4 border-[#f8d878] rounded-[2rem] p-6 md:p-8 shadow-[6px_6px_0px_#222]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#f8d878]">
                {t.videoSectionTitle}
              </h2>
              <p className="text-sm text-emerald-200 mt-1">{t.videoSectionSub}</p>
            </div>
            {/* Cloud Platform Switcher */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'gdrive', label: '☁️ Google Drive 直播' },
                { id: 'youtube', label: '▶️ YouTube Shorts' },
                { id: 'tiktok', label: '🎵 TikTok' },
                { id: 'instagram', label: '📸 Instagram Reels' },
              ].map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => setVideoPlatform(pl.id as any)}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm border-2 border-[#222] transition-all ${
                    videoPlatform === pl.id
                      ? 'bg-[#f8d878] text-[#222] shadow-[3px_3px_0px_#222]'
                      : 'bg-[#0c261a] text-white hover:bg-emerald-900'
                  }`}
                >
                  {pl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Vertical 9:16 Cloud Video Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[360px] aspect-[9/16] bg-black rounded-3xl border-4 border-[#f8d878] overflow-hidden shadow-2xl relative">
                {videoPlatform === 'gdrive' && (
                  <div className="w-full h-full relative bg-black flex flex-col">
                    <video
                      src={CLOUD_MEDIA_CONFIG.cloudStreamMp4Url}
                      poster={CLOUD_MEDIA_CONFIG.cloudPosterUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain bg-black"
                    />
                    <a
                      href={CLOUD_MEDIA_CONFIG.videoChannels.gdriveVideoFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute top-2 right-2 bg-black/75 hover:bg-black text-[#f8d878] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#f8d878]/50 backdrop-blur-sm"
                    >
                      ☁️ Google Drive 原片 ↗
                    </a>
                  </div>
                )}
                {videoPlatform !== 'gdrive' && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#1a1a2e] to-[#0f3460]">
                    <div className="text-5xl mb-4">
                      {videoPlatform === 'youtube' ? '▶️' : videoPlatform === 'tiktok' ? '🎵' : '📸'}
                    </div>
                    <h3 className="text-xl font-black text-[#f8d878] mb-2">
                      {videoPlatform.toUpperCase()} CLOUD STREAM
                    </h3>
                    <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                      {lang === 'zh'
                        ? '视频已按 SOP 托管至社交媒体云端，不占用网站服务器任何空间。点击下方按钮跳转官方频道或切换至 Google Drive 云盘直接播放。'
                        : 'El vídeo se aloja en la nube social según el modelo SOP para no ocupar espacio en el servidor web.'}
                    </p>
                    <a
                      href={
                        videoPlatform === 'youtube'
                          ? CLOUD_MEDIA_CONFIG.videoChannels.youtubeChannelUrl
                          : videoPlatform === 'tiktok'
                          ? CLOUD_MEDIA_CONFIG.videoChannels.tiktokProfileUrl
                          : CLOUD_MEDIA_CONFIG.videoChannels.instagramReelsUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 bg-[#e52521] text-white font-black rounded-xl border-3 border-[#222] shadow-[4px_4px_0px_#222] mb-3"
                    >
                      {lang === 'zh' ? '打开官方云端视频频道 ↗' : 'Abrir Canal Oficial ↗'}
                    </a>
                    <button
                      onClick={() => setVideoPlatform('gdrive')}
                      className="text-xs text-[#f8d878] underline font-bold"
                    >
                      {lang === 'zh' ? '切回 Google Drive 云盘内嵌播放' : 'Volver al reproductor Google Drive'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Cloud Architecture & Full Poster Preview from Google Drive */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#0c261a] border-3 border-[#f8d878]/60 rounded-2xl p-5">
                <div className="text-lg font-black text-[#f8d878] mb-2">
                  {t.cloudNoticeTitle}
                </div>
                <p className="text-sm text-gray-200 leading-relaxed mb-4">
                  {t.cloudNoticeDesc}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={CLOUD_MEDIA_CONFIG.gdriveFolderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#f8d878] text-[#222] font-black rounded-xl border-2 border-[#222] text-xs md:text-sm shadow-[3px_3px_0px_#222]"
                  >
                    📂 {lang === 'zh' ? '打开 Google 云盘原图与视频库' : 'Abrir Carpeta Google Drive HD'}
                  </a>
                  <a
                    href={getGdriveImageUrl(CLOUD_MEDIA_CONFIG.posterGdriveId, 1600)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#e52521] text-white font-black rounded-xl border-2 border-[#222] text-xs md:text-sm shadow-[3px_3px_0px_#222]"
                  >
                    🖼️ {lang === 'zh' ? '查看/下载 21款全景高清长图海报' : 'Descargar Póster Completo HD'}
                  </a>
                </div>
              </div>

              {/* Google Drive Hosted Full Poster Preview Card */}
              <div className="bg-white rounded-2xl p-3 border-4 border-[#222] shadow-[4px_4px_0px_#222]">
                <div className="text-xs font-black text-[#222] mb-2 flex items-center justify-between">
                  <span>📌 {lang === 'zh' ? '全景海报云端直连预览 (Google Drive CDN)' : 'Vista Previa Póster (Google Drive CDN)'}</span>
                  <span className="text-emerald-700">ID: {CLOUD_MEDIA_CONFIG.posterGdriveId.slice(0, 10)}...</span>
                </div>
                <div className="max-h-[340px] overflow-y-auto rounded-xl border-2 border-gray-200">
                  <img
                    src={getGdriveImageUrl(CLOUD_MEDIA_CONFIG.posterGdriveId, 1200)}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getGdriveFallbackUrl(
                        CLOUD_MEDIA_CONFIG.posterGdriveId,
                        1200
                      );
                    }}
                    alt="Main Paper Navidad 2026 Poster"
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FILTER & SEARCH BAR FOR 18 SKUs (21 PRODUCTS) */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#133826] p-4 rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222]">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: t.filterAll },
                { id: 'adviento', label: t.filterAdviento },
                { id: 'tarjetas', label: t.filterTarjetas },
                { id: 'diy', label: t.filterDiy },
                { id: 'papeleria', label: t.filterPapeleria },
                { id: 'regalos', label: t.filterRegalos },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-4 py-2 rounded-xl font-black text-xs md:text-sm border-2 border-[#222] transition-all ${
                    selectedCat === cat.id
                      ? 'bg-[#e52521] text-white shadow-[3px_3px_0px_#222]'
                      : 'bg-white text-[#222] hover:bg-yellow-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="w-full md:w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full px-4 py-2.5 rounded-xl bg-white text-[#222] font-bold border-3 border-[#222] text-sm focus:outline-none focus:ring-4 focus:ring-[#f8d878]"
              />
            </div>
          </div>

          {/* 6. 18-SKU GOOGLE DRIVE PHOTO GRID WITH ONE-CLICK MOBILE ZOOM */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#16422b] border-4 border-[#f8d878] rounded-3xl overflow-hidden shadow-[6px_6px_0px_#222] flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  {/* Original Untouched Product Card from Google Drive CDN */}
                  <div
                    onClick={() => openMagnifier(prod, 0)}
                    className="bg-white p-3 relative cursor-zoom-in border-b-4 border-[#222] group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-[#222] text-[#f8d878] font-black text-sm rounded-lg border border-[#f8d878]">
                        {prod.code}
                      </span>
                      <span className="px-2.5 py-1 bg-[#e52521] text-white font-black text-xs rounded-lg">
                        {lang === 'zh' ? '圣诞精选' : 'Especial Navidad'}
                      </span>
                    </div>

                    <div className="h-52 flex items-center justify-center overflow-hidden">
                      <img
                        src={getGdriveImageUrl(prod.gdriveIds[0], 900)}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = getGdriveFallbackUrl(
                            prod.gdriveIds[0],
                            900
                          );
                        }}
                        alt={prod.code}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Variant thumbnails if SKU has 2 or 3 models */}
                    {prod.gdriveIds.length > 1 && (
                      <div className="flex justify-center gap-2 mt-2">
                        {prod.gdriveIds.map((gid, vIdx) => (
                          <button
                            key={gid}
                            onClick={(e) => {
                              e.stopPropagation();
                              openMagnifier(prod, vIdx);
                            }}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-[#f8d878] text-[#222] font-black text-xs rounded-md border border-[#222]"
                          >
                            {lang === 'zh' ? `查看款 ${vIdx + 1}` : `Modelo ${vIdx + 1}`}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 text-center">
                      <span className="inline-block w-full py-1.5 bg-[#f8d878] text-[#222] font-black text-xs rounded-lg border-2 border-[#222] shadow-[2px_2px_0px_#222]">
                        {t.zoomBtnLabel}
                      </span>
                    </div>
                  </div>

                  {/* Product Info & Beijing Pitch */}
                  <div className="p-5">
                    <h3 className="text-xl font-black text-white mb-1">
                      {lang === 'zh' ? prod.nameZh : prod.nameEs}
                    </h3>
                    <p className="text-xs text-emerald-200 font-semibold mb-3">
                      {lang === 'zh' ? prod.nameEs : prod.nameZh}
                    </p>
                    <p className="text-xs text-gray-200 bg-[#0c261a] p-3 rounded-xl border border-emerald-700 leading-relaxed">
                      🎙️ {lang === 'zh' ? prod.beijingPitchZh : prod.descEs}
                    </p>
                  </div>
                </div>

                {/* Pack/Box Spec & Stock Footer (NO PRICES) */}
                <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-emerald-800/80">
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-[#0c261a] text-emerald-300 font-bold text-xs rounded-lg border border-emerald-700">
                      Ref: {prod.code}
                    </span>
                    <div className="text-[11px] text-gray-300 mt-1">
                      {lang === 'zh' ? '样品专区 · 现货直发' : 'Exposición · Stock'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1.5 bg-[#0c261a] text-[#f8d878] font-black text-xs rounded-xl border-2 border-[#f8d878]">
                      {prod.spec}
                    </span>
                    <div className="text-[11px] text-emerald-300 mt-1">
                      Stock: {prod.stock} uds
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 7. INTERACTIVE MOBILE HD DETAIL MAGNIFIER MODAL (3-STAGE ZOOM + PIP RADAR) */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="bg-[#133826] border-4 border-[#f8d878] rounded-3xl max-w-4xl w-full p-4 md:p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <span className="px-3 py-1 bg-[#e52521] text-white font-black text-sm rounded-lg mr-2">
                  {activeProduct.code}
                </span>
                <span className="text-lg md:text-2xl font-black text-white">
                  {lang === 'zh' ? activeProduct.nameZh : activeProduct.nameEs}
                </span>
              </div>
              <button
                onClick={() => setActiveProduct(null)}
                className="w-10 h-10 rounded-xl bg-[#e52521] text-white font-black border-2 border-[#222] text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs md:text-sm text-[#f8d878] mb-3 font-semibold">
              {t.zoomModalTip}
            </p>

            {/* 4 Preset Camera Zoom Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {ZOOM_STAGES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setZoomStage(st)}
                  className={`py-2.5 px-3 rounded-xl font-black text-xs md:text-sm border-2 border-[#222] transition-all ${
                    zoomStage.id === st.id
                      ? 'bg-[#f8d878] text-[#222] shadow-[3px_3px_0px_#222]'
                      : 'bg-[#0c261a] text-white hover:bg-emerald-800'
                  }`}
                >
                  {t[st.labelKey]}
                </button>
              ))}
            </div>

            {/* Variant selector if multiple images */}
            {activeProduct.gdriveIds.length > 1 && (
              <div className="flex gap-2 mb-3">
                {activeProduct.gdriveIds.map((gid, idx) => (
                  <button
                    key={gid}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`px-3 py-1 rounded-lg font-black text-xs border-2 border-[#222] ${
                      activeImgIdx === idx ? 'bg-[#e52521] text-white' : 'bg-white text-[#222]'
                    }`}
                  >
                    {lang === 'zh' ? `切换款式 ${idx + 1}` : `Modelo ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

            {/* Main Zoom Viewport with Smooth CSS Transform & Bottom-Left PiP Radar */}
            <div className="relative bg-white rounded-2xl border-4 border-[#222] h-[360px] md:h-[460px] overflow-hidden flex items-center justify-center">
              <img
                src={getGdriveImageUrl(activeProduct.gdriveIds[activeImgIdx], 1600)}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getGdriveFallbackUrl(
                    activeProduct.gdriveIds[activeImgIdx],
                    1600
                  );
                }}
                alt={activeProduct.code}
                style={{
                  transform: `scale(${zoomStage.scale})`,
                  transformOrigin: `${zoomStage.originX}% ${zoomStage.originY}%`,
                }}
                className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out"
              />

              {/* Picture-in-Picture (PiP) Mini Radar Viewfinder */}
              {zoomStage.scale > 1.1 && (
                <div className="absolute bottom-3 left-3 w-32 md:w-40 bg-white border-3 border-[#222] rounded-lg p-1 shadow-xl">
                  <img
                    src={getGdriveImageUrl(activeProduct.gdriveIds[activeImgIdx], 400)}
                    alt="radar"
                    className="w-full h-auto block"
                  />
                  <div
                    className="absolute border-2 border-[#e52521] bg-[#e52521]/15 pointer-events-none transition-all duration-500"
                    style={{
                      width: '48%',
                      height: '52%',
                      left: `${Math.max(4, Math.min(48, zoomStage.originX - 24))}%`,
                      top: `${Math.max(4, Math.min(44, zoomStage.originY - 26))}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="font-black text-[#f8d878] text-base flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 font-mono text-xs rounded-lg border border-emerald-700">
                  Ref: {activeProduct.code}
                </span>
                <span className="text-xs text-gray-300 font-normal">
                  {activeProduct.spec} · Stock: {activeProduct.stock} uds
                </span>
              </div>
              <div className="text-xs text-emerald-200">
                🎙️ {lang === 'zh' ? activeProduct.beijingPitchZh : activeProduct.descEs}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
