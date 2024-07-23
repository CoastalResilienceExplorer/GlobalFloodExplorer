import { useMap } from "hooks/useMap";
import { useSlideMap } from "hooks/useSlideMap";
import { useLayers } from "hooks/layers/useLayers";

import sources from "layers/sources";
import { layersByGroup } from "layers/layers";
import { protos as customLayerProtos } from "layers/protos/custom_protos";
import { useEffect } from "react";

import "./flood_selector.css";
import { FloodSelector } from "./flood_selector";
import { Viewport } from "types/map";
import { LayerGroupName, LayerName } from "types/dataModel";

export const SlideMap = ({
  initialStates,
  theme,
  viewport,
  accessToken,
  otherMap,
  layersToggle,
}: {
  initialStates: { layer: string; subgroup: string };
  theme: string;
  viewport: Viewport;
  accessToken: string;
  otherMap: "left" | "right";
  layersToggle: Record<string, boolean>;
}) => {
  const {
    map: leftMap,
    mapContainer: leftMapContainer,
    mapLoaded: leftMapLoaded,
  } = useMap(viewport, accessToken, theme);

  const {
    map: rightMap,
    mapContainer: rightMapContainer,
    mapLoaded: rightMapLoaded,
  } = useMap(viewport, accessToken, theme);

  const leftToggle = {
    ...layersToggle,
    [LayerName.FLOODING_NOMANG]: false,
    [LayerName.FLOODING_2015]: true,
  };
  const rightToggle = {
    ...layersToggle,
    [LayerName.FLOODING_2015]: false,
    [LayerName.FLOODING_NOMANG]: true,
  };

  const {
    subgroup: leftSubgroup,
    setLayerGroup: leftSetLayerGroup,
    setSubgroup: leftSetSubgroup,
  } = useLayers(
    leftMap,
    leftMapLoaded,
    initialStates.layer,
    initialStates.subgroup,
    theme,
    layersByGroup,
    sources,
    customLayerProtos,
    leftToggle,
  );

  const {
    subgroup: rightSubgroup,
    setLayerGroup: rightSetLayerGroup,
    setSubgroup: rightSetSubgroup,
  } = useLayers(
    rightMap,
    rightMapLoaded,
    initialStates.layer,
    initialStates.subgroup,
    theme,
    layersByGroup,
    sources,
    customLayerProtos,
    rightToggle,
  );

  useEffect(() => {
    leftSetLayerGroup(LayerGroupName.Flooding);
    rightSetLayerGroup(LayerGroupName.Flooding);
    // Wait for initialization
    setTimeout(() => {
      leftSetSubgroup(LayerName.FLOODING_2015);
      rightSetSubgroup(LayerName.FLOODING_NOMANG);
    }, 500);
    document
      .getElementById("compare-swiper-vertical")
      ?.addEventListener("mousewheel", (event) => {
        event.preventDefault();
      });
    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { leftClip, rightClip, slideTransformPx } = useSlideMap(
    leftMap,
    rightMap,
    otherMap,
  );

  return (
    <div id="slide-map-container">
      <div
        ref={leftMapContainer}
        className="map"
        style={{ clipPath: leftClip ?? undefined }}
      />
      <div
        ref={rightMapContainer}
        className="map"
        style={{ clipPath: rightClip ?? undefined }}
      />
      <div
        className="mapboxgl-compare"
        style={{ transform: `translate(${slideTransformPx}px, 0px)` }}
      >
        <div className="left">
          <FloodSelector
            position="left"
            floodGroup={leftSubgroup}
            setFloodGroup={leftSetSubgroup}
            floodingOn={true}
          />
        </div>
        <div id="compare-swiper-vertical" />
        <FloodSelector
          position="right"
          floodGroup={rightSubgroup}
          setFloodGroup={rightSetSubgroup}
          floodingOn={true}
        />
      </div>
    </div>
  );
};
