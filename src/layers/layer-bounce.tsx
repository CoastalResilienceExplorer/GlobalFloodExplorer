import { createContext, useContext } from "react";
import { useState } from "react";

export const LAYER_BOUNCE_OPEN_TIMEOUT = 3000;
export const LAYER_BOUNCE_FLASH_TIMEOUT = 6000;

export enum LayerSelectionFrom {
  init = "init",
  breadcrumb = "breadcrumb",
  layerSelectionPanel = "layerSelectionPanel",
  reset = "reset",
}

export const LayerBounceContext = createContext({
  layerGroupSelectedFrom: LayerSelectionFrom.init,
  setLayerGroupSelectedFrom: (action: any) => {},
});

export const useLayerBounceContext = () => useContext(LayerBounceContext);

export function useLayerBounce() {
  const [layerGroupSelectedFrom, setLayerGroupSelectedFrom] = useState(
    LayerSelectionFrom.init,
  );

  return {
    layerGroupSelectedFrom,
    setLayerGroupSelectedFrom,
  };
}
