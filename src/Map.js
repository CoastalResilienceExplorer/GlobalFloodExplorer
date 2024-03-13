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
import { aois } from "./data/viewports";
import { COUNTRY_TESELA_ZOOM_SWITCH, FLOODING_MIN_ZOOM } from "./layers/layers";

//Panels
import Legend from "./legends/legend";
import StatsPanel from "./panels/stats-panel/stats-panel-container";
import Compass from "./compass/compass";
import { BasemapManager } from "./basemap_manager/BasemapManager";
import { SlideMap } from "slide_map/slide_map";
import { LayerSelection } from "./panels/layer-selection/layer-selection";

//Info
import Info from "./info/info";
import infoReducer from "./info/infoReducer";
import initialInfo from "./info/initialInfo";

// Splash Screens
import { SplashScreen } from "./splash-screens/splash-screen";
import {
  DisclaimerScreen,
  NavigationControls,
} from "./splash-screens/disclaimer-screen";
import { LayerName } from "types/dataModel";
import FlyToContext from "panels/FlyToContext";

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
  } = useMap(initialStates.viewport, token);

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

  const {
    useFirst,
    useEventWithFunction,
    useEvery,
    useWhile,
    activeInfo,
    allTheThings,
    infoRefs,
  } = useInfo(initialInfo, infoReducer);
  useMapWithBreadcrumbs(viewport, aois, map, setLayerGroup, useWhile);
  useFirst(() => layerGroup === LayerName.Flooding, "FIRST_FLOODING");
  useFirst(() => viewport.pitch !== 0, "FIRST_3D");
  useFirst(() => viewport.bearing !== 0, "FIRST_3D");

  const [floodsShouldShow, setFloodsShouldShow] = useState(
    layerGroup === LayerName.Flooding && viewport.zoom < FLOODING_MIN_ZOOM,
  );
  useEffect(() => {
    if (
      layerGroup === LayerName.Flooding &&
      viewport.zoom < FLOODING_MIN_ZOOM
    ) {
      setFloodsShouldShow(true);
    } else {
      setFloodsShouldShow(false);
    }
  }, [layerGroup, viewport]);

  useWhile.on(
    () => floodsShouldShow,
    [floodsShouldShow],
    "FIRST_FLOODING_ZOOM_IN",
    undefined,
    "",
    0,
  );

  useWhile.off(
    () => !floodsShouldShow,
    [floodsShouldShow],
    "FIRST_FLOODING_ZOOM_IN",
    undefined,
  );

  useWhile.on(
    () => layerGroup === LayerName.RiskReduction,
    [layerGroup],
    "FIRST_HEX",
    undefined,
    "",
    0,
  );

  useWhile.off(
    () => layerGroup !== LayerName.RiskReduction,
    [layerGroup],
    "FIRST_HEX",
    undefined,
  );

  useEventWithFunction(
    () => layerGroup === LayerName.RiskReduction,
    "FIRST_RRR",
    undefined,
    () => {
      if (mapLoaded) {
        map.flyToViewport(
          Object.assign(viewport, {
            pitch: 45,
            transitionDuration: 1000,
          }),
        );
        return true;
      }
      return false;
    },
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

  useEffect(() => {
    if (!mapLoaded) return;
    map.on("click", (e) => {
      console.log(e);
      console.log(viewport);
    });
  }, [mapLoaded]);

  return (
    <InfoContext.Provider
      value={{
        useFirst,
        useEvery,
        useWhile,
        selectedFeatures,
        infoRefs,
      }}
    >
      <SplashScreen
        showSplashScreen={splashScreen}
        setSplashScreen={setSplashScreen2}
      />
      <DisclaimerScreen
        show={disclaimer}
        setShow={setDisclaimer}
        isTouch={isTouch}
      />
      {/* <NavigationControls show={navigationControls} isTouch={isTouch} /> */}
      <Info
        activeInfo={activeInfo}
        allTheThings={allTheThings}
        refs={infoRefs}
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
        {infoRefs && <div className="center-ref" ref={infoRefs.CENTER} />}
      </div>
      <div className="lower-middle-ref-container">
        {infoRefs && (
          <div className="lower-middle-ref" ref={infoRefs.LOWER_MIDDLE} />
        )}
      </div>
      {infoRefs && (
        <StatsPanel
          selectedFeatures={selectedFeatures}
          selectionType={selectionType}
          layerGroup={layerGroup}
          setLayerGroup={setLayerGroup}
          flyToViewport={flyToViewport}
          selectRef={infoRefs.SELECT}
        />
      )}
      <BasemapManager
        style={style}
        setStyle={setStyle}
        floodGroup={subgroup}
        setFloodGroup={setSubgroup}
        floodingOn={subgroupOn}
      />
      {infoRefs && (
        <Compass
          viewport={viewport}
          style={style}
          setViewport={flyToViewport}
          _ref={infoRefs.COMPASS}
          navigationControls={navigationControls}
          setNavigationControls={setNavigationControls}
        />
      )}
      <FlyToContext.Provider value={{ flyToViewport, setLayerGroup }}>
        <LayerSelection
          layerGroups={layerGroups}
          selectedLayer={layerGroup}
          setSelectedLayer={setLayerGroup}
          setBounds={flyToBounds}
        />
      </FlyToContext.Provider>
    </InfoContext.Provider>
  );
}
