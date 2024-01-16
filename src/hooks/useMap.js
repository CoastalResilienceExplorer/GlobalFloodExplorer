import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { getViewport } from "./utils/viewportUtils";
import { BasemapMap, BasemapStyle } from "basemap_manager/BasemapManager";

export function useMap(init_viewport, access_token) {
  mapboxgl.accessToken = access_token;
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewport, setViewport] = useState(init_viewport);

  const initTheme = useMemo(() => {
    if (window.matchMedia) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return BasemapStyle.Dark;
      } else {
        return BasemapStyle.Light;
      }
    } else {
      return BasemapStyle.Light;
    }
  }, []);

  const [style, setStyle] = useState(BasemapMap[initTheme]);

  function flyToViewport(viewport) {
    console.log(viewport);
    const viewport_formatted = {
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      bearing: viewport.bearing,
      pitch: viewport.pitch,
      transitionDuration: viewport.transitionDuration,
    };
    map.flyTo(viewport_formatted);
  }

  function flyToBounds(bounds) {
    map.fitBounds(bounds);
  }

  useEffect(() => {
    if (map) return; // initialize map only once
    if (!mapContainer.current) return;
    setMap(
      new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: [viewport.longitude, viewport.latitude],
        bearing: viewport.bearing,
        pitch: viewport.pitch,
        zoom: viewport.zoom,
        boxZoom: false,
      }),
    );
  }, []);

  useEffect(() => {
    if (!map) return;
    map.on("load", () => {
      map.getCanvas().style.cursor = "pointer";
      map.setRenderWorldCopies(true);
      map.flyToViewport = flyToViewport;
      map.flyToBounds = flyToBounds;

      map.on("move", () => {
        setViewport(getViewport(map));
      });

      setMapLoaded(true);
    });
  }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    map,
    mapContainer,
    mapLoaded,
    viewport,
    style,
    setStyle,
    setViewport,
    flyToViewport,
    flyToBounds,
  };
}
