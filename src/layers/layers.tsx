import {
  Blue_5Step,
  Blue_5Step_0_1,
  Red_10Step_negative1_positive1,
  SelectedTessela,
  FloodMaps_Bathy,
  Green,
  Red,
  Blue_5Step_Pop,
} from "./colormaps/colormaps";
import { Layer, LayerGroup, LayerName } from "types/dataModel";
import { Icon } from "@iconify/react";
import { RP } from "./floodconf";
import { BREADCRUMB_ICON_SIZE } from "hooks/useBreadcrumbs";

export const COUNTRY_TESELA_ZOOM_SWITCH = 0;
export const FLOODING_MIN_ZOOM = 3;

export const year = 2015;
export const ben_stock = ["to-number", ["get", `Ben_Stock_${year}`]];
const risk_stock = ["to-number", ["get", `Risk_Stock_${year}`]];
const ben_pop = ["to-number", ["get", `Ben_Pop_${year}`]];
const risk_pop = ["to-number", ["get", `Risk_Pop_${year}`]];
const nomang_risk_stock = ["+", ben_stock, risk_stock];
const risk_reduction_ratio = [
  "case",
  ["==", nomang_risk_stock, 0],
  0,
  ["-", 1, ["to-number", ["/", risk_stock, nomang_risk_stock]]],
];

export const mang_ha_perc_change = [
  "/",
  [
    "-",
    ["to-number", ["get", `Mang_Ha_${year}`]],
    ["to-number", ["get", `Mang_Ha_1996`]],
  ],
  ["to-number", ["get", `Mang_Ha_1996`]],
];

export const mang_ha_total_change = [
  "-",
  ["to-number", ["get", `Mang_Ha_${year}`]],
  ["to-number", ["get", `Mang_Ha_1996`]],
];

const ben_filter_value = 200000;

const current_risk = [
  {
    id: "tessela_bounds",
    source: "UCSC_CWON_studyunits",
    source_layer: "UCSC_CWON_studyunits",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "UCSC_CWON_studyunits_reppts",
    filter: [">", ben_stock, ben_filter_value],
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  {
    id: "tessela_rps",
    source: "UCSC_CWON_studyunits_reppts",
    source_layer: "UCSC_CWON_studyunits_reppts",
    colorValue: risk_stock,
    legend: Blue_5Step,
    layer_title: `Annual Expected Risk ${year}`,
    layer_type: "DISCRETE_POINT",
    legend_prefix: "$",
    format: "$",
    is_selectable: true,
    filter: [">", ben_stock, ben_filter_value],
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  // {
  //   id: "country_bounds",
  //   source: "UCSC_CWON_countrybounds",
  //   source_layer: "UCSC_CWON_countrybounds",
  //   colorValue: ben_stock,
  //   legend: Blue_5Step,
  //   layer_title: "Annual Expected Benefit",
  //   display_legend: false,
  //   layer_type: "FILL_WITH_OUTLINE",
  //   legend_prefix: "$",
  //   format: "$",
  //   is_selectable: true,
  //   opacity: 0.5,
  //   maxzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  //   // filter: [">", ben_stock, ben_filter_value],
  // },
];

const annual_benefits = [
  {
    id: "tessela_bounds",
    source: "UCSC_CWON_studyunits",
    source_layer: "UCSC_CWON_studyunits",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "UCSC_CWON_studyunits_reppts",
    filter: [">", ben_stock, ben_filter_value],
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  {
    id: "tessela_rps",
    source: "UCSC_CWON_studyunits_reppts",
    source_layer: "UCSC_CWON_studyunits_reppts",
    colorValue: ben_stock,
    legend: Blue_5Step,
    layer_title: `Annual Expected Benefit ${year}`,
    layer_type: "DISCRETE_POINT",
    legend_prefix: "$",
    format: "$",
    is_selectable: true,
    filter: [">", ben_stock, ben_filter_value],
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  // {
  //   id: "country_bounds",
  //   source: "UCSC_CWON_countrybounds",
  //   source_layer: "UCSC_CWON_countrybounds",
  //   colorValue: ben_stock,
  //   legend: Blue_5Step,
  //   layer_title: "Annual Expected Benefit",
  //   display_legend: false,
  //   layer_type: "FILL_WITH_OUTLINE",
  //   legend_prefix: "$",
  //   format: "$",
  //   is_selectable: true,
  //   opacity: 0.5,
  //   maxzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  //   // filter: [">", ben_stock, ben_filter_value],
  // },
];

const reduct_ratio = [
  {
    id: "tessela_bounds",
    source: "UCSC_CWON_studyunits",
    source_layer: "UCSC_CWON_studyunits",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "UCSC_CWON_studyunits_hexs",
  },
  {
    id: "hex",
    source: "UCSC_CWON_studyunits_hexs",
    source_layer: "UCSC_CWON_studyunits_hexs",
    legend: Blue_5Step_0_1,
    colorValue: risk_reduction_ratio,
    heightValue: nomang_risk_stock,
    baseValue: risk_stock,
    scale: 0.3,
    layer_title: `Risk Reduction ${year}`,
    layer_type: "HEX_3D",
    hex_type: "REDUCTION",
    legend_suffix: "%",
    format: "%",
    display_legend: true,
    is_selectable: true,
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  {
    id: "hex2",
    source: "UCSC_CWON_studyunits_hexs",
    source_layer: "UCSC_CWON_studyunits_hexs",
    legend: Blue_5Step_0_1,
    colorValue: "white",
    heightValue: risk_stock,
    baseValue: 0,
    scale: 0.3,
    layer_title: "Tessela",
    layer_type: "HEX_3D",
    hex_type: "BASE",
    legend_suffix: "%",
    format: "%",
    display_legend: false,
    is_selectable: true,
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  // {
  //   id: "country_bounds",
  //   source: "UCSC_CWON_countrybounds",
  //   source_layer: "UCSC_CWON_countrybounds",
  //   colorValue: risk_reduction_ratio,
  //   legend: Blue_5Step_0_1,
  //   layer_title: "Annual Expected Benefit",
  //   display_legend: false,
  //   layer_type: "FILL_WITH_OUTLINE",
  //   legend_prefix: "$",
  //   format: "$",
  //   is_selectable: true,
  //   opacity: 0.5,
  //   maxzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  //   // filter: [">", ben_stock, ben_filter_value],
  // },
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
    minzoom: FLOODING_MIN_ZOOM,
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
    minzoom: FLOODING_MIN_ZOOM,
    maxzoom: 18,
  },
  // {
  //   id: "flooding_1996",
  //   source: "flooding_1996_pt",
  //   source_layer: `with_1996_TC_Tr_${RP}`,
  //   legend: FloodMaps_Bathy,
  //   colorValue: ["to-number", ["get", "value"]],
  //   layer_title: `Expected Flooding, 1 in ${parseInt(RP)} year storm`,
  //   display_legend: true,
  //   layer_type: "GEO_POINT",
  //   legend_suffix: "m",
  //   subgroup: "flooding_1996",
  //   minzoom: FLOODING_MIN_ZOOM,
  // },
  {
    id: "flooding_nomang",
    source: "flooding_nomang_pt",
    source_layer: `Without_TC_Tr_${RP}`,
    legend: FloodMaps_Bathy,
    colorValue: ["to-number", ["get", "value"]],
    layer_title: `Expected Flooding, 1 in ${parseInt(RP)} year storm`,
    display_legend: true,
    layer_type: "GEO_POINT",
    legend_suffix: "m",
    subgroup: "flooding_nomang",
    minzoom: FLOODING_MIN_ZOOM,
  },
  {
    id: "flooding_2015",
    source: "flooding_2015_pt",
    source_layer: `with_2015_TC_Tr_${RP}`,
    legend: FloodMaps_Bathy,
    colorValue: ["to-number", ["get", "value"]],
    layer_title: `Without Mangroves, RP${parseInt(RP)}`,
    layer_type: "GEO_POINT",
    legend_suffix: "m",
    subgroup: "flooding_2015",
    minzoom: FLOODING_MIN_ZOOM,
  },
];

const Population = [
  {
    id: "tessela_bounds",
    source: "UCSC_CWON_studyunits",
    source_layer: "UCSC_CWON_studyunits",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "UCSC_CWON_studyunits_reppts",
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  {
    id: "tessela_rps",
    source: "UCSC_CWON_studyunits_reppts",
    source_layer: "UCSC_CWON_studyunits_reppts",
    colorValue: ben_pop,
    legend: Blue_5Step_Pop,
    layer_title: `Annual Population Benefit ${year}`,
    layer_type: "DISCRETE_POINT",
    legend_prefix: "",
    // format: "$",
    is_selectable: true,
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  // {
  //   id: "country_bounds",
  //   source: "UCSC_CWON_countrybounds",
  //   source_layer: "UCSC_CWON_countrybounds",
  //   colorValue: ben_pop,
  //   legend: Blue_5Step_Pop,
  //   layer_title: "Annual Expected Benefit",
  //   display_legend: false,
  //   layer_type: "FILL_WITH_OUTLINE",
  //   legend_prefix: "$",
  //   format: "$",
  //   is_selectable: true,
  //   opacity: 0.5,
  //   maxzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  //   // filter: [">", ben_stock, ben_filter_value],
  // },
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

const icon_style = {
  width: `${BREADCRUMB_ICON_SIZE}px`,
  height: `${BREADCRUMB_ICON_SIZE}px`,
};
const layerGroups: Record<LayerName, LayerGroup> = {
  [LayerName.CurrentRisk]: {
    name: LayerName.CurrentRisk,
    shortDescription:
      "The current annual risk from flooding at the coast, including existing benefits from mangroves.",
    IconComponent: () => (
      <Icon icon="mdi:hazard-lights" color="white" className="w-full h-full" />
    ),
    IconComponentHTML: `<iconify-icon icon="mdi:hazard-lights" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: current_risk,
  },
  [LayerName.BenefitAEB]: {
    name: LayerName.BenefitAEB,
    shortDescription:
      "The annual expected benefit (AEB) is the average annual benefit of mangroves over a 20-year period.",
    IconComponent: () => (
      <Icon icon="ph:hand-coins" color="white" className="w-full h-full" />
    ),
    IconComponentHTML: `<iconify-icon icon="ph:hand-coins" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: annual_benefits,
  },
  [LayerName.RiskReduction]: {
    name: LayerName.RiskReduction,
    shortDescription:
      "The ratio of the expected annual benefit (AEB)  mangroves to the annual expected benefit without.",
    IconComponent: () => (
      <Icon
        icon="lucide:git-compare"
        color="white"
        className="w-5/6 h-5/6 mx-auto"
      />
    ),
    IconComponentHTML: `<iconify-icon icon="lucide:git-compare" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: reduct_ratio,
  },
  [LayerName.Flooding]: {
    name: LayerName.Flooding,
    shortDescription:
      "The depth of flooding in the event of a 50-year storm surge at different years.",
    IconComponent: () => (
      <Icon
        icon="ri:flood-line"
        color="white"
        className="w-5/6 h-5/6 mx-auto"
      />
    ),
    IconComponentHTML: `<iconify-icon icon="ri:flood-line" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: flooding,
  },
  [LayerName.Population]: {
    name: LayerName.Population,
    shortDescription:
      "The annual expected population protected is the avg. annual reduction of people exposed to flooding.",
    IconComponent: () => (
      <Icon
        icon="pepicons-pencil:people"
        color="white"
        className="w-full h-full -translate-y-1"
      />
    ),
    IconComponentHTML: `<iconify-icon icon="pepicons-pencil:people" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: Population,
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
