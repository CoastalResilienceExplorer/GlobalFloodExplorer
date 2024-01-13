import { useEffect, useRef, useState } from "react";

import { useMap } from "hooks/useMap";
import { useLayers } from "hooks/layers/useLayers";
import { useLegends } from "hooks/useLegends";
import { useSelection } from "hooks/useSelection";
import { useBreadcrumbs, useMapWithBreadcrumbs } from "hooks/useBreadcrumbs";
import { InfoContext, useInfo } from "hooks/useInfo";
import { usePermalinks } from "hooks/usePermalinks";

// Data
import sources from "./layers/sources";
import layerGroups, { layersByGroup } from "./layers/layers";
import { protos as custom_layer_protos } from "./layers/protos/custom_protos";
import { init_viewport, init_layer, init_subgroup } from "./data/startup_data";
import aois from "./data/viewports.json";

//Panels
import Legend from "./legends/legend";
import StatsPanel from "./panels/stats-panel/stats-panel-container";
import HomeInfoPanel from "./panels/home-info-panel/home-info-panel";
import Compass from "./compass/compass";
import BasemapManager from "./basemap_manager/BasemapManager";
import { SlideMap } from "slide_map/slide_map";
import { LayerSelection } from "./panels/layer-selection/layer-selection";

//Info
import Info from "./info/info";
import infoReducer from "./info/infoReducer";
import initialInfo from "./info/initialInfo";

// Splash Screens
import OpeningSplashScreen from "./splash-screens/splash-screen";
import {
  DisclaimerScreen,
  NavigationControls,
} from "./splash-screens/disclaimer-screen";
import { LayerName } from "types/dataModel";

const all_selectable_layers = Object.values(layersByGroup)
  .flat()
  .filter((x) => x.is_selectable)
  .map((x) => x.id);

const token =
  "pk.eyJ1IjoiY2xvd3JpZSIsImEiOiJja21wMHpnMnIwYzM5Mm90OWFqaTlyejhuIn0.TXE-FIaqF4K_K1OirvD0wQ";

export default function Map() {
  const [initialStates, useUpdatePermalink] = usePermalinks({
    defaultViewport: init_viewport,
    defaultLayer: init_layer,
    defaultSubgroup: init_subgroup,
  });

  const {
    map,
    mapContainer,
    mapLoaded,
    viewport,
    style,
    setStyle,
    flyToViewport,
    flyToBounds,
  } = useMap(
    initialStates.viewport,
    "mapbox://styles/mapbox/satellite-v9",
    token,
  );

  const {
    layerGroup,
    layerSelectionDependencies,
    subgroup,
    subgroupOn,
    setLayerGroup,
    setSubgroup,
  } = useLayers(
    map,
    mapLoaded,
    initialStates.layer,
    initialStates.subgroup,
    style,
    layersByGroup,
    sources,
    custom_layer_protos,
  );

  const { legends } = useLegends(
    layerGroup,
    subgroup,
    mapLoaded,
    layersByGroup,
    custom_layer_protos,
  );

  useUpdatePermalink({
    viewport: viewport,
    layerGroup: layerGroup,
    subgroup: subgroup,
  });

  const { selectedFeatures, selectionType } = useSelection(
    map,
    mapLoaded,
    mapContainer,
    all_selectable_layers,
    layerSelectionDependencies,
  );

  const breadcrumbs = useBreadcrumbs(aois, viewport);
  useMapWithBreadcrumbs(viewport, aois, map);

  const { useFirst, activeInfo } = useInfo(initialInfo, infoReducer);

  const selectRef = useRef();

  const floodingRef = useRef();
  useFirst(() => layerGroup === LayerName.Flooding, "FIRST_FLOODING");

  const compassRef = useRef();
  useFirst(() => viewport.pitch !== 0, "FIRST_3D");
  useFirst(() => viewport.bearing !== 0, "FIRST_3D");

  const centerRef = useRef();
  useFirst(
    () => layerGroup === LayerName.Flooding,
    "FIRST_FLOODING_ZOOM_IN",
    () => viewport.zoom > 4,
  );
  useFirst(
    () => layerGroup === LayerName.RiskReduction,
    "FIRST_HEX",
    () => viewport.zoom < 4,
  );

  const [splashScreen, setSplashScreen] = useState(true);
  const [disclaimer, setDisclaimer] = useState(null);
  const [navigationControls, setNavigationControls] = useState(null);
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    if (disclaimer) {
      setTimeout(() => {
        setDisclaimer(false);
      }, 5000);
    }
  }, [disclaimer]);

  useEffect(() => {
    if (navigationControls) {
      setTimeout(() => {
        setNavigationControls(false);
      }, 10000);
    }
  }, [navigationControls]);

  const setSplashScreen2 = (bool) => {
    setSplashScreen(bool);
    if (disclaimer === null) {
      setDisclaimer(true);
      setNavigationControls(true);
    }
  };

  return (
    <InfoContext.Provider
      value={{ useFirst, selectRef, floodingRef, selectedFeatures }}
    >
      <OpeningSplashScreen
        showSplashScreen={splashScreen}
        setSplashScreen={setSplashScreen2}
      />
      <DisclaimerScreen
        show={disclaimer}
        setShow={setDisclaimer}
        isTouch={isTouch}
      />
      <NavigationControls show={navigationControls} isTouch={isTouch} />
      <Info
        activeInfo={activeInfo}
        refs={{
          COMPASS: compassRef,
          SELECT: selectRef,
          FLOOD: floodingRef,
          FLOOD_ZOOM: centerRef,
          HEX: centerRef,
        }}
      />
      <div className="screen">
        <Legend legend_items={legends} />
        {layerGroup === LayerName.Flooding && (
          <SlideMap
            initialStates={initialStates}
            style={style}
            viewport={viewport}
            access_token={token}
            other_map={map}
          />
        )}
        <div
          ref={mapContainer}
          className="map-container"
          style={{
            visibility:
              layerGroup !== LayerName.Flooding ? "visible" : "hidden",
          }}
        />
      </div>
      <div className="center-ref-container">
        <div className="center-ref" ref={centerRef} />
      </div>
      <StatsPanel
        selectedFeatures={selectedFeatures}
        selectionType={selectionType}
        layerGroup={layerGroup}
        setLayerGroup={setLayerGroup}
        flyToViewport={flyToViewport}
        selectRef={selectRef}
      />
      <BasemapManager
        style={style}
        setStyle={setStyle}
        floodGroup={subgroup}
        setFloodGroup={setSubgroup}
        floodingOn={subgroupOn}
      />
      <Compass
        viewport={viewport}
        setViewport={flyToViewport}
        _ref={compassRef}
        navigationControls={navigationControls}
        setNavigationControls={setNavigationControls}
      />
      <LayerSelection
        layerGroups={layerGroups}
        selectedLayer={layerGroup}
        setSelectedLayer={setLayerGroup}
        setBounds={flyToBounds}
      />
    </InfoContext.Provider>
  );
}
