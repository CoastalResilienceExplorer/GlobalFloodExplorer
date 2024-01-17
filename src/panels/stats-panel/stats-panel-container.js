import { useState } from "react";
import "./stats-panel-container.css";
import { ReactComponent as OpenLogo } from "assets/Opentab.svg";
import SelectedFeaturesPanel from "./selected-features-panel";
import FlyToContext from "../FlyToContext";
import { useInfoContext } from "hooks/useInfo";
import countryMapping from "data/ISO_country_mapping";
import { Icon } from "@iconify/react";

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
    selectionType === "countries" ? "Country" : "Study Unit";

  const n_locations = locations.length;
  const too_many_locations = n_locations > 3;
  const locations_tmp = locations_spaces.slice(0, 3);

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

  function onHover(e) {
    if (too_many_locations) {
      setShowLocationsTooltip(true);
      setLocationTooltipY(e.nativeEvent.offsetY);
      setTimeout(() => setShowLocationsTooltip(false), 3500);
    }
  }

  return (
    <>
      <div className="stats-panel-title">
        <p>Showing statistics for:</p>
        <p className="body-x-large italic">
          {selection_display} {nStudyUnits} in{" "}
          <span className="whitespace-nowrap">
            {formatLocationList(locations_tmp)}
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

function TopBanner({ selectedFeatures, selectionType }) {
  const locations = [
    ...new Set(selectedFeatures.map((x) => countryMapping[x.properties.ISO3])),
  ];
  if (selectedFeatures.length === 0) {
    return <></>;
  }
  return (
    <div className="top-banner-container">
      <Title
        nStudyUnits={selectedFeatures
          .map((x) => x.id)
          .reduce((a, b) => a + b, 0)}
        selectionType={selectionType}
        locations={locations}
      />
    </div>
  );
}

function OpenToggle({ isOpen, setIsOpen }) {
  const { useFirst, selectRef, selectedFeatures } = useInfoContext();
  const rotateTransaform = {
    transform: isOpen ? "rotate(90deg)" : "rotate(270deg)",
  };

  useFirst(
    () => selectedFeatures.length !== 0,
    "FIRST_SELECT",
    () => !!isOpen,
  );
  return (
    <div className="open-sidebar" ref={selectRef}>
      <h5>Metrics</h5>
      <div className="border-2 border-open bg-shoreline rounded-full mx-auto inline-block">
        <Icon
          icon="tabler:chevron-up"
          className="open-toggle"
          height={36}
          width={36}
          onClick={() => setIsOpen(!isOpen)}
          style={rotateTransaform}
          color="#21233A"
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
        />
        <FlyToContext.Provider value={{ flyToViewport, setLayerGroup }}>
          <SelectedFeaturesPanel
            selectedFeatures={selectedFeatures}
            layerGroup={layerGroup}
            setLayerGroup={setLayerGroup}
          />
        </FlyToContext.Provider>
      </div>
    </div>
  );
}
