export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: [number, number];
}

export const MOCK_SCHOOLS: School[] = [
  {
    id: "s1",
    name: "CEIP Josefa Amar y Borbón",
    address: "C/ Julio García Condoy, 50",
    city: "Zaragoza",
    coordinates: [-0.887, 41.656] // Approx coordinates for Zaragoza
  },
  {
    id: "s2",
    name: "Colegio San Agustín",
    address: "Avenida de los Toreros, 15",
    city: "Madrid",
    coordinates: [-3.666, 40.435]
  },
  {
    id: "s3",
    name: "CEIP Cervantes",
    address: "Calle de Cervantes, 5",
    city: "Barcelona",
    coordinates: [2.173, 41.385]
  },
  {
    id: "s4",
    name: "Colegio El Romeral",
    address: "Av. de Andalucía, 32",
    city: "Málaga",
    coordinates: [-4.42, 36.72]
  }
];

export const MOCK_BAZARES = [
  {
    id: "10012361A1",
    name: "LEDPLUS 2013 S.L",
    address: "CL Pablo Casals, 2, 50018",
    city: "ZARAGOZA",
    coordinates: [-0.885, 41.658]
  },
  {
    id: "10014708",
    name: "BAZARHU2020 SOCIEDAD LIMITADA",
    address: "AVENIDA ALMOZARA, 41 LOCAL, 50003",
    city: "ZARAGOZA",
    coordinates: [-0.900, 41.662]
  },
  {
    id: "10010006",
    name: "TODO OUTLET SL",
    address: "CL Jaime Ferran 1, 50014",
    city: "ZARAGOZA",
    coordinates: [-0.875, 41.660]
  },
  {
    id: "10008057",
    name: "BRICO ACTUAL SL",
    address: "AV.Navarra 180, 50011",
    city: "ZARAGOZA",
    coordinates: [-0.910, 41.655]
  },
  {
    id: "10012593",
    name: "ZHENG HAIRONG",
    address: "Paseo de Calanda, 14, 50010",
    city: "ZARAGOZA",
    coordinates: [-0.905, 41.650]
  },
  {
    id: "10005591",
    name: "COMERCIAL GALERIA CHINA S.L",
    address: "Camino de Las Torres 17, 50008",
    city: "ZARAGOZA",
    coordinates: [-0.878, 41.645]
  },
  {
    id: "10020496",
    name: "SUPERMERCADOS JX SL",
    address: "C. Batalla de Pavía, 14 LOCAL 5T, 50002",
    city: "ZARAGOZA",
    coordinates: [-0.870, 41.652]
  },
  // Hidden 强基 clients (34)
  {"id": "10001550", "name": "QING SONG JIAN KANG S.L", "address": "AV.Fernando de Catolico 33-35, 50600", "city": "EJEA DE LO CABALLEROS", "coordinates": [-0.887, 41.656], "hidden": true, "tier": "qiangji"},
  {"id": "10002090", "name": "NHAFKRA 050 S.L.", "address": "CL Salvador Allende 42-44, 50015", "city": "ZARAGOZA", "coordinates": [-1.06803, 41.75436], "hidden": true, "tier": "qiangji"},
  {"id": "10002218", "name": "YE LIZHU", "address": "CL Guma 34, 50700", "city": "CASPE ZARAGOZA", "coordinates": [-0.04354, 41.23675], "hidden": true, "tier": "qiangji"},
  {"id": "10002459", "name": "LEON ORIENTAL S.L", "address": "CL Madre Vedruna 42-46, 50008", "city": "ZARAGOZA", "coordinates": [-0.88137, 41.64543], "hidden": true, "tier": "qiangji"},
  {"id": "10002705", "name": "MUEBLE CRIVER S.C", "address": "CL Martinez Soria 11, 50500", "city": "TARAZONA", "coordinates": [-1.72456, 41.90521], "hidden": true, "tier": "qiangji"},
  {"id": "10002865", "name": "HONG YUN STAR S.L", "address": "AV.Laviaga Castillo 2, 50100", "city": "ALMUNIA DE DA GODINA, LA", "coordinates": [-1.34897, 41.50641], "hidden": true, "tier": "qiangji"},
  {"id": "10003254", "name": "SUPER BAZAR TODO A CIEN S.L", "address": "CL Eulogio Oscariz S/N Csecto 1-3, 50830", "city": "VILLANUEVA DE GALLEGO", "coordinates": [-0.84489, 41.76951], "hidden": true, "tier": "qiangji"},
  {"id": "10004636", "name": "SHUNYIDA S.L", "address": "Pl. Huertos, 1B, 50410", "city": "CUARTE DE HUERVA", "coordinates": [-0.94109, 41.5884], "hidden": true, "tier": "qiangji"},
  {"id": "10004735", "name": "HIPER DELICIAS HOGAR S.L", "address": "CL de Luis Perez Serrano 7, 50010", "city": "ZARAGOZA", "coordinates": [-0.887, 41.656], "hidden": true, "tier": "qiangji"},
  {"id": "10004800", "name": "CHEN HAO", "address": "CL Barrio Nuevo 42, 50171", "city": "LA PUELA DE ALFINDE", "coordinates": [-0.887, 41.656], "hidden": true, "tier": "qiangji"},
  {"id": "10005026", "name": "ZHANG YONGCHAO", "address": "CL Cabanyera Real 21, 22520", "city": "FRAGA", "coordinates": [0.35008, 41.52216], "hidden": true, "tier": "qiangji"},
  {"id": "10005566", "name": "ZYL 2015 S.L", "address": "Poligono la Paz 234 Sagundo Burgos Km 122, 44195", "city": "TERUEL", "coordinates": [-1.14918, 40.36419], "hidden": true, "tier": "qiangji"},
  {"id": "10006056", "name": "CHOLLO ARAGON WJ WJ 2015 S.C", "address": "CL Todo Sobre Mi Madre 4-8, 50019", "city": "ZARAGOZA", "coordinates": [-0.92683, 41.62126], "hidden": true, "tier": "qiangji"},
  {"id": "10006740", "name": "GRAN BAZAR CITY SL", "address": "Paseo Gran Via 33 Local, 50006", "city": "ZARAGOZA", "coordinates": [-0.88988, 41.6407], "hidden": true, "tier": "qiangji"},
  {"id": "10006763", "name": "TODO A CIEN ROMAREDA S.C", "address": "CL Pedro Ivnel Ceremonioso 12, 50009", "city": "ZARAGOZA", "coordinates": [-0.9046, 41.64069], "hidden": true, "tier": "qiangji"},
  {"id": "10006825", "name": "CHOLLO EUROPA S.C", "address": "CL Coso 89, 50001", "city": "ZARAGOZA", "coordinates": [-0.87791, 41.65128], "hidden": true, "tier": "qiangji"},
  {"id": "10007327", "name": "MODERN TIMES STORES S.L", "address": "AV.Cesar Augusto 115- Local, 50003", "city": "ZARAGOZA", "coordinates": [-0.88892, 41.65729], "hidden": true, "tier": "qiangji"},
  {"id": "10007573", "name": "TONGWU Y LINYAN S.L", "address": "CL Corona de Aragon 39, 44200", "city": "CALAMOCHA", "coordinates": [-1.29665, 40.9204], "hidden": true, "tier": "qiangji"},
  {"id": "10008677", "name": "HISPANIA NEW HOME MASTER IMPORT S.L", "address": "CL Jaime Ferran Num.23, 50014", "city": "ZARAGOZA", "coordinates": [-0.86343, 41.663], "hidden": true, "tier": "qiangji"},
  {"id": "10012361", "name": "LEDPLUS 2013 S.L", "address": "CL Sor Juana de la Cruz, 6, 50018", "city": "ZARAGOZA", "coordinates": [-0.89299, 41.67062], "hidden": true, "tier": "qiangji"},
  {"id": "10012484", "name": "LUXE PREMIER SL", "address": "CL Burgos, 11 Local, 50005", "city": "ZARAGOZA", "coordinates": [-0.89546, 41.64637], "hidden": true, "tier": "qiangji"},
  {"id": "10013236", "name": "GRAN BAZAR PIRINEOS S.L", "address": "AV.de Los Pirineos, 14, 22004", "city": "HUESCA", "coordinates": [-0.41731, 42.14317], "hidden": true, "tier": "qiangji"},
  {"id": "10014122", "name": "SUPERMARKET TERUEL SL", "address": "CL Atenas, 1, 44195", "city": "TERUEL", "coordinates": [-1.14918, 40.36419], "hidden": true, "tier": "qiangji"},
  {"id": "10014150", "name": "LIN MEILAN S.L", "address": "CL TOMAS EDISON 6, 50014", "city": "ZARAGOZA", "coordinates": [-0.86243, 41.66495], "hidden": true, "tier": "qiangji"},
  {"id": "10016079", "name": "ZHENG FUQIN", "address": "C. Reina de Portugal, 9, 50016", "city": "ZARAGOZA", "coordinates": [-0.82934, 41.66876], "hidden": true, "tier": "qiangji"},
  {"id": "10016342", "name": "HEMU HOGAR, S.L.", "address": "CL VALENTÍN CARDERERA 1, 22003", "city": "HUESCA", "coordinates": [-0.41381, 42.13886], "hidden": true, "tier": "qiangji"},
  {"id": "10016934", "name": "HIPERMONZON S.L", "address": "CL Valle de Ordesa, 19, 22400", "city": "MONZON", "coordinates": [0.18851, 41.92062], "hidden": true, "tier": "qiangji"},
  {"id": "10017036", "name": "HU CHEN HOME 2022, S.L", "address": "Av. Martínez de Velasco, 71, 22004", "city": "HUESCA", "coordinates": [-0.41797, 42.13729], "hidden": true, "tier": "qiangji"},
  {"id": "10017754", "name": "HIPER TARAZONA 2019 SL", "address": "CL Teresa Cajal, 29, 50500", "city": "TARAZONA", "coordinates": [-1.72355, 41.89944], "hidden": true, "tier": "qiangji"},
  {"id": "10018710", "name": "CHEN CUILI", "address": "Pl. de los Lagos Azules, 6-10, 50011", "city": "ZARAGOZA", "coordinates": [-0.93026, 41.65653], "hidden": true, "tier": "qiangji"},
  {"id": "10019182", "name": "XIDACO ZARAGOZA, S.L.", "address": "CL de Don Jaime I, 33, 50003", "city": "ZARAGOZA", "coordinates": [-0.87982, 41.65216], "hidden": true, "tier": "qiangji"},
  {"id": "10019803", "name": "SORPRESA GIRASOL SL", "address": "Carretera Logroño, Km 12 (Junto de Alcampo), 50180", "city": "UTEBO", "coordinates": [-1.00428, 41.7061], "hidden": true, "tier": "qiangji"},
  {"id": "10020486", "name": "PRIHOME 2022 SLU", "address": "C. Pablo Casals, 2, local 4, 50018", "city": "ZARAGOZA", "coordinates": [-0.91013, 41.69158], "hidden": true, "tier": "qiangji"},
  {"id": "10020934", "name": "GRUPO HIPER HOGAR 2025 SL", "address": "C. de León XIII, 50008", "city": "Zaragoza", "coordinates": [-0.88205, 41.64593], "hidden": true, "tier": "qiangji"},
];
