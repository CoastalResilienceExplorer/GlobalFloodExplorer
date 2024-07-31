import { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl, { LngLatBoundsLike, LngLatLike } from "mapbox-gl";

import { getViewport } from "./utils/viewportUtils";
import { Map, Viewport } from "types/map";

export function useMap(
  init_viewport: Viewport,
  access_token: string,
  theme: string,
) {
  mapboxgl.accessToken = access_token;
  const [viewport, setViewport] = useState(init_viewport);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapLoadCount = useRef(0);
  const map = useRef<Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const flyToViewport = useCallback((viewport: Viewport) => {
    const viewport_formatted = {
      center: [viewport.longitude, viewport.latitude] as LngLatLike,
      zoom: viewport.zoom,
      bearing: viewport.bearing,
      pitch: viewport.pitch,
      transitionDuration: viewport.transitionDuration,
    };
    map.current?.flyTo(viewport_formatted);
  }, []);

  const flyToBounds = useCallback((bounds: LngLatBoundsLike) => {
    map.current?.fitBounds(bounds);
  }, []);

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: theme,
      center: [viewport.longitude, viewport.latitude],
      bearing: viewport.bearing,
      pitch: viewport.pitch,
      zoom: viewport.zoom,
      boxZoom: false,
    }) as mapboxgl.Map;

    // set map.current event listeners
    map.current.on("load", () => {
      mapLoadCount.current += 1;
      if (mapLoadCount.current === 1) {
        setMapLoaded(true);
        map.current?.setRenderWorldCopies(true);
        map.current?.on("move", () => {
          setViewport(getViewport(map.current) as Viewport);
        });
      }
    });

    // set custom map.current methods
    map.current.flyToViewport = flyToViewport;
    map.current.flyToBounds = flyToBounds;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- don't need to reinitialize for viewport updates
  }, []);

  // update custom map.current methods
  useEffect(() => {
    if (map.current) {
      map.current.flyToViewport = flyToViewport;
      map.current.flyToBounds = flyToBounds;
    }
  }, [flyToBounds, flyToViewport]);

  return {
    map: map.current,
    mapContainer,
    mapLoaded,
    viewport,
    setViewport,
    flyToViewport,
    flyToBounds,
  };
}
