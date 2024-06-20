import mapboxgl, { LngLatBoundsLike } from "mapbox-gl";

export interface Viewport {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  transitionDuration: number;
}

export interface Map extends mapboxgl.Map {
  flyToViewport?: (viewport: Viewport) => void;
  flyToBounds?: (bounds: LngLatBoundsLike) => void;
}
