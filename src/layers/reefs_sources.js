// FLORIDA, separated layers
const aeb = {
  type: "raster",
  tiles: [
    "https://tiles.arcgis.com/tiles/21H3muniXm83m5hZ/arcgis/rest/services/Maui_FZ_rp100_worf_flood_webmerc_rgb_tif2/MapServer/tile/{z}/{y}/{x}",
  ],
  // scheme: 'xyz'
};

const mapbox_dem = {
  type: "raster-dem",
  url: "mapbox://mapbox.mapbox-terrain-dem-v1",
  tileSize: 512,
  maxzoom: 14,
};

const sources = [
  ["aeb", aeb],
  ["mapbox-dem", mapbox_dem],
];

export default sources;
