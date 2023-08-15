import DiscretePointLegend from "./DiscretePointLegend";
import InterpolateLegend from "./InterpolateLegend";
import HexLegend from "./HexLegend";

export const all_protos = Object.assign(
  { DISCRETE_POINT: DiscretePointLegend },
  { RASTER: InterpolateLegend },
  { HEX_3D: HexLegend },
  { GEO_POINT: DiscretePointLegend },
);
