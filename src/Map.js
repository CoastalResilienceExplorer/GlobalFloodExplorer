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
import layers from "./layers/layers";
import { protos as custom_layer_protos } from "./layers/protos/custom_protos";
import { init_viewport, init_layer, init_subgroup } from "./data/startup_data";
import aois from "./data/viewports.json";

//Panels
import Legend from "./legends/legend";
import StatsPanel from "./panels/stats-panel/stats-panel-container";
import HomeInfoPanel from "./panels/home-info-panel/home-info-panel";
import Compass from "./compass/compass";
import BasemapManager from "./basemap_manager/BasemapManager";
import FloodSelector from "./flood_selector/flood_selector";
import BreadcrumbsContainer from "./panels/breadcrumbs/breadcrumbs-container";

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
import SearchBar from "panels/home-info-panel/search-bar";

const all_selectable_layers = Object.values(layers)
  .flat()
  .filter((x) => x.is_selectable)
  .map((x) => x.id);

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
    "pk.eyJ1IjoiY2xvd3JpZSIsImEiOiJja21wMHpnMnIwYzM5Mm90OWFqaTlyejhuIn0.TXE-FIaqF4K_K1OirvD0wQ",
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
    layers,
    sources,
    custom_layer_protos,
  );

  const { legends } = useLegends(
    layerGroup,
    subgroup,
    mapLoaded,
    layers,
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
  // useEffect(() => console.log(breadcrumbs), [breadcrumbs])

  const { useFirst, activeInfo } = useInfo(initialInfo, infoReducer);

  const selectRef = useRef();

  const floodingRef = useRef();
  useFirst(() => layerGroup === "Flooding", "FIRST_FLOODING");

  const compassRef = useRef();
  useFirst(() => viewport.pitch !== 0, "FIRST_3D");
  useFirst(() => viewport.bearing !== 0, "FIRST_3D");

  const centerRef = useRef();
  useFirst(
    () => layerGroup === "Flooding",
    "FIRST_FLOODING_ZOOM_IN",
    () => viewport.zoom > 4,
  );
  useFirst(
    () => layerGroup === "Risk Reduction Ratio",
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
        <div ref={mapContainer} className="map-container">
          {/* <BreadcrumbsContainer breadcrumbs={breadcrumbs} map={map} /> */}
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
        </div>
      </div>
      <div className="center-ref-container">
        <div className="center-ref" ref={centerRef} />
      </div>
      <Compass
        viewport={viewport}
        setViewport={flyToViewport}
        _ref={compassRef}
        navigationControls={navigationControls}
        setNavigationControls={setNavigationControls}
      />
      <HomeInfoPanel
        setSplashScreen={setSplashScreen2}
        setBounds={flyToBounds}
        selectedLayer={layerGroup}
        setSelectedLayer={setLayerGroup}
        isTouch={isTouch}
      />
      <FloodSelector
        floodGroup={subgroup}
        setFloodGroup={setSubgroup}
        floodingOn={subgroupOn}
      />
    </InfoContext.Provider>
  );
}
