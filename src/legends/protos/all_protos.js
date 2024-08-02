import DiscretePointLegend from "./DiscretePointLegend";
import InterpolateLegend from "./InterpolateLegend";
import HexLegend from "./HexLegend";

export const all_protos = Object.assign(
  { DISCRETE_POINT: DiscretePointLegend },
  { RASTER: InterpolateLegend },
  { RASTER2: InterpolateLegend },
  { HEX_3D: HexLegend },
  { GEO_POINT: DiscretePointLegend },
  { FILL_WITH_OUTLINE: DiscretePointLegend },
);
