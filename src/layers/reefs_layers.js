// AEB REP PTS
import {
  Blue_5Step,
  Blue_5Step_0_1,
  Blue_5Step_per_ha,
  SelectedTessela,
  FloodMaps_Bathy,
  Empty,
} from "./colormaps/colormaps";

// const annual_benefits = [
//     {
//         id: 'countries',
//         source: 'aeb',
//         source_layer: 'AEB_Hawaii_Merge_500mOffset_225mBuffer',
//         colorValue: ['to-number', ['get', 'Sum_E_D2']],
//         legend: Blue_5Step,
//         layer_title: 'Tessela',
//         layer_type: 'FILL_WITH_OUTLINE',
//         minzoom: 0,
//         maxzoom: 18,
//         opacity: 0.9,
//         display_legend: false,
//         is_selectable: true
//     }
// ]

const annual_benefits = [
  {
    id: "flooding_without",
    source: "aeb",
    // source_layer: 'AEB_Hawaii_Merge_500mOffset_225mBuffer',
    // colorValue: ['to-number', ['get', 'Sum_E_D2']],
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

    // is_selectable: true
  },
];

const layers = {
  "Benefit (AEB)": annual_benefits,
};

export default layers;
