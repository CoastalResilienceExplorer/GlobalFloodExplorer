import {
  Blue_5Step,
  Blue_5Step_0_1,
  SelectedTessela,
  FloodMaps_Bathy,
  Green,
  Grey,
  Blue_5Step_Pop,
  Red_10Step,
} from "./colormaps/colormaps";
import {
  ConfigurableLayerMap,
  Layer,
  LayerGroup,
  LayerGroupName,
  LayerName,
} from "types/dataModel";
import { Icon } from "@iconify/react";
import { RP } from "./floodconf";
import { BREADCRUMB_ICON_SIZE } from "hooks/useBreadcrumbs";

export const COUNTRY_TESELA_ZOOM_SWITCH = 0;
export const FLOODING_MIN_ZOOM = 3;

export const initialYear = 2015;
export const benStock = ["to-number", ["get", "Ben_Stock_2015"]];
const riskStock = ["to-number", ["get", "Risk_Stock_2015"]];
const benPop = ["to-number", ["get", "Ben_Pop_2015"]];
const nomangRiskStock = ["+", benStock, riskStock];
const riskReductionRatio = [
  "case",
  ["==", nomangRiskStock, 0],
  0,
  ["-", 1, ["to-number", ["/", riskStock, nomangRiskStock]]],
];

export const mangHaPercChange = [
  "/",
  [
    "-",
    ["to-number", ["get", "Mang_Ha_2015"]],
    ["to-number", ["get", "Mang_Ha_1996"]],
  ],
  ["to-number", ["get", "Mang_Ha_1996"]],
];

export const mangHaTotalChange = [
  "-",
  ["to-number", ["get", "Mang_Ha_2015"]],
  ["to-number", ["get", "Mang_Ha_1996"]],
];

const BEN_FILTER_VALUE = 200000;

export const LAYERS: Record<LayerName, Layer> = {
  [LayerName.TESSELA_BOUNDS]: {
    id: "tessela_bounds",
    source: "UCSC_CWON_studyunits",
    source_layer: "UCSC_CWON_studyunits",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "UCSC_CWON_studyunits_reppts",
    filter: [">", benStock, BEN_FILTER_VALUE],
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  [LayerName.TESSELA_BOUNDS_RISK_REDUCTION]: {
    id: "tessela_bounds",
    source: "UCSC_CWON_studyunits",
    source_layer: "UCSC_CWON_studyunits",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "UCSC_CWON_studyunits_hexs",
  },
  [LayerName.TESSELA_BOUNDS_POPULATION]: {
    id: "tessela_bounds",
    source: "UCSC_CWON_studyunits",
    source_layer: "UCSC_CWON_studyunits",
    legend: SelectedTessela,
    layer_title: "Tessela",
    layer_type: "SIMPLE_OUTLINE",
    selection_dependent_on: "UCSC_CWON_studyunits_reppts",
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  [LayerName.TESSELA_RPS_RISK_REDUCTION]: {
    id: "tessela_rps",
    source: "UCSC_CWON_studyunits_reppts",
    source_layer: "UCSC_CWON_studyunits_reppts",
    colorValue: riskStock,
    legend: Blue_5Step,
    layer_title: `Annual Expected Risk 2015`,
    layer_type: "DISCRETE_POINT",
    legend_prefix: "$",
    format: "$",
    is_selectable: true,
    filter: [">", benStock, BEN_FILTER_VALUE],
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  [LayerName.TESSELA_RPS_BENEFITS]: {
    id: "tessela_rps",
    source: "UCSC_CWON_studyunits_reppts",
    source_layer: "UCSC_CWON_studyunits_reppts",
    colorValue: benStock,
    legend: Blue_5Step,
    layer_title: `Annual Expected Benefit 2015`,
    layer_type: "DISCRETE_POINT",
    legend_prefix: "$",
    format: "$",
    is_selectable: true,
    filter: [">", benStock, BEN_FILTER_VALUE],
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  [LayerName.TESSELA_RPS_POPULATION]: {
    id: "tessela_rps",
    source: "UCSC_CWON_studyunits_reppts",
    source_layer: "UCSC_CWON_studyunits_reppts",
    colorValue: benPop,
    legend: Blue_5Step_Pop,
    layer_title: `Annual Population Benefit 2015`,
    layer_type: "DISCRETE_POINT",
    legend_prefix: "",
    is_selectable: true,
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  [LayerName.HEX]: {
    id: "hex",
    source: "UCSC_CWON_studyunits_hexs",
    source_layer: "UCSC_CWON_studyunits_hexs",
    legend: Blue_5Step_0_1,
    colorValue: riskReductionRatio,
    heightValue: nomangRiskStock,
    baseValue: riskStock,
    scale: 0.3,
    layer_title: `Risk Reduction 2015`,
    layer_type: "HEX_3D",
    hex_type: "REDUCTION",
    legend_suffix: "%",
    format: "%",
    display_legend: true,
    is_selectable: true,
    minzoom: COUNTRY_TESELA_ZOOM_SWITCH,
  },
  [LayerName.HEX2]: {
    id: "hex2",
    source: "UCSC_CWON_studyunits_hexs",
    source_layer: "UCSC_CWON_studyunits_hexs",
    legend: Blue_5Step_0_1,
    colorValue: "white",
    heightValue: riskStock,
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
  [LayerName.MANGROVES_NOMANG]: {
    id: "mangroves_nomang",
    source: "mangroves_2015",
    source_layer: "cf23fc24843b11eeb772b580fc9aa31f",
    layer_title: "No Mangroves",
    colorValue: ["to-number", ["get", "PXLVAL"]],
    legend: Grey,
    layer_type: "FILL_WITH_OUTLINE",
    display_legend: false,
    subgroup: "flooding_nomang",
    opacity: 0.4,
    minzoom: FLOODING_MIN_ZOOM,
    maxzoom: 18,
  },
  [LayerName.MANGROVES_2015]: {
    id: "mangroves_2015",
    source: "mangroves_2015",
    source_layer: "cf23fc24843b11eeb772b580fc9aa31f",
    layer_title: "Mangroves 2015",
    colorValue: ["to-number", ["get", "PXLVAL"]],
    legend: Green,
    layer_type: "FILL_WITH_OUTLINE",
    display_legend: false,
    subgroup: "flooding_2015",
    opacity: 0.4,
    minzoom: FLOODING_MIN_ZOOM,
    maxzoom: 18,
  },
  [LayerName.FLOODING_NOMANG]: {
    id: "flooding_nomang",
    source: "flooding_squares",
    source_layer: `CWON_Tr50_reindexed`,
    legend: FloodMaps_Bathy,
    colorValue: ["to-number", ["get", `without_2015_TC_Tr_${RP}`]],
    layer_title: "Expected Flooding",
    layer_subtitle: `1 in ${parseInt(RP)} year storm`,
    layer_toggle: "Show Flooding without Mangroves",
    display_legend: true,
    layer_type: "FILL_WITH_OUTLINE",
    legend_suffix: "m",
    subgroup: "flooding_nomang",
    minzoom: FLOODING_MIN_ZOOM,
    maxzoom: 18,
    filter: [">", ["to-number", ["get", `without_2015_TC_Tr_${RP}`]], 0],
  },
  [LayerName.FLOODING_2015]: {
    id: "flooding_2015",
    source: "flooding_squares",
    source_layer: `CWON_Tr50_reindexed`,
    legend: FloodMaps_Bathy,
    colorValue: ["to-number", ["get", `with_2015_TC_Tr_${RP}`]],
    layer_title: "Expected Flooding",
    layer_subtitle: `1 in ${parseInt(RP)} year storm`,
    layer_toggle: "Show Flooding with Mangroves",
    layer_type: "FILL_WITH_OUTLINE",
    display_legend: false,
    legend_suffix: "m",
    subgroup: "flooding_2015",
    minzoom: FLOODING_MIN_ZOOM,
    maxzoom: 18,
    filter: [">", ["to-number", ["get", `with_2015_TC_Tr_${RP}`]], 0],
  },
};

const currentRiskLayers = [
  LayerName.TESSELA_BOUNDS,
  LayerName.TESSELA_RPS_RISK_REDUCTION,
];

const annualBenefitsLayers = [
  LayerName.TESSELA_BOUNDS,
  LayerName.TESSELA_RPS_BENEFITS,
];

const reductRatioLayers = [
  LayerName.TESSELA_BOUNDS_RISK_REDUCTION,
  LayerName.HEX,
  LayerName.HEX2,
];

const floodingComparisonLayers: ConfigurableLayerMap = {
  [LayerName.MANGROVES_NOMANG]: {
    slidePosition: "right",
    sharedKey: "mangrove_extent",
    sharedLabel: "Show mangroves (2015)",
    associatedLayer: LayerName.FLOODING_NOMANG,
  },
  [LayerName.MANGROVES_2015]: {
    slidePosition: "left",
    sharedKey: "mangrove_extent",
    sharedLabel: "Show mangroves (2015)",
    associatedLayer: LayerName.FLOODING_2015,
  },
  [LayerName.FLOODING_NOMANG]: {
    slidePosition: "right",
    slideKey: "flooding",
    slideLabel: "No Mang.",
  },
  [LayerName.FLOODING_2015]: {
    slidePosition: "left",
    slideKey: "flooding",
    slideLabel: "2015 Mang.",
  },
};

const populationLayers = [
  LayerName.TESSELA_BOUNDS_POPULATION,
  LayerName.TESSELA_RPS_POPULATION,
];

const layerGroups: Record<LayerGroupName, LayerGroup> = {
  [LayerGroupName.CurrentRisk]: {
    name: LayerGroupName.CurrentRisk,
    shortDescription:
      "The current annual risk from flooding at the coast, including present mangroves.",
    IconComponent: () => (
      <Icon icon="mdi:hazard-lights" color="white" className="w-full h-full" />
    ),
    IconComponentHTML: `<iconify-icon icon="mdi:hazard-lights" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: currentRiskLayers,
    metricKey: `Risk_Stock_2015`,
    units: "in damage per year",
  },
  [LayerGroupName.BenefitAEB]: {
    name: LayerGroupName.BenefitAEB,
    shortDescription:
      "Annual Expected Benefit (AEB) is the flood risk reduced by mangroves annually in a location (in $).",
    IconComponent: () => (
      <Icon icon="ph:hand-coins" color="white" className="w-full h-full" />
    ),
    IconComponentHTML: `<iconify-icon icon="ph:hand-coins" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: annualBenefitsLayers,
    metricKey: `Ben_Stock_2015`,
    units: "in damage reduced per year",
  },
  [LayerGroupName.RiskReduction]: {
    name: LayerGroupName.RiskReduction,
    shortDescription:
      "The % of current annual flood risk reduced by mangroves.",
    IconComponent: () => (
      <Icon
        icon="lucide:git-compare"
        color="white"
        className="w-5/6 h-5/6 mx-auto"
      />
    ),
    IconComponentHTML: `<iconify-icon icon="lucide:git-compare" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: reductRatioLayers,
  },
  [LayerGroupName.Flooding]: {
    name: LayerGroupName.Flooding,
    shortDescription:
      "Flood Depth (m) with and without mangroves for 1 in 50 year storm event.",
    IconComponent: () => (
      <Icon
        icon="ri:flood-line"
        color="white"
        className="w-5/6 h-5/6 mx-auto"
      />
    ),
    IconComponentHTML: `<iconify-icon icon="ri:flood-line" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: floodingComparisonLayers,
  },
  [LayerGroupName.Population]: {
    name: LayerGroupName.Population,
    shortDescription:
      "Annual Expected Benefit (AEB) is the flood risk reduced by mangroves annually in a location (in avoided people exposed to flooding).",
    IconComponent: () => (
      <Icon
        icon="pepicons-pencil:people"
        color="white"
        className="w-full h-full -translate-y-1"
      />
    ),
    IconComponentHTML: `<iconify-icon icon="pepicons-pencil:people" class="breadcrumbs-icon" width="${BREADCRUMB_ICON_SIZE}px" height="${BREADCRUMB_ICON_SIZE}px"></iconify-icon>`,
    layers: populationLayers,
    metricKey: `Ben_Pop_2015`,
    units: "in reduced exposure per year",
  },
};

export const layersByGroup = Object.values(layerGroups).reduce(
  (acc, group) => {
    acc[group.name] = group.layers;
    return acc;
  },
  {} as Record<LayerGroupName, LayerName[] | ConfigurableLayerMap>,
);

export default layerGroups;
