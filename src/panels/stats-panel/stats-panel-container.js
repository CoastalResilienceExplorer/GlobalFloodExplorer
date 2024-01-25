import { useEffect, useState } from "react";
import "./stats-panel-container.css";
import { ReactComponent as OpenLogo } from "assets/Opentab.svg";
import SelectedFeaturesPanel from "./selected-features-panel";
import FlyToContext from "../FlyToContext";
import { useInfoContext } from "hooks/useInfo";
import countryMapping from "data/ISO_country_mapping";
import { Icon } from "@iconify/react";
import { year as initialYear } from "layers/layers";

function Title({ nStudyUnits, locations, selectionType }) {
  function countryNameOverride(country) {
    let return_country;
    switch (country) {
      case "Coted Ivoire":
        return_country = "Cote d'Voire";
        break;
      case "United Republicof Tanzania":
        return_country = "United Republic of Tanzania";
        break;
      default:
        return_country = country;
        break;
    }
    return return_country;
  }

  const locations_spaces = locations
    .map((l) =>
      l
        // insert a space before all caps
        .replace(/([A-Z])/g, " $1")
        // uppercase the first character
        .replace(/^./, function (str) {
          return str.toUpperCase();
        }),
    )
    // the first character was already capitalized, so remove that space
    .map((l) => l.slice(1))
    // Convert to display names with manual override where necessary
    .map((l) => countryNameOverride(l));

  const selection_display =
    selectionType === "country_bounds" ? "Country" : "Study Unit";

  const n_locations = locations.length;
  const too_many_locations = n_locations > 3;
  const locations_tmp = locations_spaces.slice(0, 3);
  console.log(locations_tmp);

  const [showLocationsTooltip, setShowLocationsTooltip] = useState(false);
  const [locationTooltipY, setLocationTooltipY] = useState(null);

  function formatLocationList(locations) {
    if (locations.length === 1) return locations_spaces[0];
    if (locations.length === 2)
      return `${locations_spaces[0]} and ${locations_spaces[1]}`;
    if (locations.length === 3)
      return `${locations_spaces
        .slice(0, -1)
        .map((i) => `${i}, `)
        .reduce((prev, curr) => [prev, curr])} and ${
        locations_spaces[locations_spaces.length - 1]
      }`;
    if (too_many_locations)
      return `${locations_spaces[0]}, ${locations_spaces[1]} and ${
        n_locations - 2
      } others`;
  }

  return (
    <>
      <div className="stats-panel-title">
        <p>Showing statistics for:</p>
        <p className="body-x-large italic">
          {selection_display === "Study Unit"
            ? nStudyUnits +
              (nStudyUnits > 1 ? " Study Units in" : " Study Unit in")
            : ""}{" "}
          {/* {n_locations} {n_locations > 1 ?
          (selection_display === "Study Unit" ? "Study Units in": ""){" "} */}
          <span className="whitespace-nowrap">
            {formatLocationList(locations_spaces)}
          </span>
        </p>
      </div>
      {showLocationsTooltip && (
        <div
          className="stats-panel-locations-tooltip"
          style={{ right: 20, top: locationTooltipY + 50 }}
        >
          {locations_spaces.map((l) => (
            <>
              <div>{l}</div>
              <br></br>
            </>
          ))}
        </div>
      )}
    </>
  );
}

function TopBanner({
  selectedFeatures,
  selectionType,
  selectedYear,
  setSelectedYear,
}) {
  const locations = [
    ...new Set(selectedFeatures.map((x) => countryMapping[x.properties.ISO3])),
  ];

  const updateYear = (e) => {
    setSelectedYear(e.target.value);
  };

  if (selectedFeatures.length === 0) {
    return <></>;
  }
  console.log(selectedYear);
  console.log(initialYear);
  console.log(selectedYear == initialYear);
  return (
    <div className="top-banner-container">
      <Title
        nStudyUnits={selectedFeatures.length}
        selectionType={selectionType}
        locations={locations}
      />
      <p className="text-right text-white mb-2 px-2">
        Currently viewing data for{"  "}
        <select
          value={selectedYear}
          onChange={updateYear}
          className="text-open ml-1 lining-nums rounded"
        >
          <option value={1996}>1996</option>
          <option value={2010}>2010</option>
          <option value={2015}>2015</option>
        </select>
      </p>
      {selectedYear != initialYear && (
        <i className="text-right text-white mb-2">
          Data in the map shows 2015 values.
        </i>
      )}
      <div className="absolute !m-0 h-1 bg-open w-full" />
    </div>
  );
}

function OpenToggle({ isOpen, setIsOpen }) {
  const { useFirst, selectRef, selectedFeatures } = useInfoContext();
  const openTransform = {
    width: "48px",
    height: "49px",
    transform: "rotate(180deg)",
  };

  useFirst(
    () => selectedFeatures.length !== 0,
    "FIRST_SELECT",
    () => !!isOpen,
  );
  return (
    <div className="open-sidebar" ref={selectRef}>
      <h5 className="z-10">Metrics&nbsp;&nbsp;</h5>
      <div
        className={
          "open-toggle-container" +
          (selectedFeatures.length !== 0 && !isOpen ? " coral" : "")
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon
          icon="ri:arrow-left-s-line"
          className="open-toggle"
          style={isOpen ? openTransform : { width: "48px", height: "49px" }}
        />
      </div>
    </div>
  );
}

export default function StatsPanel({
  selectedFeatures,
  selectionType,
  layerGroup,
  setLayerGroup,
  flyToViewport,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  // Remove this to auto-open the stats panel after the first selection
  useEffect(() => {
    if (!selectedFeatures.length) {
      setIsOpen(false);
    }
  }, [selectedFeatures]);

  return (
    <div
      className={
        "right-panel" + (selectedFeatures.length && isOpen ? " open" : "")
      }
    >
      {selectedFeatures.length > 0 && (
        <OpenToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      <div className="right-panel-content">
        <TopBanner
          selectedFeatures={selectedFeatures}
          selectionType={selectionType}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <div className="overflow-scroll">
          <FlyToContext.Provider value={{ flyToViewport, setLayerGroup }}>
            <SelectedFeaturesPanel
              selectedFeatures={selectedFeatures}
              layerGroup={layerGroup}
              setLayerGroup={setLayerGroup}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </FlyToContext.Provider>
        </div>
      </div>
    </div>
  );
}
