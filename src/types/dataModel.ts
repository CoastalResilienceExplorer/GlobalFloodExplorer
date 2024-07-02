import {
  DiscreteColorSizeScale,
  SimpleColorScale,
} from "layers/colormaps/colormaps";

export enum LayerName {
  CurrentRisk = "Current Risk",
  BenefitAEB = "Benefit (Economic)",
  RiskReduction = "Risk Reduction Ratio",
  Flooding = "Flooding",
  Population = "Benefit (Social)",
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
};

export type LayerGroup = {
  name: LayerName;
  shortDescription: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  IconComponentHTML?: string;
  layers: Layer[];
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
  layerGroup?: LayerName;
};

export type Filter = [string, any, any];
