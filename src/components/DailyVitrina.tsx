import React, { useEffect, useState } from 'react';
import { DAILY_VITRINA_ITEMS, DailyVitrinaEntry } from '../data/dailyVitrinaDB';
import { Lang } from '../data/christmas2026DB';

interface DailyVitrinaProps {
  lang: Lang;
  onNavigateHome: () => void;
}

const UI_TEXT: Record<
  Lang,
  {
    badge: string;
    title: string;
    subtitle: string;
    copyLink: string;
    linkCopied: string;
    backHome: string;
    galleryTitle: string;
    galleryHint: string;
    videosTitle: string;
    videoDownload: string;
    shareTitle: string;
    shareHint: string;
    copyBtn: string;
    copiedMsg: string;
    manualCopyMsg: string;
    nativeShareBtn: string;
    nativeSharedMsg: string;
    downloadShareMsg: string;
    socialHint: string;
    igTip: string;
    tiktokTip: string;
  }
> = {
  zh: {
    badge: '每日热卖严选 · VITRINA DIARIA',
    title: '每日热卖主推馆 · 效果图与短剧中心',
    subtitle: '每日精选高走量非品牌核心单品，云端高清图库、双语宣传短剧与社媒一键转发话术。',
    copyLink: '复制本页推广链接',
    linkCopied: '已复制本页链接',
    backHome: '返回主站',
    galleryTitle: '产品视觉效果图（云端图库 · 点击放大）',
    galleryHint: '纯画面无叠加字，点击右下角可保存原图',
    videosTitle: '配套宣传短剧视频（云端流媒体 · 在线播放 / 下载）',
    videoDownload: '下载 MP4',
    shareTitle: '一键分享话术与社媒直发',
    shareHint: '可自由修改文案后一键复制到微信或海外社媒',
    copyBtn: '复制文案',
    copiedMsg: '已复制推广文案',
    manualCopyMsg: '请长按文本框手动复制',
    nativeShareBtn: '带图分享微信',
    nativeSharedMsg: '文案已复制，请在微信粘贴发布',
    downloadShareMsg: '文案已复制并保存配图，可直接发朋友圈',
    socialHint: '支持一键发往海外社媒或手机系统原生分享面板：',
    igTip: '文案已复制，已为您打开图片/分享面板，选择 Instagram 即可发布',
    tiktokTip: '文案已复制，选择 TikTok 或下载视频后即可直接上传发布',
  },
  en: {
    badge: 'DAILY HOT PICK · VITRINA DIARIA',
    title: 'Daily Bestsellers · Visuals & Video Hub',
    subtitle: 'Daily high-turnover stationery picks with cloud-hosted studio visuals, short promo videos, and 1-click social sharing.',
    copyLink: 'Copy Page Link',
    linkCopied: 'Page link copied!',
    backHome: 'Back Home',
    galleryTitle: 'Product Visual Gallery (Cloud CDN · Tap to Zoom)',
    galleryHint: 'Clean text-free images ready for social posts',
    videosTitle: 'Promo Short Videos (Cloud Stream & Download)',
    videoDownload: 'Download MP4',
    shareTitle: 'Ready-to-Share Social Caption',
    shareHint: 'Edit caption freely and share in one tap',
    copyBtn: 'Copy Text',
    copiedMsg: 'Caption copied!',
    manualCopyMsg: 'Please copy text manually from box',
    nativeShareBtn: 'Share Image + Text',
    nativeSharedMsg: 'Caption copied! Paste in your app to post.',
    downloadShareMsg: 'Caption copied and image downloaded for posting!',
    socialHint: 'Share directly to social platforms:',
    igTip: 'Caption copied! Pick Instagram in the share sheet or upload the downloaded image.',
    tiktokTip: 'Caption copied! Pick TikTok in the share sheet or upload the MP4 video.',
  },
  es: {
    badge: 'SELECCIÓN DIARIA · VITRINA DIARIA',
    title: 'Vitrina Diaria · Galería y Vídeos Top Ventas',
    subtitle: 'Productos estrella seleccionados cada día con imágenes limpias en la nube, vídeos cortos y textos listos para redes sociales.',
    copyLink: 'Copiar Enlace',
    linkCopied: '¡Enlace copiado!',
    backHome: 'Inicio',
    galleryTitle: 'Galería Visual del Producto (Clic para ampliar)',
    galleryHint: 'Imágenes limpias en la nube listas para publicar',
    videosTitle: 'Vídeos Promocionales (Reproducción en la nube y descarga)',
    videoDownload: 'Descargar MP4',
    shareTitle: 'Texto Listo para Compartir en Redes',
    shareHint: 'Edita el mensaje si lo deseas y compártelo al instante',
    copyBtn: 'Copiar Texto',
    copiedMsg: '¡Texto copiado!',
    manualCopyMsg: 'Copia el texto manualmente desde el cuadro',
    nativeShareBtn: 'Compartir Imagen + Texto',
    nativeSharedMsg: '¡Texto copiado! Pégalo al publicar.',
    downloadShareMsg: '¡Texto copiado e imagen descargada para publicar!',
    socialHint: 'Comparte directamente en tus redes sociales:',
    igTip: '¡Texto copiado! Elige Instagram en el menú compartir o sube la imagen descargada.',
    tiktokTip: '¡Texto copiado! Elige TikTok en el menú compartir o sube el vídeo MP4.',
  },
};

export const DailyVitrina: React.FC<DailyVitrinaProps> = ({ lang, onNavigateHome }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const item: DailyVitrinaEntry = DAILY_VITRINA_ITEMS[selectedIdx] || DAILY_VITRINA_ITEMS[0];
  const ui = UI_TEXT[lang];

  const getLocalizedShare = (entry: DailyVitrinaEntry, l: Lang) =>
    l === 'zh' ? entry.shareTextZh : l === 'en' ? entry.shareTextEn : entry.shareTextEs;

  const [shareText, setShareText] = useState(() => getLocalizedShare(item, lang));
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');

  useEffect(() => {
    setShareText(getLocalizedShare(item, lang));
  }, [lang, selectedIdx, item]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  const handleCopy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`✅ ${msg}`);
    } catch {
      showToast(`⚠️ ${ui.manualCopyMsg}`);
    }
  };

  const handleNativeShare = async (platformTip?: string) => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // ignore clipboard fallback
    }
    if (navigator.share) {
      try {
        const resp = await fetch(item.heroImage);
        const blob = await resp.blob();
        const file = new File([blob], `${item.id}.jpg`, { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: lang === 'zh' ? item.titleZh : lang === 'en' ? item.titleEn : item.titleEs,
            text: shareText,
            files: [file],
          });
          showToast(`✅ ${platformTip || ui.nativeSharedMsg}`);
          return;
        }
        await navigator.share({
          title: lang === 'zh' ? item.titleZh : lang === 'en' ? item.titleEn : item.titleEs,
          text: shareText,
          url: pageShareUrl,
        });
        showToast(`✅ ${platformTip || ui.nativeSharedMsg}`);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    const a = document.createElement('a');
    a.href = item.heroImage;
    a.download = `${item.id}.jpg`;
    a.click();
    showToast(`✅ ${platformTip || ui.downloadShareMsg}`);
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageShareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const pageShareUrl = 'https://vueltacole.com/vitrina.html';
  const title = lang === 'zh' ? item.titleZh : lang === 'en' ? item.titleEn : item.titleEs;
  const tagline = lang === 'zh' ? item.taglineZh : lang === 'en' ? item.taglineEn : item.taglineEs;
  const packInfo = lang === 'zh' ? item.packInfoZh : lang === 'en' ? item.packInfoEn : item.packInfoEs;
  const highlights = lang === 'zh' ? item.highlightsZh : lang === 'en' ? item.highlightsEn : item.highlightsEs;

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#222] pb-16">
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#111827] text-[#f8d878] border-2 border-[#f8d878] px-5 py-2.5 rounded-xl font-black text-sm shadow-2xl max-w-[90vw] text-center">
          {toastMsg}
        </div>
      )}

      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={lightboxImg}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-2xl border-4 border-[#f8d878] shadow-2xl"
          />
        </div>
      )}

      {/* Hero Banner */}
      <section className="bg-[#111827] text-white border-b-4 border-[#222] px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#e52521] text-white text-xs font-black px-3 py-1 rounded-full border-2 border-[#f8d878] mb-3">
              <span>🔥</span>
              <span>{ui.badge}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#f8d878]">
              {ui.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl">
              {ui.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCopy(pageShareUrl, ui.linkCopied)}
              className="px-4 py-2.5 rounded-xl bg-[#f8d878] text-[#222] font-black text-xs md:text-sm border-2 border-[#222] shadow-[3px_3px_0px_#e52521] hover:translate-y-[-1px] transition-all"
            >
              🔗 {ui.copyLink}
            </button>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-black text-xs md:text-sm border-2 border-slate-600 hover:bg-slate-700 transition-all"
            >
              🏠 {ui.backHome}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        {/* Date Tabs */}
        {DAILY_VITRINA_ITEMS.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {DAILY_VITRINA_ITEMS.map((entry, idx) => (
              <button
                key={entry.id}
                onClick={() => setSelectedIdx(idx)}
                className={`px-4 py-2 rounded-xl font-black text-xs border-2 border-[#222] ${
                  idx === selectedIdx
                    ? 'bg-[#e52521] text-white shadow-[3px_3px_0px_#222]'
                    : 'bg-white text-[#222] hover:bg-yellow-50'
                }`}
              >
                📅 {entry.date} · {entry.sku.split('/')[0].trim()}
              </button>
            ))}
          </div>
        )}

        {/* Featured Product Header Card */}
        <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-[#5c94fc] text-white text-xs font-black px-3 py-1 rounded-lg border-2 border-[#222]">
              📅 {item.date}
            </span>
            <span className="bg-[#f8d878] text-[#222] text-xs font-black px-3 py-1 rounded-lg border-2 border-[#222]">
              SKU: {item.sku}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-lg border-2 border-gray-300">
              EAN: {item.ean}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-[#111827]">{title}</h2>
          <p className="text-sm md:text-base font-bold text-[#e52521] mt-1">{tagline}</p>
          <div className="mt-3 text-xs md:text-sm bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-2.5 font-bold text-amber-950">
            📦 {packInfo}
          </div>

          <ul className="mt-4 grid md:grid-cols-3 gap-3">
            {highlights.map((hl, i) => (
              <li
                key={i}
                className="bg-[#fcf8f2] border-2 border-[#222] rounded-xl p-3 text-xs md:text-sm font-bold flex items-start gap-2"
              >
                <span className="text-[#e52521] font-black">★</span>
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual Gallery (Cloud CDN) */}
        <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <h3 className="text-xl font-black flex items-center gap-2">
              <span>🖼️</span>
              <span>{ui.galleryTitle}</span>
            </h3>
            <span className="text-xs font-bold text-gray-500">{ui.galleryHint}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {item.images.map((img, i) => {
              const label = lang === 'zh' ? img.labelZh : lang === 'en' ? img.labelEn : img.labelEs;
              return (
                <div
                  key={i}
                  className="group bg-[#fcf8f2] rounded-2xl border-2 border-[#222] overflow-hidden shadow-[3px_3px_0px_#222] flex flex-col"
                >
                  <div
                    onClick={() => setLightboxImg(img.src)}
                    className="aspect-square overflow-hidden cursor-zoom-in bg-white"
                  >
                    <img
                      src={img.src}
                      alt={label}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5 flex items-center justify-between gap-2 border-t-2 border-[#222]">
                    <span className="text-xs font-bold truncate">{label}</span>
                    <a
                      href={img.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-black px-2 py-1 rounded-lg bg-[#f8d878] border border-[#222] hover:bg-yellow-300"
                    >
                      ⬇️
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cloud Video Streaming Players */}
        <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] p-6 md:p-8">
          <h3 className="text-xl font-black flex items-center gap-2 mb-5">
            <span>🎬</span>
            <span>{ui.videosTitle}</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {item.videos.map((vid, i) => {
              const vTitle = lang === 'zh' ? vid.titleZh : lang === 'en' ? vid.titleEn : vid.titleEs;
              const vTag = lang === 'zh' ? vid.tagZh : lang === 'en' ? vid.tagEn : vid.tagEs;
              return (
                <div
                  key={i}
                  className="bg-[#111827] text-white rounded-2xl border-2 border-[#222] overflow-hidden shadow-[4px_4px_0px_#222]"
                >
                  <div className="px-4 py-3 flex items-center justify-between gap-2 border-b border-gray-700">
                    <div className="min-w-0">
                      <span className="inline-block bg-[#e52521] text-white text-[11px] font-black px-2 py-0.5 rounded mr-2">
                        {vTag}
                      </span>
                      <span className="font-black text-sm">{vTitle}</span>
                    </div>
                    <a
                      href={vid.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-black bg-[#f8d878] text-[#222] px-2.5 py-1 rounded-lg hover:bg-yellow-300"
                    >
                      ⬇️ {ui.videoDownload}
                    </a>
                  </div>
                  <iframe
                    src={vid.embedUrl}
                    title={vTitle}
                    allow="autoplay; fullscreen"
                    className="w-full aspect-video bg-black border-0"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* One-Click Social Sharing Hub */}
        <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#5c94fc] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-xl font-black">🚀 {ui.shareTitle}</h3>
            <span className="text-xs font-bold text-gray-500">{ui.shareHint}</span>
          </div>

          <textarea
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            rows={7}
            className="w-full rounded-xl border-2 border-[#222] bg-[#fcf8f2] p-3.5 text-xs md:text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
          />

          <div className="mt-4 text-xs font-bold text-gray-600">{ui.socialHint}</div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-3">
            <button
              onClick={() => handleCopy(shareText, ui.copiedMsg)}
              className="py-2.5 px-3 rounded-xl font-black text-xs border-2 border-[#222] bg-gray-100 hover:bg-gray-200"
            >
              📋 {ui.copyBtn}
            </button>

            <button
              onClick={() => handleNativeShare(ui.igTip)}
              className="py-2.5 px-3 rounded-xl font-black text-xs border-2 border-[#222] bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-[2px_2px_0px_#222] hover:opacity-95"
            >
              📸 Instagram
            </button>

            <button
              onClick={handleShareX}
              className="py-2.5 px-3 rounded-xl font-black text-xs border-2 border-[#222] bg-black text-white shadow-[2px_2px_0px_#222] hover:bg-neutral-800"
            >
              𝕏 X / Twitter
            </button>

            <button
              onClick={handleShareFacebook}
              className="py-2.5 px-3 rounded-xl font-black text-xs border-2 border-[#222] bg-[#1877F2] text-white shadow-[2px_2px_0px_#222] hover:bg-blue-600"
            >
              📘 Facebook
            </button>

            <button
              onClick={() => handleNativeShare(ui.tiktokTip)}
              className="py-2.5 px-3 rounded-xl font-black text-xs border-2 border-[#222] bg-[#111827] text-[#25F4EE] shadow-[2px_2px_0px_#FE2C55] hover:opacity-95"
            >
              🎵 TikTok
            </button>

            {lang === 'zh' ? (
              <button
                onClick={() => handleNativeShare()}
                className="py-2.5 px-3 rounded-xl font-black text-xs border-2 border-[#222] bg-[#07C160] text-white shadow-[2px_2px_0px_#222] hover:bg-emerald-600"
              >
                💬 {ui.nativeShareBtn}
              </button>
            ) : (
              <button
                onClick={handleShareWhatsApp}
                className="py-2.5 px-3 rounded-xl font-black text-xs border-2 border-[#222] bg-[#25D366] text-white shadow-[2px_2px_0px_#222] hover:bg-emerald-600"
              >
                💬 WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
