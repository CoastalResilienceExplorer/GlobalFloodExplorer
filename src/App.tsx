import "./App.css";
import Map from "./Map";
import { useEffect, useState } from "react";
import { StagingLogin } from "./staging/auth";
import ReactGA from "react-ga4";
import { FiltersContext, useFilters } from "hooks/useFilters";
import { LayerBounceContext, useLayerBounce } from "layers/layer-bounce";
import { filters } from "layers/filters";

ReactGA.initialize("G-5XWHH710GF", {
  testMode: process.env.NODE_ENV !== "production",
});

function App() {
  const [authed, setAuthed] = useState(false);

  const { filtersOn, setFiltersOn, activeFilters, activeFiltersRef } =
    useFilters();

  useEffect(() => {
    console.log(activeFilters);
  }, [activeFilters]);

  const { layerGroupSelectedFrom, setLayerGroupSelectedFrom } =
    useLayerBounce();

  return (
    <div className="App">
      {process.env.REACT_APP_USE_SITE_GATING === "true" && !authed ? (
        <StagingLogin setAuthed={setAuthed} />
      ) : (
        <FiltersContext.Provider
          value={{
            filtersOn,
            setFiltersOn,
            activeFilters,
            activeFiltersRef,
          }}
        >
          <LayerBounceContext.Provider
            value={{
              layerGroupSelectedFrom,
              setLayerGroupSelectedFrom,
            }}
          >
            <Map />
          </LayerBounceContext.Provider>
        </FiltersContext.Provider>
      )}
    </div>
  );
}

export default App;
