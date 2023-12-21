import {
  DiscreteColorSizeScale,
  SimpleColorScale,
} from "layers/colormaps/colormaps";

export enum LayerName {
  BenefitAEB = "Benefit (EAB)",
  RiskReduction = "Risk Reduction Ratio",
  Flooding = "Flooding",
  SHDI = "SHDI",
  MangLoss = "Mangrove Loss",
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
  layers: Layer[];
};

export type Filter = [string, any, any];
