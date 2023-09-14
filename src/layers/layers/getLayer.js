// LAYERS
import layer_lookup from "../../data/layers";
// PROTOS
import DiscretePointProto from "../protos/DiscretePointProto";
import SimpleOutlineProto from "../protos/SimpleOutlineProto";
import FillWithOutlineProto from "../protos/FillWithOutlineProto";
import RasterInterpolatedProto from "../protos/RasterInterpolatedProto";
import HexLayerProto from "../protos/FillExtrusionBase";
import GeoScaledPointProto from "../protos/GeoScaledPointProto";
import RasterProto from "layers/protos/RasterProto";

const protos = Object.assign(
  { DISCRETE_POINT: DiscretePointProto },
  { SIMPLE_OUTLINE: SimpleOutlineProto },
  { FILL_WITH_OUTLINE: FillWithOutlineProto },
  { RASTER: RasterInterpolatedProto },
  { HEX_3D: HexLayerProto },
  { GEO_POINT: GeoScaledPointProto },
  { RASTER2: RasterProto }
);

export default function getLayers(key, args) {
  const layers = layer_lookup[key];

  if (!layers || !layers[0])
    return {
      legends: [],
      layers: [],
    };

  const selectionDependencies = layers
    .filter((l) => l.selection_dependent_on)
    .map((l) => [l.selection_dependent_on, l.source_layer]);
  const subgroups = layers.filter((l) => l.is_subgroup);
  const layersWithProtos = layers.map(
    (l) => new protos[l.layer_type](Object.assign(l, args)),
  );
  const layers_to_return = layersWithProtos.map((l) => l.MBLayer);
  const legends_to_return = layersWithProtos
    .filter((l) => l.display_legend)
    .map((l) => l.Legend);

  return {
    legends: legends_to_return,
    layers: layers_to_return,
    selectionDependencies: selectionDependencies,
    subgroups: subgroups,
  };
}
