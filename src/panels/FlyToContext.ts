import { createContext } from "react";

import { LngLatBoundsLike } from "mapbox-gl";
import { Viewport } from "types/map";
import { LayerName } from "types/dataModel";

const FlyToContext = createContext<{
  flyToViewport?: (viewport: Viewport) => void;
  flyToBounds?: (bounds: LngLatBoundsLike) => void;
  setLayerGroup?: (layerGroup: LayerName) => void;
}>({});

export default FlyToContext;
