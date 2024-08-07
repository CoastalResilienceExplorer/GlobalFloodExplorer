import { TripleSwitch, TripleSwitchOption } from "components/triple-switch";
import { LAYERS, layersByGroup } from "layers/layers";
import { memo, useCallback, useMemo } from "react";
import {
  ConfigurableLayer,
  ConfigurableLayerMap,
  LayerGroupName,
  LayerName,
  SlideLayer,
  ToggleLayer,
} from "types/dataModel";
import "./legend-layer-selector.css";
import { DiscreteColorSizeScale } from "layers/colormaps/colormaps";

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

export const LegendLayerSwitch = ({
  layersToggle,
  toggleLayer,
  layerGroup,
}: LegendLayerSelectorProps) => {
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
        getLayerConfig<SlideLayer>(layerGroup, layerKey)?.slideKey ??
        "not-slide",
    );
    return Object.fromEntries(
      Object.entries(groupedLayers).map(([key, layers]) => [
        key,
        layers?.sort((a, b) => {
          const aPos = getLayerConfig<SlideLayer>(layerGroup, a)?.slidePosition;
          const bPos = getLayerConfig<SlideLayer>(layerGroup, b)?.slidePosition;
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

  if (Object.keys(slideMapLayers).length === 0) {
    return null;
  }

  return (
    <div className="legend-layer-switch">
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
                    getLayerConfig<SlideLayer>(layerGroup, layers[0])
                      ?.slideLabel ?? ""
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
                    getLayerConfig<SlideLayer>(layerGroup, layers[1])
                      ?.slideLabel ?? ""
                  }
                  value={layers[1]}
                  position="right"
                />
              </TripleSwitch>
              <div className="h-[1px] mt-2 w-full border-t border-dashed border-gray-200" />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export const LegendLayerToggle = ({
  layersToggle,
  toggleLayer,
  layerGroup,
}: LegendLayerSelectorProps) => {
  const togglableLayers = useMemo(() => {
    const layers = (
      Object.keys(layersByGroup[layerGroup]) as LayerName[]
    ).filter(
      (layerKey) =>
        getLayerConfig(layerGroup, layerKey)?.hasOwnProperty("toggleKey"),
    );
    const groupedLayers: GroupedLayers = Object.groupBy(
      layers,
      (layerKey) =>
        getLayerConfig<ToggleLayer>(layerGroup, layerKey)?.toggleKey ??
        "not-shared",
    );
    return groupedLayers;
  }, [layerGroup]);

  const legendColor = useMemo(() => {
    const builtColorMap: Record<string, string> = {};
    Object.keys(LAYERS).forEach((key) => {
      const layerConfig = getLayerConfig<ToggleLayer>(
        layerGroup,
        key as LayerName,
      );
      if (layerConfig?.toggleKey) {
        if (layerConfig.slidePosition) {
          // Find any associated slide layers
          const associatedLayerName = Object.keys(LAYERS).find((layerName) => {
            const slideConfig = getLayerConfig<SlideLayer>(
              layerGroup,
              layerName as LayerName,
            );
            return (
              slideConfig?.slidePosition === layerConfig.slidePosition &&
              !!slideConfig?.slideKey
            );
          });
          if (associatedLayerName) {
            // check if layer is toggled
            if (layersToggle[associatedLayerName as LayerName]) {
              const legend = LAYERS[key as LayerName].legend as InstanceType<
                typeof DiscreteColorSizeScale
              >;
              builtColorMap[key] = legend.colorRamp?.[0];
            }
          }
        } else {
          const legend = LAYERS[key as LayerName].legend as InstanceType<
            typeof DiscreteColorSizeScale
          >;
          builtColorMap[key] = legend.colorRamp?.[0];
        }
      }
    });

    return Object.keys(builtColorMap).length < 1
      ? "blue"
      : Object.keys(builtColorMap).length === 1
      ? builtColorMap[Object.keys(builtColorMap)[0]]
      : builtColorMap[Object.keys(builtColorMap)[1]];
  }, [layerGroup, layersToggle]);

  if (Object.keys(togglableLayers).length === 0) {
    return null;
  }

  return (
    <div className="legend-layer-toggle">
      {Object.entries(togglableLayers).map(
        ([key, layers]) =>
          layers && (
            <div key={key} className="mt-4">
              <label className="text-sm custom-checkbox">
                <input
                  type="checkbox"
                  checked={layersToggle[key]}
                  onChange={() => toggleLayer(key)}
                  className="mr-2"
                />
                <span
                  className="checkmark"
                  style={{
                    backgroundColor: legendColor,
                    borderColor: legendColor,
                  }}
                />
                <span className="checkmark-label">
                  {
                    getLayerConfig<ToggleLayer>(layerGroup, layers[0])
                      ?.toggleLabel
                  }
                </span>
              </label>
            </div>
          ),
      )}
    </div>
  );
};
