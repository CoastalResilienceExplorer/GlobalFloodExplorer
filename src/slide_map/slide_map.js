import { useMap } from "hooks/useMap";
import { useSlideMap } from "hooks/useSlideMap";
import { useLayers } from "hooks/layers/useLayers";

import sources from "layers/sources";
import { layersByGroup } from "layers/layers";
import { protos as custom_layer_protos } from "layers/protos/custom_protos";
import { useEffect } from "react";

import "./flood_selector.css";
import { FloodSelector } from "./flood_selector";

import { filters } from "layers/filters";

export function SlideMap({
  initialStates,
  style,
  viewport,
  access_token,
  other_map,
}) {
  const {
    map: left_map,
    mapContainer: left_mapContainer,
    mapLoaded: left_mapLoaded,
    style: left_style,
    setStyle: left_setStyle,
  } = useMap(viewport, access_token);

  const {
    map: right_map,
    mapContainer: right_mapContainer,
    mapLoaded: right_mapLoaded,
    style: right_style,
    setStyle: right_setStyle,
  } = useMap(viewport, access_token);

  const {
    subgroup: left_subgroup,
    setLayerGroup: left_setLayerGroup,
    setSubgroup: left_setSubgroup,
  } = useLayers(
    left_map,
    left_mapLoaded,
    initialStates.layer,
    initialStates.subgroup,
    left_style,
    layersByGroup,
    sources,
    custom_layer_protos,
    filters,
  );

  const {
    subgroup: right_subgroup,
    setLayerGroup: right_setLayerGroup,
    setSubgroup: right_setSubgroup,
  } = useLayers(
    right_map,
    right_mapLoaded,
    initialStates.layer,
    initialStates.subgroup,
    right_style,
    layersByGroup,
    sources,
    custom_layer_protos,
    filters,
  );

  useEffect(() => {
    left_setLayerGroup("Flooding");
    right_setLayerGroup("Flooding");
    // Wait for initialization
    setTimeout(() => {
      left_setSubgroup("flooding_1996");
      right_setSubgroup("flooding_2015");
    }, 500);
    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { leftClip, rightClip, slideTransformPx } = useSlideMap(
    left_map,
    right_map,
    other_map,
  );

  useEffect(() => {
    left_setStyle(style);
    right_setStyle(style);
  }, [left_setStyle, right_setStyle, style]);

  return (
    <div id="slide-map-container">
      <div
        ref={left_mapContainer}
        className="map"
        style={{ clipPath: leftClip }}
      ></div>
      <div
        ref={right_mapContainer}
        className="map"
        style={{ clipPath: rightClip }}
      ></div>
      <div
        className="mapboxgl-compare"
        style={{ transform: `translate(${slideTransformPx}px, 0px)` }}
      >
        <div className="left">
          <FloodSelector
            offset={-86}
            floodGroup={left_subgroup}
            setFloodGroup={left_setSubgroup}
            floodingOn={true}
          />
        </div>
        <div id="compare-swiper-vertical"></div>
        <FloodSelector
          offset={1}
          floodGroup={right_subgroup}
          setFloodGroup={right_setSubgroup}
          floodingOn={true}
        />
      </div>
    </div>
  );
}
