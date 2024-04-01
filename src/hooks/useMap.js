import { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { getViewport } from "./utils/viewportUtils";

export function useMap(init_viewport, access_token, theme) {
  mapboxgl.accessToken = access_token;
  const [viewport, setViewport] = useState(init_viewport);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const flyToViewport = useCallback((viewport) => {
    const viewport_formatted = {
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      bearing: viewport.bearing,
      pitch: viewport.pitch,
      transitionDuration: viewport.transitionDuration,
    };
    map.current?.flyTo(viewport_formatted);
  }, []);

  const flyToBounds = useCallback((bounds) => {
    map.current?.fitBounds(bounds);
  }, []);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme,
      center: [viewport.longitude, viewport.latitude],
      bearing: viewport.bearing,
      pitch: viewport.pitch,
      zoom: viewport.zoom,
      boxZoom: false,
    });

    // set map.current event listeners
    map.current.on("load", () => {
      setMapLoaded(true);
      map.current.setRenderWorldCopies(true);
      map.current.on("move", () => {
        setViewport(getViewport(map.current));
      });
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
