import { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useInfoContext } from "hooks/useInfo";
import layerGroups from "layers/layers";

export const HOVER_TIMEOUT = 1000;
export const BREADCRUMB_ICON_SIZE = 30;
const LEAVE_TIMEOUT = 1000;

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

function MarkerWithHook(aoi, map, setIsHovering, setPayload, setLayerGroup) {
  const size = aoi.size;
  var el = document.createElement("div");
  // const src = `<img src="/images/important.svg" height="${size}px" width="${size}px" alt="My Happy SVG"/>`;
  const src = layerGroups[aoi.layerGroup].IconComponentHTML;
  const component = `
    <div className='breadcrumbs-icon-container'>${src}</div>
  `;
  el.innerHTML = component;
  el.className = "marker";

  // create the marker
  const m = new mapboxgl.Marker(el)
    .setLngLat(aoi.location_awareness.marker)
    .addTo(map);

  el.addEventListener(
    "click",
    (e) => {
      setLayerGroup(aoi.layerGroup);
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
      setIsHovering(aoi.id);
    },
    false,
  );
  el.addEventListener(
    "mouseleave",
    (e) => {
      setIsHovering(false);
    },
    false,
  );
  m.aoi_id = aoi.id;
  return m;
}

export function useMapWithBreadcrumbs(
  viewport,
  aois,
  map,
  setLayerGroup,
  useWhile,
) {
  const [aoisToPlace, setAoisToPlace] = useState([]);
  const [aoisToRemove, setAoisToRemove] = useState([]);
  const [aoisActive, setAoisActive] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [payload, setPayload] = useState(false);
  const payloadRef = useRef(null);

  useEffect(() => {
    if (!payload) return;
    payloadRef.current = payload;
  }, [payload]);

  useEffect(() => {
    if (isHovering && !markers.map((m) => m.aoi_id).includes(isHovering)) {
      setTimeout(() => setIsHovering(false), HOVER_TIMEOUT);
    }
  }, [markers, isHovering]);

  useWhile.on(
    () => isHovering,
    [isHovering],
    "FIRST_HOVER",
    undefined,
    payloadRef.current,
    0,
  );

  useWhile.off(
    () => !isHovering,
    [isHovering],
    "FIRST_HOVER",
    undefined,
    HOVER_TIMEOUT,
  );

  useEffect(() => {
    const filtered_aois_in = aois.filter((aoi) => {
      return (
        viewport.zoom >= aoi.location_awareness.minzoom &&
        viewport.zoom <= aoi.location_awareness.maxzoom
      );
    });
    const filtered_aois_out = aois.filter((aoi) => {
      return (
        viewport.zoom <= aoi.location_awareness.minzoom ||
        viewport.zoom >= aoi.location_awareness.maxzoom
      );
    });
    setAoisToPlace(filtered_aois_in);
    setAoisToRemove(filtered_aois_out);
  }, [viewport]);

  useEffect(() => {
    markers.map(
      (m) => aoisToRemove.map((aoi) => aoi.id).includes(m.aoi_id) && m.remove(),
    );
    const new_markers1 = markers.filter(
      (m) => !aoisToRemove.map((aoi) => aoi.id).includes(m.aoi_id),
    );
    const marker_ids = markers.map((m) => m.aoi_id);
    const new_markers2 = aoisToPlace
      .filter((aoi) => !marker_ids.includes(aoi.id))
      .map((aoi) =>
        MarkerWithHook(aoi, map, setIsHovering, setPayload, setLayerGroup),
      );
    setMarkers([...new_markers1, ...new_markers2]);
  }, [aoisToRemove, aoisToPlace]);

  // useEffect(() => {
  //   if (aoisToPlace.length === 0) return;
  //   // create DOM element for the marker
  //   const marker_ids = markers.map(m => m.aoi_id)
  //   const new_markers = aoisToPlace
  //     .filter((aoi) => !(marker_ids.includes(aoi.id)))
  //     .map((aoi) => MarkerWithHook(aoi, map, setIsHovering, setPayload, setLayerGroup));
  //   setMarkers([...markers, ...new_markers]);
  // }, [aoisToPlace]);
}
