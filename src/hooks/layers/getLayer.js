export default function getLayers(layer_lookup, key, args, protos, filters) {
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
  const layersWithProtos = layers.map((l) => {
    const filters_to_add = Object.assign({}, { filter: filters[l.id] });
    return new protos[l.layer_type](Object.assign(l, args, filters_to_add));
  });
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
