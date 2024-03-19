// AEB REP PTS
import { FloodMaps_Bathy } from "./colormaps/colormaps";

const annual_benefits = [
  {
    id: "flooding_without",
    source: "aeb",
    legend: FloodMaps_Bathy,
    layer: {
      id: "hillshade-raster",
      type: "raster",
      source: "aeb",
      source_layer: "Maui_FZ_rp100_worf_flood_webmerc_rgb.tif",
    },
    layer_title: "Flood Depth, RP100, No Reefs",
    layer_type: "RASTER",
    minzoom: 0,
    maxzoom: 18,
    opacity: 0.9,
    display_legend: true,
  },
];

const layers = { "Benefit (AEB)": annual_benefits };

export default layers;
