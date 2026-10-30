import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MOCK_BAZARES } from '../data/schoolsDB';

interface MapAppProps {
  onNavigateHome: () => void;
}

export const MapApp: React.FC<MapAppProps> = ({ onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'misiones' | 'tiendas'>('misiones');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Map State
  const [viewState, setViewState] = useState({ longitude: -0.88, latitude: 41.65, zoom: 12 });
  const [selectedStore, setSelectedStore] = useState<any | null>(null);

  const handleMissionClick = (missionName: string) => {
    setActiveTab('tiendas');
    setSearchQuery(missionName);
    // In a real app, you would filter map markers here based on the mission/products
    setSelectedStore(null); // Reset selection
  };

  // Mock missions
  const MOCK_MISSIONS = [
    { id: 'm1', name: 'CEIP 1º Primaria', items: ['Lápiz', 'Goma', 'Cuaderno A4'] },
    { id: 'm2', name: 'ESO Kit Básico', items: ['Bolígrafos', 'Agenda', 'Calculadora'] }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8d878] font-['Fredoka',sans-serif] text-[#222]">
      {/* Sidebar */}
      <aside className="w-1/3 min-w-[320px] max-w-[450px] h-full bg-white border-r-4 border-[#222] z-10 flex flex-col relative">
        <div className="p-4 border-b-4 border-[#222] bg-white flex justify-between items-center shrink-0">
          <button 
            onClick={onNavigateHome}
            className="px-4 py-2 bg-gray-200 text-[#222] font-bold rounded-xl border-4 border-[#222] shadow-[2px_2px_0px_#222] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center text-sm"
          >
            🏠 Volver
          </button>

        </div>
        
        {/* Dual Tab System */}
        <div className="flex w-full border-b-4 border-[#222] bg-gray-100 shrink-0">
          <div 
            onClick={() => setActiveTab('misiones')}
            className={`flex-1 py-3 text-center border-r-4 border-[#222] transition-colors ${activeTab === 'misiones' ? 'font-black text-xl bg-mario-blue text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]' : 'font-bold text-lg bg-gray-200 text-gray-500 border-b-4 hover:bg-gray-300 cursor-pointer'}`}
          >
            🎒 Misiones
          </div>
          <div 
            onClick={() => setActiveTab('tiendas')}
            className={`flex-1 py-3 text-center border-[#222] transition-colors ${activeTab === 'tiendas' ? 'font-black text-xl bg-mario-blue text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]' : 'font-bold text-lg bg-gray-200 text-gray-500 border-b-4 hover:bg-gray-300 cursor-pointer'}`}
          >
            🏪 Tiendas
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#f8f9fa]">
          {activeTab === 'misiones' ? (
            <div>
              <h2 className="text-xl font-black mb-4 uppercase tracking-wide">Tus Misiones</h2>
              
              {MOCK_MISSIONS.map(mission => (
                <div key={mission.id} className="bg-white p-4 mb-4 rounded-2xl border-4 border-[#222] shadow-[4px_4px_0px_#222]">
                  <h3 className="font-bold text-lg mb-2 text-[#e52521]">{mission.name}</h3>
                  <ul className="text-sm text-gray-600 mb-3 space-y-1">
                    {mission.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handleMissionClick(mission.name)}
                    className="mt-3 w-full py-2 bg-mario-blue text-white font-bold rounded-xl border-4 border-[#222] shadow-[4px_4px_0px_#222] active:translate-y-1 active:shadow-none transition-all"
                  >
                    ⚔️ Obtener Equipo
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-black mb-4 uppercase tracking-wide">Buscar Tiendas</h2>
              
              <div className="mb-4">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: CEIP 1º Primaria..."
                  className="w-full p-3 border-4 border-[#222] rounded-xl focus:outline-none focus:ring-4 focus:ring-mario-yellow shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] font-bold"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <p className="text-gray-500 italic mb-4">
                  {searchQuery ? `Filtrando resultados por: "${searchQuery}"` : 'Mostrando todas las tiendas cercanas.'}
                </p>
                
                {/* List of stores would go here, filtered by searchQuery */}
                {MOCK_BAZARES.filter(store => !searchQuery || store.name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === 'CEIP 1º Primaria' || searchQuery === 'ESO Kit Básico').map(store => (
                  <div 
                    key={store.id} 
                    className="bg-white p-3 mb-3 rounded-xl border-4 border-[#222] cursor-pointer hover:bg-gray-50 shadow-[2px_2px_0px_#222]"
                    onClick={() => {
                      setViewState({ ...viewState, longitude: store.coordinates[0], latitude: store.coordinates[1], zoom: 14 });
                      setSelectedStore(store);
                    }}
                  >
                    <h4 className="font-bold">{store.name}</h4>
                    <p className="text-xs text-gray-500">{store.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Map Area */}
      <main className="flex-1 h-full relative">
        <div className="absolute inset-0 w-full h-full">
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          >
            {MOCK_BAZARES.map(store => (
              <Marker 
                key={store.id} 
                longitude={store.coordinates[0]} 
                latitude={store.coordinates[1]}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedStore(store);
                }}
              >
                <div className="w-8 h-8 bg-mario-red rounded-full border-4 border-[#222] shadow-[2px_2px_0px_#222] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs">
                  📍
                </div>
              </Marker>
            ))}

            {selectedStore && (
              <Popup
                longitude={selectedStore.latitude ? selectedStore.longitude : 0}
                latitude={selectedStore.latitude}
                anchor="bottom"
                onClose={() => setSelectedStore(null)}
                closeOnClick={false}
                className="z-50"
              >
                <div className="bg-white p-4 rounded-2xl border-4 border-[#222] shadow-[6px_6px_0px_#222] min-w-[250px]">
                  <h3 className="font-fredoka font-black text-xl mb-2 text-[#222]">{selectedStore.name}</h3>
                  <p className="text-sm font-bold text-gray-600 mb-3">{selectedStore.address}</p>
                  
                  <div className="flex mb-3">
                    <button className="py-1 px-3 bg-gray-200 rounded border-2 border-[#222] font-bold text-sm mr-2 hover:bg-gray-300">
                      🗺️ Navegar
                    </button>
                    <button className="py-1 px-3 bg-gray-200 rounded border-2 border-[#222] font-bold text-sm mr-2 hover:bg-gray-300">
                      📞 Llamar
                    </button>
                  </div>

                  <button className="w-full mt-3 py-2 bg-mario-yellow text-[#222] font-black text-lg rounded-xl border-4 border-[#222] shadow-[2px_2px_0px_#222] hover:bg-yellow-400 active:translate-y-1 active:shadow-none transition-all flex justify-center items-center">
                    🛒 Visitar Tienda Online
                  </button>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </main>
    </div>
  );
};
