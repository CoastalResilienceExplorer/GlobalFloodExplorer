import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import getLayers from "./getLayer";

// Data
import sky from "./sky";
// PROTOS
import { LayerGroupName } from "types/dataModel";
import { useFilterContext } from "hooks/useFilters";

export function useLayers(
  map,
  mapLoaded,
  init_layer_group,
  init_subgroup,
  style,
  all_layers,
  all_sources,
  custom_protos,
  providedLayersToggle,
  id,
) {
  /**
   * Maintains the loaded sources and layers for a MapboxGL Map.  Allows for switching of groups of layers.
   * @param map  MapboxGL map
   * @param mapLoaded   Boolean state watcher to ensure the map is ready
   * @param init_layer_group Initial layer group to use
   * @param init_subgroup  Initial layer subgroup to use
   * @param style  Map style.  React State from useMap.  Layers must be reloaded when the style changes.
   * @param all_layers   An object mapping layer_groups to sets of layers
   * @param all_sources All sources used amongst layers
   * @param custom_protos  Custom layer parsers, which lets you create your own symbology.
   * @param layersToggle  A state to toggle layers on and off
   * @return {Object} layerGroup, layerSelectionDependencies, subgroup, subgroupOn, setLayerGroup, setSubgroup, layersToggle, toggleLayer
   */
  const [layerGroup, setLayerGroup] = useState(init_layer_group);
  const [subgroup, setSubgroup] = useState("");
  const [subgroupOn, setSubgroupOn] = useState(false);
  const layersRef = useRef([]);
  const viewportLockTimeout = useRef();

  const [layersToggle, setLayersToggle] = useState({});
  const layerToggleToUse = useMemo(
    () => providedLayersToggle ?? layersToggle,
    [providedLayersToggle, layersToggle],
  );
  const availableLayers = useMemo(
    () => all_layers[layerGroup],
    [all_layers, layerGroup],
  );

  useEffect(() => {
    if (Array.isArray(availableLayers) || providedLayersToggle) return;
    setLayersToggle(
      Object.keys(availableLayers).reduce((acc, layer) => {
        const key = availableLayers[layer]?.toggleKey ?? layer;
        if (availableLayers[layer]?.toggleKey) {
          const keys = Object.keys(availableLayers).filter(
            (l) => availableLayers[l]?.toggleKey === key,
          );
          acc[key] = keys.some((k) => acc[k]);
        } else if (availableLayers[layer]?.slideMapKey) {
          acc[key] =
            Object.entries(acc).findIndex(
              ([k, v]) =>
                availableLayers[k]?.slideMapKey ===
                  availableLayers[layer]?.slideMapKey && v,
            ) === -1;
        } else {
          acc[key] = true;
        }
        return acc;
      }, {}),
    );
  }, [availableLayers, providedLayersToggle]);

  const toggleLayer = useCallback(
    (layer) => {
      !providedLayersToggle &&
        setLayersToggle((prev) => {
          const newToggleState = { ...prev, [layer]: !prev[layer] };
          const sharedKey = availableLayers[layer]?.toggleKey;
          if (sharedKey) {
            Object.keys(availableLayers).forEach((l) => {
              if (availableLayers[l]?.sharedKey === sharedKey) {
                newToggleState[l] = newToggleState[layer];
              }
            });
          }
          return newToggleState;
        });
    },
    [availableLayers, providedLayersToggle],
  );

  const { activeFilters: filters } = useFilterContext();

  const layers_and_legends = useMemo(() => {
    const loggedLayers = Object.keys(layerToggleToUse).filter(
      (layer) => layerToggleToUse[layer] && !availableLayers[layer]?.toggleKey,
    );

    return getLayers(
      all_layers,
      layerGroup,
      { floodGroup: subgroup || loggedLayers[1] },
      custom_protos,
    );
  }, [
    layerToggleToUse,
    all_layers,
    layerGroup,
    subgroup,
    custom_protos,
    filters,
    availableLayers,
  ]);

  useEffect(() => {
    if (mapLoaded) {
      if (layerGroup === LayerGroupName.RiskReduction) {
        clearTimeout(viewportLockTimeout.current);
        map.setMaxPitch(75);
        map.dragRotate.enable();
      } else {
        map.setPitch(0);
        map.rotateTo(0, { animationDuration: 2000 });
        viewportLockTimeout.current = setTimeout(() => {
          map.setMaxPitch(0);
          map.dragRotate.disable();
        }, 2000);
      }
    }
  }, [layerGroup, mapLoaded]);

  const layers = useMemo(
    () =>
      !Array.isArray(availableLayers)
        ? layers_and_legends.layers.filter((layer) => {
            const toggleKey = availableLayers[layer.key]?.toggleKey;
            if (
              availableLayers[layer.key] === true ||
              !availableLayers[layer.key]
            ) {
              return true;
            }

            if (availableLayers[layer.key].slidePosition) {
              const associatedLayerName = Object.keys(availableLayers).find(
                (layerName) =>
                  availableLayers[layerName]?.slidePosition ===
                    availableLayers[layer.key].slidePosition &&
                  !!availableLayers[layerName]?.slideKey,
              );
              return (
                layerToggleToUse[associatedLayerName] &&
                (toggleKey
                  ? layerToggleToUse[toggleKey]
                  : layerToggleToUse[layer.key])
              );
            } else {
              return toggleKey
                ? layerToggleToUse[toggleKey] ?? layerToggleToUse[layer.key]
                : layerToggleToUse[layer.key];
            }
          })
        : layers_and_legends.layers,
    [layers_and_legends.layers, layerToggleToUse, availableLayers],
  );

  const layerSelectionDependencies = useMemo(
    () => layers_and_legends.selectionDependencies,
    [layers_and_legends],
  );

  function unloadLayers() {
    for (const existing of layersRef.current) {
      map.removeLayer(existing.id);
    }
  }

  function addSourcesAndSupps() {
    const existing_sources = map.getStyle().sources;
    for (const source of all_sources) {
      if (!Object.keys(existing_sources).includes(source[0])) {
        map.addSource(source[0], source[1]);
      }
    }
    map.setFog({ color: "rgba(255, 255, 255, 0.82)" });
  }

  function addLayers(layers_to_add) {
    for (const layer of layers_to_add) {
      map.addLayer(layer);
    }
    map.addLayer(sky);
    layersRef.current = [...layers_to_add, sky];
  }

  useEffect(() => {
    if (!mapLoaded) return;
    map.setStyle(style);
    map.on("style.load", () => {
      unloadLayers(layers);
      addSourcesAndSupps();
      addLayers(layers);
    });
  }, [style]);

  useEffect(() => {
    if (!mapLoaded) return;
    setSubgroupOn(
      layers.map((l) => l.id).filter((l) => l.includes("flooding")).length > 0,
    );
    unloadLayers(layers);
    addSourcesAndSupps();
    addLayers(layers);
  }, [mapLoaded, layers]);

  return {
    layerGroup,
    layerSelectionDependencies,
    subgroup,
    subgroupOn,
    setLayerGroup,
    setSubgroup,
    layersToggle: layerToggleToUse,
    toggleLayer,
  };
}
