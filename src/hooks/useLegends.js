// import 'react'
import { useMemo } from "react";

import getLayers from "./layers/getLayer";
import { useFilterContext } from "./useFilters";

export function useLegends(
  layerGroup,
  subgroup,
  mapLoaded,
  layers,
  custom_layer_protos,
) {
  const { activeFilters: filters } = useFilterContext();

  const legends = useMemo(() => {
    return getLayers(
      layers,
      layerGroup,
      { floodGroup: subgroup },
      custom_layer_protos,
      filters,
    ).legends;
  }, [layerGroup, subgroup, mapLoaded]);

  return {
    legends,
  };
}
