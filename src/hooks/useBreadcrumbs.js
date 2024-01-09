import { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useInfo } from "hooks/useInfo";
import { useInfoContext } from "hooks/useInfo";
import infoReducer from "../info/infoReducer";
import initialInfo from "../info/initialInfo";

const TIMEOUT = 3000;

export function useBreadcrumbs(aois, viewport) {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const previousBreadcrumbs = useRef([]);

  function getBreadcrumbs(viewport) {
    previousBreadcrumbs.current = breadcrumbs;
    function formatBB(area) {
      return {
        lng: {
          min: Math.min(area[0][0], area[1][0]),
          max: Math.max(area[0][0], area[1][0]),
        },
        lat: {
          min: Math.min(area[0][1], area[1][1]),
          max: Math.max(area[0][1], area[1][1]),
        },
      };
    }

    function testContains(area, vp) {
      const bbox = formatBB(area);
      if (
        vp.longitude > bbox.lng.min &&
        vp.longitude < bbox.lng.max &&
        vp.latitude > bbox.lat.min &&
        vp.latitude < bbox.lat.max
      ) {
        return true;
      }
    }

    const parents = aois
      .filter((x) => !x.parent)
      .filter((p) => testContains(p.location_awareness.bbox, viewport));
    if (parents.length === 0) {
      return [];
    }

    const children = aois
      .filter((c) => c.parent === parents[0].id)
      .filter((c) => testContains(c.location_awareness.bbox, viewport));
    if (children.length === 0) return [parents[0]];
    return [parents[0], children[0]];
  }

  useEffect(() => {
    setBreadcrumbs(getBreadcrumbs(viewport));
  }, [viewport]); // eslint-disable-line react-hooks/exhaustive-deps

  return breadcrumbs;
}

function MarkerWithHook(aoi, map, setIsHovering, setPayload) {
  console.log(aoi);
  const size = aoi.size;
  var el = document.createElement("div");
  const src = `<img src="/images/important.svg" height="${size}px" width="${size}px" alt="My Happy SVG"/>`;
  el.innerHTML = src;
  el.className = "marker";

  // create the marker
  const m = new mapboxgl.Marker(el)
    .setLngLat(aoi.location_awareness.marker)
    .addTo(map);

  el.addEventListener(
    "click",
    (e) => {
      map.flyToBounds(aoi.location_awareness.bbox);
      e.stopImmediatePropagation();
    },
    false,
  );
  el.addEventListener(
    "mouseover",
    (e) => {
      console.log("hovering");
      if (aoi.description) {
        setPayload(aoi.description);
      } else {
        setPayload(aoi.id);
      }
      setTimeout(() => {
        setIsHovering(false);
      }, TIMEOUT);
    },
    false,
  );
  el.addEventListener(
    "mouseleave",
    (e) => {
      console.log("hovering");
      setTimeout(() => {
        setIsHovering(false);
      }, TIMEOUT);
    },
    false,
  );
  return m;
}

export function useMapWithBreadcrumbs(viewport, aois, map, useEvery) {
  const [aoisToPlace, setAoisToPlace] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [payload, setPayload] = useState(false);
  const payloadRef = useRef(null);

  useEffect(() => {
    if (!payload) return;
    payloadRef.current = payload;
    setIsHovering(true);
    setTimeout(() => {
      setIsHovering(false);
      setPayload(false);
    }, TIMEOUT);
  }, [payload]);

  useEvery(() => isHovering, "FIRST_HOVER", undefined, payloadRef.current);

  useEffect(() => {
    const filtered_aois = aois.filter((aoi) => {
      return (
        viewport.zoom >= aoi.location_awareness.minzoom &&
        viewport.zoom <= aoi.location_awareness.maxzoom
      );
    });
    setAoisToPlace(filtered_aois);
  }, [viewport]);

  useEffect(() => {
    if (aoisToPlace.length === 0) return;
    markers.map((m) => m.remove());
    // create DOM element for the marker
    console.log(aoisToPlace);
    const _markers = aoisToPlace.map((aoi) =>
      MarkerWithHook(aoi, map, setIsHovering, setPayload),
    );
    setMarkers(_markers);
  }, [aoisToPlace]);
}
