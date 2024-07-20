import { LAYERS, layersByGroup } from "layers/layers";
import { memo, useEffect, useMemo, useState } from "react";
import { ConfigurableLayers, LayerGroupName, LayerName } from "types/dataModel";

interface LegendLayerSelectorProps {
  layerSelection: LayerSelection;
  toggleSelection: (layer: string) => void;
}

interface LayerSelection {
  [key: string]: boolean;
}

const titleCase = (s: string) =>
  s
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase());

export default memo(function LegendLayerSelector({
  layerSelection,
  toggleSelection,
}: LegendLayerSelectorProps) {
  return (
    <>
      {Object.entries(layerSelection).map(([layer, enabled]) => (
        <div key={layer}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => toggleSelection(layer)}
          />
          <label>
            {LAYERS[layer as LayerName]?.layer_toggle ?? titleCase(layer)}
          </label>
        </div>
      ))}
    </>
  );
});
