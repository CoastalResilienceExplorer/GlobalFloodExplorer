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
const floodYear = "100";
const COGSERVER_URL = "https://cogserver-staging-myzvqet7ua-uw.a.run.app";

const flooding_1996 = {
  type: "raster",
  tiles: [
    `${COGSERVER_URL}/{z}/{x}/{y}.png?dataset=cwon_data/with_1996_TC_Tr_${floodYear}.tiff&max_val=8&color=blues`,
  ],
  tileSize: 256,
};

const flooding_2015 = {
  type: "raster",
  tiles: [
    `${COGSERVER_URL}/{z}/{x}/{y}.png?dataset=cwon_data/with_2015_TC_Tr_${floodYear}.tiff&max_val=8&color=blues`,
  ],
  tileSize: 256,
};

const flooding_1996_pt = {
  id: "flooding_1996_pt",
  type: "vector",
  format: "mvt",
  tiles: [
    "https://pmtileserver-staging-myzvqet7ua-uw.a.run.app/cwon_data_chunked/with_1996_TC_Tr_100/{z}/{x}/{y}.mvt",
  ],
  minzoom: 0,
  maxzoom: 14,
};

const flooding_2015_pt = {
  id: "flooding_2015_pt",
  type: "vector",
  format: "mvt",
  tiles: [
    "https://pmtileserver-staging-myzvqet7ua-uw.a.run.app/cwon_data_chunked/with_2015_TC_Tr_100/{z}/{x}/{y}.mvt",
  ],
  minzoom: 0,
  maxzoom: 14,
};

const mangroves_1996 = {
  id: "mangroves_1996",
  type: "vector",
  format: "mvt",
  tiles: [
    "https://pmtileserver-staging-myzvqet7ua-uw.a.run.app/vectors/GMW_1996_v3_Areas/{z}/{x}/{y}.mvt",
  ],
  minzoom: 0,
  maxzoom: 14,
};

const mangroves_2015 = {
  id: "mangroves_2015",
  type: "vector",
  format: "mvt",
  tiles: [
    "https://pmtileserver-staging-myzvqet7ua-uw.a.run.app/vectors/GMW_2015_v3_Areas/{z}/{x}/{y}.mvt",
  ],
  minzoom: 0,
  maxzoom: 14,
};

const CWON_tesela_reppts = {
  id: "CWON_combined_teselas_reppts",
  type: "vector",
  format: "mvt",
  tiles: [
    "https://pmtileserver-staging-myzvqet7ua-uw.a.run.app/vectors/CWON_combined_teselas_reppts/{z}/{x}/{y}.mvt",
  ],
  minzoom: 0,
  maxzoom: 14,
};

const CWON_tesela_bounds = {
  id: "CWON_combined_teselas",
  type: "vector",
  format: "mvt",
  tiles: [
    "https://pmtileserver-staging-myzvqet7ua-uw.a.run.app/vectors/CWON_combined_teselas/{z}/{x}/{y}.mvt",
  ],
  minzoom: 0,
  maxzoom: 14,
};

const CWON_tesela_hexs = {
  id: "CWON_combined_teselas_hexs",
  type: "vector",
  format: "mvt",
  tiles: [
    "https://pmtileserver-staging-myzvqet7ua-uw.a.run.app/vectors/CWON_combined_teselas_hexs/{z}/{x}/{y}.mvt",
  ],
  minzoom: 0,
  maxzoom: 14,
};

const sources = [
  ["tesselas", tesselas],
  ["countries", countries],
  ["mapbox-dem", mapbox_dem],
  ["flooding_1996_pt", flooding_1996_pt],
  // ["flooding_2015", flooding_2015],
  ["mangroves_2015", mangroves_2015],
  ["mangroves_1996", mangroves_1996],
  ["flooding_2015_pt", flooding_2015_pt],
  ["CWON_combined_teselas", CWON_tesela_bounds],
  ["CWON_combined_teselas_reppts", CWON_tesela_reppts],
  ["CWON_combined_teselas_hexs", CWON_tesela_hexs],
];

export default sources;
