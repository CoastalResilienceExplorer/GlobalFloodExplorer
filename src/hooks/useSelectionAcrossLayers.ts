import layerGroups, { LAYERS, layersByGroup } from "layers/layers";
import { useEffect, useRef, useState } from "react";
import { Layer, LayerGroupName, LayerName } from "types/dataModel";
import { setFeatureState_withDependencies } from "./useSelection";

export function useSelectionSync(
  layerGroup: LayerGroupName,
  selectionBuffer: any[],
  setSelectedFeatures: any,
  map: mapboxgl.Map,
) {
  const previousLayer = useRef();

  useEffect(() => {
    if (!map) return;
    if (layerGroup == LayerGroupName.Flooding) return;

    const selectedLayers = [
      ...(layerGroups[layerGroup].layers as LayerName[]),
      ...selectionBuffer.map((s) => s.sourceLayer),
    ];
    const _selectionSync = (layerGroups[layerGroup].layers as LayerName[])
      .map((l) => LAYERS[l])
      .filter((l) => l.selection_sync_with !== undefined)
      .map((l) => {
        return [l.id, l.selection_sync_with];
      })
      .filter((s) => selectedLayers.includes(s[1]));

    // @ts-ignore
    const selectionSync = [...new Set([..._selectionSync])];

    map.once("idle", () => {
      const _data = selectionSync
        .map((ss) => {
          return map.queryRenderedFeatures(
            // @ts-ignore
            { layers: [ss[0]] },
          );
        })
        .flat()
        .filter((d) => selectionBuffer.map((s) => s.id).includes(d.id));
      const uniqueData = _data.reduce((acc, current) => {
        // @ts-ignore
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          // @ts-ignore
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      if (uniqueData.length > 0) {
        setSelectedFeatures(uniqueData);
      }
    });
  }, [layerGroup]);
}
