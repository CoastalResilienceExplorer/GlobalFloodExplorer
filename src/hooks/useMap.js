import { useState, useEffect, useRef } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { getViewport } from "./utils/viewportUtils";

export function useMap(init_viewport, access_token, theme) {
  mapboxgl.accessToken = access_token;
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewport, setViewport] = useState(init_viewport);

  function flyToViewport(viewport) {
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
        style: theme,
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
    if (process.env.NODE_ENV === "development") {
      map.on("click", () => console.log(map));
    }
  }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    map,
    mapContainer,
    mapLoaded,
    viewport,
    setViewport,
    flyToViewport,
    flyToBounds,
  };
}
