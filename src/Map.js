import { useRef, useState } from "react";

// Maphooks
import { useMap } from "maphooks/useMap";
import { useLayers } from "maphooks/maphooks/layers/useLayers";
import { useLegends } from "maphooks/maphooks/useLegends";
import { useSelection } from "maphooks/maphooks/useSelection";
import { InfoContext, useInfo } from "maphooks/maphooks/useInfo";

// Data
import sources from "./layers/sources";
import layers from "./layers/layers";
import { protos as custom_layer_protos } from "./layers/protos/custom_protos";
import { init_viewport, init_layer, init_subgroup } from "./data/startup_data";

//Panels
import Legend from "./legends/legend";
import StatsPanel from "./panels/stats-panel/stats-panel-container";
import HomeInfoPanel from "./panels/home-info-panel/home-info-panel";
import Compass from "./compass/compass";
import BasemapManager from "./basemap_manager/BasemapManager";
import FloodSelector from "./flood_selector/flood_selector";

//Info
import Info from "./info/info";
import infoReducer from "./info/infoReducer";
import initialInfo from "./info/initialInfo";

// Splash Screens
import OpeningSplashScreen from "./splash-screens/splash-screen";
import DisclaimerScreen from "./splash-screens/disclaimer-screen";

const all_selectable_layers = Object.values(layers)
  .flat()
  .filter((x) => x.is_selectable)
  .map((x) => x.id);

export default function Map() {
  const {
    map,
    mapContainer,
    mapLoaded,
    viewport,
    style,
    setStyle,
    flyToViewport,
  } = useMap(
    init_viewport,
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
    init_layer,
    init_subgroup,
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

  const { selectedFeatures, selectionType } = useSelection(
    map,
    mapLoaded,
    mapContainer,
    all_selectable_layers,
    layerSelectionDependencies,
  );

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
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const setSplashScreen2 = (bool) => {
    setSplashScreen(bool);
    if (disclaimer === null) {
      setDisclaimer(true);
    }
  };

  return (
    <InfoContext.Provider
      value={{ useFirst, selectRef, floodingRef, selectedFeatures }}
    >
      <OpeningSplashScreen
        splashScreenOn={splashScreen}
        setSplashScreen={setSplashScreen2}
      />
      <DisclaimerScreen
        disclaimer={disclaimer}
        setDisclaimer={setDisclaimer}
        isTouch={isTouch}
      />
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
      />
      <HomeInfoPanel
        setSplashScreen={setSplashScreen2}
        setViewport={flyToViewport}
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
