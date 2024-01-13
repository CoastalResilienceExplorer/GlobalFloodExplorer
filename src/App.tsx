import "./App.css";
import Map from "./Map";
import { useState } from "react";
import { StagingLogin } from "./staging/auth";
import ReactGA from "react-ga4";
import { FiltersContext, useFilters } from "hooks/useFilters";

ReactGA.initialize("G-5XWHH710GF", {
  testMode: process.env.NODE_ENV !== "production",
});

function App() {
  const [authed, setAuthed] = useState(false);

  const { filtersOn, setFiltersOn, activeFilters, activeFiltersRef } =
    useFilters();

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
          <Map />
        </FiltersContext.Provider>
      )}
    </div>
  );
}

export default App;
