import React, { useState } from 'react';
import { DAILY_VITRINA_ITEMS, DailyVitrinaEntry } from '../data/dailyVitrinaDB';
import { Lang } from '../data/christmas2026DB';

interface DailyVitrinaProps {
  lang: Lang;
  onNavigateHome: () => void;
}

export const DailyVitrina: React.FC<DailyVitrinaProps> = ({ lang, onNavigateHome }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const item: DailyVitrinaEntry = DAILY_VITRINA_ITEMS[selectedIdx] || DAILY_VITRINA_ITEMS[0];

  const [b2bText, setB2bText] = useState(item.shareTextB2B);
  const [b2cText, setB2cText] = useState(item.shareTextB2C);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2600);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`✅ ${label}`);
    } catch {
      showToast('⚠️ 请长按文本框手动复制');
    }
  };

  const handleShareWithImage = async (text: string, imageUrl: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard fallback
    }
    if (navigator.share) {
      try {
        const resp = await fetch(imageUrl);
        const blob = await resp.blob();
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: lang === 'zh' ? item.titleZh : item.titleEs,
            text,
            files: [file],
          });
          showToast('✅ 文案已复制，请在微信粘贴发布');
          return;
        }
        await navigator.share({
          title: lang === 'zh' ? item.titleZh : item.titleEs,
          text,
          url: window.location.href,
        });
        showToast('✅ 已呼出系统分享面板');
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = fileName;
    a.click();
    showToast('✅ 文案已复制并下载主图，可直接发朋友圈');
  };

  const pageShareUrl = 'https://vueltacole.com/vitrina.html';

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#222] pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#111827] text-[#f8d878] border-2 border-[#f8d878] px-5 py-2.5 rounded-xl font-black text-sm shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* Lightbox Modal */}
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
              <span>{lang === 'zh' ? '每日热卖严选 · VITRINA DIARIA' : 'VITRINA DIARIA · TOP VENTAS'}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#f8d878]">
              {lang === 'zh' ? '每日热卖主推馆 · 效果图与短剧中心' : 'Vitrina Diaria · Imágenes y Vídeos Comerciales'}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl">
              {lang === 'zh'
                ? '每日精选高走量非品牌核心单品，配套高清场景效果图、双语宣传短剧与朋友圈一键转发话术。'
                : 'Selección diaria de productos estrella con galería visual, vídeos cortos y textos listos para compartir.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCopy(pageShareUrl, lang === 'zh' ? '已复制本页链接' : 'Enlace copiado')}
              className="px-4 py-2.5 rounded-xl bg-[#f8d878] text-[#222] font-black text-xs md:text-sm border-2 border-[#222] shadow-[3px_3px_0px_#e52521] hover:translate-y-[-1px] transition-all"
            >
              🔗 {lang === 'zh' ? '复制本页推广链接' : 'Copiar enlace'}
            </button>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-black text-xs md:text-sm border-2 border-slate-600 hover:bg-slate-700 transition-all"
            >
              🏠 {lang === 'zh' ? '返回主站' : 'Inicio'}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        {/* Date Tabs if multiple entries */}
        {DAILY_VITRINA_ITEMS.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {DAILY_VITRINA_ITEMS.map((entry, idx) => (
              <button
                key={entry.id}
                onClick={() => {
                  setSelectedIdx(idx);
                  setB2bText(entry.shareTextB2B);
                  setB2cText(entry.shareTextB2C);
                }}
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

          <h2 className="text-2xl md:text-3xl font-black text-[#111827]">
            {lang === 'zh' ? item.titleZh : item.titleEs}
          </h2>
          <p className="text-sm md:text-base font-bold text-[#e52521] mt-1">
            {lang === 'zh' ? item.taglineZh : item.taglineEs}
          </p>
          <div className="mt-3 text-xs md:text-sm bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-2.5 font-bold text-amber-950">
            📦 {item.packInfo}
          </div>

          <ul className="mt-4 grid md:grid-cols-3 gap-3">
            {(lang === 'zh' ? item.highlightsZh : item.highlightsEs).map((hl, i) => (
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

        {/* Visual Gallery (Clean Text-Free Images) */}
        <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <h3 className="text-xl font-black flex items-center gap-2">
              <span>🖼️</span>
              <span>{lang === 'zh' ? '产品视觉效果图（点击查看大图）' : 'Galería Visual (Clic para ampliar)'}</span>
            </h3>
            <span className="text-xs font-bold text-gray-500">
              {lang === 'zh' ? '纯画面无叠加字，可直接转发保存' : 'Imágenes limpias listas para compartir'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {item.images.map((img, i) => (
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
                    alt={lang === 'zh' ? img.labelZh : img.labelEs}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5 flex items-center justify-between gap-2 border-t-2 border-[#222]">
                  <span className="text-xs font-bold truncate">
                    {lang === 'zh' ? img.labelZh : img.labelEs}
                  </span>
                  <a
                    href={img.src}
                    download
                    className="shrink-0 text-xs font-black px-2 py-1 rounded-lg bg-[#f8d878] border border-[#222] hover:bg-yellow-300"
                  >
                    ⬇️
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Short Drama Videos */}
        <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#222] p-6 md:p-8">
          <h3 className="text-xl font-black flex items-center gap-2 mb-5">
            <span>🎬</span>
            <span>{lang === 'zh' ? '配套宣传短剧视频（在线播放 / 下载）' : 'Vídeos Promocionales'}</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {item.videos.map((vid, i) => (
              <div
                key={i}
                className="bg-[#111827] text-white rounded-2xl border-3 border-[#222] overflow-hidden shadow-[4px_4px_0px_#222]"
              >
                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-700">
                  <div>
                    <span className="inline-block bg-[#e52521] text-white text-[11px] font-black px-2 py-0.5 rounded mr-2">
                      {lang === 'zh' ? vid.tagZh : vid.tagEs}
                    </span>
                    <span className="font-black text-sm">
                      {lang === 'zh' ? vid.titleZh : vid.titleEs}
                    </span>
                  </div>
                  <a
                    href={vid.src}
                    download
                    className="text-xs font-black bg-[#f8d878] text-[#222] px-2.5 py-1 rounded-lg hover:bg-yellow-300"
                  >
                    ⬇️ MP4
                  </a>
                </div>
                <video
                  src={vid.src}
                  poster={vid.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full aspect-video bg-black"
                />
              </div>
            ))}
          </div>
        </div>

        {/* One-Click Share Scripts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* B2B Chinese Bazar Script */}
          <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#e52521] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-black">🇨🇳 百元店老板推销话术</h3>
              <span className="text-xs font-bold text-gray-500">可编辑后一键转发</span>
            </div>
            <textarea
              value={b2bText}
              onChange={(e) => setB2bText(e.target.value)}
              rows={8}
              className="w-full rounded-xl border-2 border-[#222] bg-[#fcf8f2] p-3 text-xs md:text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#e52521]"
            />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleCopy(b2bText, '已复制中文推销话术')}
                className="py-2.5 px-3 rounded-xl font-black text-xs md:text-sm border-2 border-[#222] bg-gray-100 hover:bg-gray-200"
              >
                📋 复制话术
              </button>
              <button
                onClick={() => handleShareWithImage(b2bText, item.heroImage, `${item.id}_share.jpg`)}
                className="py-2.5 px-3 rounded-xl font-black text-xs md:text-sm border-2 border-[#222] bg-[#e52521] text-white shadow-[2px_2px_0px_#222] hover:bg-red-600"
              >
                🚀 一键带图分享微信
              </button>
            </div>
          </div>

          {/* B2C Spanish Script */}
          <div className="bg-white rounded-3xl border-4 border-[#222] shadow-[6px_6px_0px_#5c94fc] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-black">🇪🇸 西语消费种草话术</h3>
              <span className="text-xs font-bold text-gray-500">WhatsApp / Redes</span>
            </div>
            <textarea
              value={b2cText}
              onChange={(e) => setB2cText(e.target.value)}
              rows={8}
              className="w-full rounded-xl border-2 border-[#222] bg-[#fcf8f2] p-3 text-xs md:text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#5c94fc]"
            />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleCopy(b2cText, 'Texto español copiado')}
                className="py-2.5 px-3 rounded-xl font-black text-xs md:text-sm border-2 border-[#222] bg-gray-100 hover:bg-gray-200"
              >
                📋 Copiar texto
              </button>
              <button
                onClick={() => handleShareWithImage(b2cText, item.heroImage, `${item.id}_es_share.jpg`)}
                className="py-2.5 px-3 rounded-xl font-black text-xs md:text-sm border-2 border-[#222] bg-[#5c94fc] text-white shadow-[2px_2px_0px_#222] hover:bg-blue-600"
              >
                🚀 Compartir con imagen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
