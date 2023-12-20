import { ReactComponent as ExampleSvg } from "assets/Map_Icon.svg";
import {
  Blue_5Step,
  Blue_5Step_0_1,
  Red_10Step_0_1,
  Red_10Step_negative1_positive1,
  SelectedTessela,
  FloodMaps_Bathy,
  Green,
  Red,
} from "./colormaps/colormaps";
import { Layer, LayerGroup, LayerName } from "types/dataModel";

let year = "2020";
if (year === "2015") {
  year = "";
} else {
  year = `_${year}`;
}
const ben_stock = ["to-number", ["get", `Ben_Stock${year}`]];
const risk_stock = ["to-number", ["get", `Risk_Stock${year}`]];
const ben_pop = ["to-number", ["get", `Ben_Pop${year}`]];
const risk_pop = ["to-number", ["get", `Risk_Pop${year}`]];
const nomang_risk_stock = ["+", ben_stock, risk_stock];

const annual_benefits = [
  {
    id: "tessela_bounds",
    source: "CWON_combined_teselas",
    source_layer: "CWON_combined_teselas",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "CWON_combined_teselas_reppts",
  },
  {
    id: "tessela_rps",
    source: "CWON_combined_teselas_reppts",
    source_layer: "CWON_combined_teselas_reppts",
    colorValue: ben_stock,
    legend: Blue_5Step,
    layer_title: "Annual Expected Benefit",
    layer_type: "DISCRETE_POINT",
    legend_prefix: "$",
    format: "$",
    is_selectable: true,
  },
];

const reduct_ratio = [
  {
    id: "tessela_bounds",
    source: "CWON_combined_teselas",
    source_layer: "CWON_combined_teselas",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "CWON_combined_teselas_hexs",
  },
  {
    id: "hex",
    source: "CWON_combined_teselas_hexs",
    source_layer: "CWON_combined_teselas_hexs",
    legend: Blue_5Step_0_1,
    colorValue: [
      "case",
      ["==", nomang_risk_stock, 0],
      0,
      ["-", 1, ["to-number", ["/", risk_stock, nomang_risk_stock]]],
    ],
    heightValue: nomang_risk_stock,
    baseValue: risk_stock,
    scale: 0.5,
    layer_title: "Risk Reduction",
    layer_type: "HEX_3D",
    hex_type: "REDUCTION",
    legend_suffix: "%",
    format: "%",
    display_legend: true,
    is_selectable: true,
  },
  {
    id: "hex2",
    source: "CWON_combined_teselas_hexs",
    source_layer: "CWON_combined_teselas_hexs",
    legend: Blue_5Step_0_1,
    colorValue: "white",
    heightValue: risk_stock,
    baseValue: 0,
    scale: 0.5,
    layer_title: "Tessela",
    layer_type: "HEX_3D",
    hex_type: "BASE",
    legend_suffix: "%",
    format: "%",
    display_legend: false,
    is_selectable: true,
  },
];

const flooding = [
  {
    id: "mangroves_2015",
    source: "mangroves_2015",
    source_layer: "cf23fc24843b11eeb772b580fc9aa31f",
    layer_title: "Mangroves 2015",
    colorValue: ["to-number", ["get", "PXLVAL"]],
    legend: Green,
    layer_type: "FILL_WITH_OUTLINE",
    display_legend: false,
    subgroup: "flooding_2015",
    opacity: 1,
    minzoom: 4,
    maxzoom: 18,
  },
  {
    id: "mangroves_1996",
    source: "mangroves_1996",
    source_layer: "GMW_1996_v3_Areas",
    layer_title: "Mangroves 1996",
    colorValue: ["to-number", ["get", "PXLVAL"]],
    legend: Green,
    layer_type: "FILL_WITH_OUTLINE",
    display_legend: false,
    subgroup: "flooding_1996",
    opacity: 1,
    minzoom: 4,
    maxzoom: 18,
  },
  {
    id: "flooding_1996",
    source: "flooding_1996_pt",
    source_layer: "with_1996_TC_Tr_100",
    legend: FloodMaps_Bathy,
    colorValue: ["to-number", ["get", "value"]],
    layer_title: "Without Mangroves, RP50",
    layer_type: "GEO_POINT",
    legend_suffix: "m",
    subgroup: "flooding_1996",
    minzoom: 4,
  },
  {
    id: "flooding_2015",
    source: "flooding_2015_pt",
    source_layer: "with_2015_TC_Tr_100",
    legend: FloodMaps_Bathy,
    colorValue: ["to-number", ["get", "value"]],
    layer_title: "Without Mangroves, RP50",
    layer_type: "GEO_POINT",
    legend_suffix: "m",
    subgroup: "flooding_2015",
    minzoom: 4,
  },
];

const SHDI = [
  {
    id: "tessela_bounds",
    source: "CWON_tesela_bounds",
    source_layer: "CWON_combined_teselas",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "CWON_combined_teselas_reppts",
  },
  {
    id: "tessela_rps",
    source: "CWON_combined_teselas_reppts",
    source_layer: "CWON_combined_teselas_reppts",
    colorValue: ["to-number", ["get", "SHDI_2015"]],
    legend: Red_10Step_0_1,
    layer_title: "Annual Expected Benefit",
    layer_type: "DISCRETE_POINT",
    legend_prefix: "",
    // format: "$",
    is_selectable: true,
  },
];

const MangroveLoss = [
  {
    id: "tessela_bounds",
    source: "CWON_combined_teselas",
    source_layer: "CWON_combined_teselas",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "CWON_combined_teselas_reppts",
  },
  {
    id: "tessela_rps",
    source: "CWON_combined_teselas_reppts",
    source_layer: "CWON_combined_teselas_reppts",
    colorValue: [
      "/",
      [
        "-",
        ["to-number", ["get", "Mang_Ha_2020"]],
        ["to-number", ["get", "Mang_Ha_1996"]],
      ],
      ["+", ["to-number", ["get", "Mang_Ha_1996"]], 1], //Divide by zero
    ],
    legend: Red_10Step_negative1_positive1,
    layer_title: "Annual Expected Benefit",
    layer_type: "DISCRETE_POINT",
    legend_prefix: "",
    format: "%",
    is_selectable: true,
  },
  {
    id: "flooding_2015",
    source: "flooding_2015_pt",
    source_layer: "with_2015_TC_Tr_100",
    legend: FloodMaps_Bathy,
    colorValue: ["to-number", ["get", "value"]],
    layer_title: "Without Mangroves, RP50",
    layer_type: "GEO_POINT",
    legend_suffix: "m",
    minzoom: 4,
  },
  {
    id: "mangroves_1996",
    source: "mangroves_1996",
    source_layer: "GMW_1996_v3_Areas",
    // legend: Mangroves,
    layer_title: "Mangroves 1996",
    colorValue: ["to-number", ["get", "PXLVAL"]],
    legend: Green,
    layer_type: "FILL_WITH_OUTLINE",
    display_legend: false,
    opacity: 1.0,
    minzoom: 4,
    maxzoom: 18,
  },
  {
    id: "mangroves_2015",
    source: "mangroves_2015",
    source_layer: "cf23fc24843b11eeb772b580fc9aa31f",
    // legend: Mangroves,
    layer_title: "Mangroves 2015",
    colorValue: ["to-number", ["get", "PXLVAL"]],
    legend: Red,
    layer_type: "FILL_WITH_OUTLINE",
    display_legend: false,
    opacity: 0.5,
    minzoom: 4,
    maxzoom: 18,
  },
];

const layerGroups: Record<LayerName, LayerGroup> = {
  [LayerName.BenefitAEB]: {
    name: LayerName.BenefitAEB,
    shortDescription:
      "The annual expected benefit (AEB) is the average annual benefit of mangroves over a 20-year period.",
    IconComponent: ExampleSvg,
    layers: annual_benefits,
  },
  [LayerName.RiskReduction]: {
    name: LayerName.RiskReduction,
    shortDescription:
      "The ratio of the expected annual benefit (AEB)  mangroves to the annual expected benefit without.",
    IconComponent: ExampleSvg,
    layers: reduct_ratio,
  },
  [LayerName.Flooding]: {
    name: LayerName.Flooding,
    shortDescription:
      "The depth of flooding in the event of a 50-year storm surge at different years.",
    IconComponent: ExampleSvg,
    layers: flooding,
  },
  [LayerName.SHDI]: {
    name: LayerName.SHDI,
    shortDescription:
      "The Social and Human Development Index (SHDI) is a composite index of development indicators.",
    IconComponent: ExampleSvg,
    layers: SHDI,
  },
  [LayerName.MangLoss]: {
    name: LayerName.MangLoss,
    shortDescription: "The percentage of mangroves lost between 1996 and 2015.",
    IconComponent: ExampleSvg,
    layers: MangroveLoss,
  },
};

export const layersByGroup = Object.values(layerGroups).reduce(
  (acc, group) => {
    acc[group.name] = group.layers;
    return acc;
  },
  {} as Record<LayerName, Layer[]>,
);

export default layerGroups;
