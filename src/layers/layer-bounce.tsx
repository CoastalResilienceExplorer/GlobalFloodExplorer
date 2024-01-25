import { createContext, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

export enum LayerSelectionFrom {
  init = "init",
  breadcrumb = "breadcrumb",
  layerSelectionPanel = "layerSelectionPanel",
}

type LayerBounceInfo = {
  layerGroupSelectedFrom: string;
  setLayerGroupSelectedFrom: Dispatch<SetStateAction<LayerSelectionFrom>>;
};

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
