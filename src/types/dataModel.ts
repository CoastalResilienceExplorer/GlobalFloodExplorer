import {
  DiscreteColorSizeScale,
  SimpleColorScale,
} from "layers/colormaps/colormaps";

export enum LayerGroupName {
  CurrentRisk = "Current Risk",
  BenefitAEB = "Benefit (Economic)",
  RiskReduction = "Risk Reduction Ratio",
  Flooding = "Flooding",
  Population = "Benefit (Social)",
}

export type Filter = [string, any, any];

export enum LayerName {
  // Existing Risk
  TESSELA_BOUNDS_EXISTING_RISK = "tessela_bounds_existing_risk",
  TESSELA_RPS_EXISTING_RISK = "tessela_rps_existing_risk",
  // Stock Benefits
  TESSELA_BOUNDS_STOCK_BENEFITS = "tessela_bounds_stock_benefits",
  TESSELA_RPS_STOCK_BENEFITS = "tessela_rps_stock_benefits",
  // Pop Benefits
  TESSELA_BOUNDS_POPULATION_BENEFITS = "tessela_bounds_population_benefits",
  TESSELA_RPS_POPULATION_BENEFITS = "tessela_rps_population_benefits",
  // Risk Reduction Ratio
  TESSELA_BOUNDS_RISK_REDUCTION_RATIO = "tessela_bounds_risk_reduction_ratio",
  HEX = "hex",
  HEX2 = "hex2",
  // Flooding
  MANGROVES_NOMANG = "mangroves_nomang",
  MANGROVES_2015 = "mangroves_2015",
  FLOODING_NOMANG = "flooding_nomang",
  FLOODING_2015 = "flooding_2015",
}

export type Layer = {
  id: string;
  source: string;
  source_layer: string;
  colorValue?: any;
  heightValue?: any;
  baseValue?: any;
  scale?: number;
  legend:
    | InstanceType<typeof DiscreteColorSizeScale>
    | InstanceType<typeof SimpleColorScale>;
  layer_title: string;
  layer_subtitle?: string;
  layer_toggle?: string;
  layer_type: string;
  legend_prefix?: string;
  legend_suffix?: string;
  format?: string;
  display_legend?: boolean;
  is_selectable?: boolean;
  selection_dependent_on?: string;
  is_subgroup?: boolean;
  subgroup?: string;
  minzoom?: number;
  maxzoom?: number;
  opacity?: number;
  hex_type?: string;
  filter?: Filter;
  selection_sync_with?: string;
};

export type SlideLayer = {
  slideKey: string;
  slidePosition: "left" | "right" | "both";
  slideLabel: string;
};

export type ToggleLayer = {
  toggleKey: string;
  toggleLabel?: string;
  slidePosition?: "left" | "right" | "both";
};

export type StableLayer = true;

export type ConfigurableLayer = SlideLayer | ToggleLayer | StableLayer;

export type ConfigurableLayerMap = {
  [key in LayerName]?: ConfigurableLayer;
};

export type LayerGroup = {
  name: LayerGroupName;
  shortDescription: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  IconComponentHTML?: string;
  layers: LayerName[] | ConfigurableLayerMap;
  metricKey?: string;
  units?: string;
};

type LatLonArray = [number, number];
type BoundingBox = [LatLonArray, LatLonArray];

export type AOI = {
  id: string;
  overview: {
    latitude: number;
    longitude: number;
    bearing: number;
    pitch?: number;
    zoom: number;
    transitionDuration?: number;
  };
  location_awareness: {
    bbox?: BoundingBox;
    marker: LatLonArray;
    minzoom: number;
    maxzoom: number;
  };
  parent?: string;
  size?: number;
  description?: string;
  layerGroup?: LayerGroupName;
};
