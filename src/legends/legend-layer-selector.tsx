import { TripleSwitch, TripleSwitchOption } from "components/triple-switch";
import { layersByGroup } from "layers/layers";
import { memo, useCallback, useMemo } from "react";
import {
  ConfigurableLayer,
  ConfigurableLayerMap,
  ConfigurableSharedLayer,
  ConfigurableSlideLayer,
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

const getLayerConfig = <T extends ConfigurableLayer>(
  layerGroup: LayerGroupName,
  layerKey: LayerName,
) => getLayerGroup(layerGroup)[layerKey] as T;

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
    ).filter(
      (layerKey) =>
        getLayerConfig(layerGroup, layerKey)?.hasOwnProperty("sharedKey"),
    );
    const groupedLayers: GroupedLayers = Object.groupBy(
      layers,
      (layerKey) =>
        getLayerConfig<ConfigurableSharedLayer>(layerGroup, layerKey)
          ?.sharedKey ?? "not-shared",
    );
    return groupedLayers;
  }, [layerGroup]);

  const slideMapLayers = useMemo(() => {
    const layers = (
      Object.keys(layersByGroup[layerGroup]) as LayerName[]
    ).filter(
      (layerKey) =>
        getLayerConfig(layerGroup, layerKey)?.hasOwnProperty("slideKey"),
    );
    const groupedLayers: GroupedLayers = Object.groupBy(
      layers,
      (layerKey) =>
        getLayerConfig<ConfigurableSlideLayer>(layerGroup, layerKey)
          ?.slideKey ?? "not-slide",
    );
    return Object.fromEntries(
      Object.entries(groupedLayers).map(([key, layers]) => [
        key,
        layers?.sort((a, b) => {
          const aPos = getLayerConfig<ConfigurableSlideLayer>(layerGroup, a)
            ?.slidePosition;
          const bPos = getLayerConfig<ConfigurableSlideLayer>(layerGroup, b)
            ?.slidePosition;
          return aPos === bPos ? 0 : aPos === "left" ? -1 : 1;
        }),
      ]),
    );
  }, [layerGroup]);

  const handleSwitchUpdate = useCallback(
    (key: string) => (value: string | number) => {
      if (value === "compare") {
        slideMapLayers[key]?.forEach((layer) => {
          if (!layersToggle[layer]) {
            toggleLayer(layer);
          }
        });
      } else {
        slideMapLayers[key]?.forEach((layer) => {
          if (layer === value && !layersToggle[layer]) {
            toggleLayer(layer);
          } else if (layer !== value && layersToggle[layer]) {
            toggleLayer(layer);
          }
        });
      }
    },
    [layersToggle, slideMapLayers, toggleLayer],
  );

  return (
    <>
      {Object.entries(slideMapLayers).map(([key, layers]) => (
        <div key={key}>
          {layers?.length && (
            <>
              <TripleSwitch
                onChange={handleSwitchUpdate(key)}
                selection={
                  layersToggle[layers[0]] && layersToggle[layers[1]]
                    ? "compare"
                    : layersToggle[layers[0]]
                    ? layers[0]
                    : layersToggle[layers[1]]
                    ? layers[1]
                    : layers[0]
                }
              >
                <TripleSwitchOption
                  title={
                    getLayerConfig<ConfigurableSlideLayer>(
                      layerGroup,
                      layers[0],
                    )?.slideLabel ?? ""
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
                    getLayerConfig<ConfigurableSlideLayer>(
                      layerGroup,
                      layers[1],
                    )?.slideLabel ?? ""
                  }
                  value={layers[1]}
                  position="right"
                />
              </TripleSwitch>
              <div className="h-[1px] w-full border-t border-dashed border-gray-200" />
            </>
          )}
        </div>
      ))}

      {Object.entries(sharedKeyLayers).map(
        ([key, layers]) =>
          layers && (
            <div key={key}>
              <input
                type="checkbox"
                checked={layersToggle[key]}
                onChange={() => toggleLayer(key)}
              />
              <label>
                {
                  getLayerConfig<ConfigurableSharedLayer>(layerGroup, layers[0])
                    ?.sharedLabel
                }
              </label>
            </div>
          ),
      )}
    </>
  );
});
