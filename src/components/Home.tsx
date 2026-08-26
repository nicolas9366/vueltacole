import React from 'react';

interface HomeProps {
  onNavigateToMap: () => void;
  onOpenRedemption: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigateToMap, onOpenRedemption }) => {
  return (
    <div className="min-h-screen w-full bg-[#f8d878] font-['Fredoka',sans-serif] text-[#222]">
      {/* Header */}
      <header className="w-full bg-white border-b-4 border-[#222] shadow-[0_4px_0_#222] p-4 sticky top-0 z-50 flex justify-between items-center">
        <span className="text-2xl font-black tracking-wider text-mario-red">MAIN PAPER</span>
        <button 
          onClick={onOpenRedemption}
          className="px-4 py-2 bg-mario-red text-white font-bold rounded-xl border-4 border-[#222] shadow-[2px_2px_0px_#222] hover:translate-y-1 hover:shadow-none transition-all uppercase text-sm"
        >
          🎟️ Billete Dorado
        </button>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight text-[#222] text-center">
          Página Principal
        </h1>
        <p className="text-lg font-bold text-gray-600 mb-10 text-center">
          El contenido de la página se ha limpiado. Listo para el nuevo diseño.
        </p>

        <button 
          onClick={onNavigateToMap}
          className="px-8 py-4 bg-mario-blue text-white text-xl font-black rounded-2xl border-4 border-[#222] shadow-[6px_6px_0_#222] hover:translate-y-1 hover:shadow-[2px_2px_0_#222] transition-all uppercase"
        >
          🗺️ Ir al Mapa
        </button>
      </main>
    </div>
  );
};
