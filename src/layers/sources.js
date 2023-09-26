const tesselas = {
  id: "tesselas",
  type: "vector",
  format: "mvt",
  url: "mapbox://clowrie.63wofind",
  minzoom: 3,
  maxzoom: 16,
};

const countries = {
  id: "countries",
  type: "vector",
  format: "mvt",
  url: "mapbox://clowrie.bdtniu0a",
  minzoom: 0,
  maxzoom: 4,
};

const mapbox_dem = {
  type: "raster-dem",
  url: "mapbox://mapbox.mapbox-terrain-dem-v1",
  tileSize: 512,
  maxzoom: 14,
};

// const flooding_with = {
//   type: "vector",
//   tiles: [
//     "https://tiles.arcgis.com/tiles/21H3muniXm83m5hZ/arcgis/rest/services/GlobalPoint_W_50_1215/VectorTileServer/tile/{z}/{y}/{x}",
//   ],
//   scheme: "xyz",
// };

// // FLORIDA, separated layers
// const flooding_without = {
//   type: "vector",
//   tiles: [
//     "https://tiles.arcgis.com/tiles/21H3muniXm83m5hZ/arcgis/rest/services/GlobalPoint_WO_50_1215/VectorTileServer/tile/{z}/{y}/{x}.pbf",
//   ],
//   scheme: "xyz",
// };
const floodYear = '100'

const flooding_1996 = {
  'type': 'raster',
  'tiles': [
    `https://cogserver-staging-myzvqet7ua-uw.a.run.app/{z}/{x}/{y}.png?dataset=cwon_data/with_1996_TC_Tr_${floodYear}.tiff&max_val=8&color=blues`
  ],
  'tileSize': 256,
};

const flooding_2015 = {
  'type': 'raster',
  'tiles': [
    `https://cogserver-staging-myzvqet7ua-uw.a.run.app/{z}/{x}/{y}.png?dataset=cwon_data/with_2015_TC_Tr_${floodYear}.tiff&max_val=8&color=blues`
  ],
  'tileSize': 256,
};



const sources = [
  ["tesselas", tesselas],
  ["countries", countries],
  ["mapbox-dem", mapbox_dem],
  ["flooding_1996", flooding_1996],
  ["flooding_2015", flooding_2015]
];

export default sources;
