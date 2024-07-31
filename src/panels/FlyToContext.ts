import { createContext } from "react";

import { LngLatBoundsLike } from "mapbox-gl";
import { Viewport } from "types/map";
import { LayerGroupName } from "types/dataModel";

const FlyToContext = createContext<{
  flyToViewport?: (viewport: Viewport) => void;
  flyToBounds?: (bounds: LngLatBoundsLike) => void;
  setLayerGroup?: (layerGroup: LayerGroupName) => void;
}>({});

export default FlyToContext;
