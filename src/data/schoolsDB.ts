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
  }
];
