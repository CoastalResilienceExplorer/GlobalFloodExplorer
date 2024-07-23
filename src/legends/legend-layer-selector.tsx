import { TripleSwitch, TripleSwitchOption } from "components/triple-switch";
import { LAYERS, layersByGroup } from "layers/layers";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  ConfigurableLayerMap,
  LayerGroupName,
  LayerName,
} from "types/dataModel";

interface LegendLayerSelectorProps {
  layersToggle: LayerSelection;
  toggleLayer: (layer: string) => void;
  layerGroup: LayerGroupName;
}

const getLayerGroup = (layerGroup: LayerGroupName) =>
  layersByGroup[layerGroup] as ConfigurableLayerMap;

const getLayerConfig = (layerGroup: LayerGroupName, layerKey: LayerName) =>
  getLayerGroup(layerGroup)[layerKey];

type GroupedLayers = Partial<Record<string, LayerName[]>>;

interface LayerSelection {
  [key: string]: boolean;
}

export default memo(function LegendLayerSelector({
  layersToggle,
  toggleLayer,
  layerGroup,
}: LegendLayerSelectorProps) {
  const sharedKeyLayers = useMemo(() => {
    const layers = (
      Object.keys(layersByGroup[layerGroup]) as LayerName[]
    ).filter((layerKey) => !!getLayerConfig(layerGroup, layerKey)?.sharedKey);
    const groupedLayers: GroupedLayers = Object.groupBy(
      layers,
      (layerKey) =>
        getLayerConfig(layerGroup, layerKey)?.sharedKey ?? "not-shared",
    );
    return groupedLayers;
  }, [layerGroup]);

  const slideMapLayers = useMemo(() => {
    const layers = (
      Object.keys(layersByGroup[layerGroup]) as LayerName[]
    ).filter((layerKey) => !!getLayerConfig(layerGroup, layerKey)?.slideKey);
    const groupedLayers: GroupedLayers = Object.groupBy(
      layers,
      (layerKey) =>
        getLayerConfig(layerGroup, layerKey)?.slideKey ?? "not-slide",
    );
    return Object.fromEntries(
      Object.entries(groupedLayers).map(([key, layers]) => [
        key,
        layers?.sort((a, b) => {
          const aPos = getLayerConfig(layerGroup, a)?.slidePosition;
          const bPos = getLayerConfig(layerGroup, b)?.slidePosition;
          return aPos === bPos ? 0 : aPos === "left" ? -1 : 1;
        }),
      ]),
    );
  }, [layerGroup]);

  const handleSwitchUpdate = useCallback(
    (key: string) => (value: string | number) => {
      console.log("key", key);
      console.log("value", value);
    },
    [],
  );

  return (
    <>
      {Object.entries(slideMapLayers).map(([key, layers]) => (
        <div key={key}>
          {layers?.length && (
            <>
              <TripleSwitch onChange={handleSwitchUpdate(key)}>
                <TripleSwitchOption
                  title={
                    (layersByGroup[layerGroup] as ConfigurableLayerMap)[
                      layers[0]
                    ]?.slideLabel ?? ""
                  }
                  value={layers[0]}
                  position="left"
                />
                <TripleSwitchOption
                  title="both"
                  value="compare"
                  position="center"
                />
                <TripleSwitchOption
                  title={
                    (layersByGroup[layerGroup] as ConfigurableLayerMap)[
                      layers[1]
                    ]?.slideLabel ?? ""
                  }
                  value={layers[1]}
                  position="right"
                />
              </TripleSwitch>
            </>
          )}
        </div>
      ))}

      {Object.entries(sharedKeyLayers).map(([key, layers]) => (
        <div key={key}>
          <input
            type="checkbox"
            checked={layers?.some((layer) => layersToggle[layer])}
            onChange={() => layers?.forEach((layer) => toggleLayer(layer))}
          />
          <label>{key}</label>
        </div>
      ))}
    </>
  );
});
