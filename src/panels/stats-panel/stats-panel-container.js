import { useEffect, useMemo, useState } from "react";
import "./stats-panel-container.css";
import SelectedFeaturesPanel from "./selected-features-panel";
import FlyToContext from "../FlyToContext";
import { useInfoContext } from "hooks/useInfo";
import countryMapping from "data/ISO_country_mapping";
import { Icon } from "@iconify/react";
import { year as initialYear } from "layers/layers";

function Title({ studyUnitIds, locations, selectionType }) {
  function countryNameOverride(country) {
    let return_country;
    switch (country) {
      case "Coted Ivoire":
        return_country = "Cote d'Voire";
        break;
      case "United Republicof Tanzania":
        return_country = "United Republic of Tanzania";
        break;
      case "United States of America":
        return_country = "USA";
        break;
      default:
        return_country = country;
        break;
    }
    return return_country;
  }

  const countries = locations
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

  const showLocationsTooltip = false;
  const locationTooltipY = null;

  const formattedCountryList = useMemo(() => {
    if (countries.length === 1) return countries[0];
    if (countries.length === 2) return `${countries[0]} and ${countries[1]}`;
    return `${countries[0]}, ${countries[1]} and ${countries.length - 2} other${
      countries.length - 2 > 1 ? "s" : ""
    }`;
  }, [countries]);

  const formattedLocationList = useMemo(() => {
    return `${studyUnitIds.length}${
      studyUnitIds.length > 1 ? " 20km study units" : " 20km study unit"
    } in ${formattedCountryList}`;
  }, [studyUnitIds, formattedCountryList]);

  return (
    <>
      <div className="stats-panel-title">
        <p
          className={`${
            studyUnitIds.length > 1 ? "body" : "body-large"
          } italic whitespace-nowrap overflow-hidden text-ellipsis text-2xl`}
        >
          {formattedLocationList}
        </p>
      </div>
      {showLocationsTooltip && (
        <div
          className="stats-panel-locations-tooltip"
          style={{ right: 20, top: locationTooltipY + 50 }}
        >
          {countries.map((l) => (
            <>
              <div>{l}</div>
              <br />
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

  return (
    <div className="top-banner-container">
      <Title
        studyUnitIds={selectedFeatures.map((f) => f.id)}
        nStudyUnits={selectedFeatures.length}
        selectionType={selectionType}
        locations={locations}
      />
      <p className="text-right text-white mb-2 px-2">
        Statistics for Mangrove Habitats in {"  "}
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
        <>
          <i className="text-left text-white mb-2 text-lg text-[14px]">
            Data in the map shows 2015 values.
          </i>
        </>
      )}
      <div className="absolute !m-0 h-96 bg-open w-full" />
    </div>
  );
}

function OpenToggle({ isOpen, setIsOpen, disabled }) {
  const { useFirst, selectRef } = useInfoContext();
  const [showTooltip, setShowTooltip] = useState(false);
  const openTransform = {
    width: "48px",
    height: "49px",
    transform: isOpen
      ? "rotate(180deg) translateX(-1px)"
      : "rotate(0deg) translateX(-1px)",
    transition: "transform 0.2s ease",
  };

  useFirst(
    () => !disabled,
    "FIRST_SELECT",
    () => !!isOpen,
  );

  const onHover = () => {
    if (!disabled) return;
    setShowTooltip(true);
  };

  const onUnhover = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="open-sidebar"
      ref={selectRef}
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
    >
      <div
        className={
          "flex flex-col items-center	" + (disabled ? " opacity-50" : "")
        }
      >
        <h5 className="z-10">Metrics&nbsp;&nbsp;</h5>
        <button
          data-test-id="open-metrics-button"
          className={
            "open-toggle-container" + (!disabled && !isOpen ? " coral" : "")
          }
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <Icon
            icon="ri:arrow-left-s-line"
            className="open-toggle"
            style={openTransform}
          />
        </button>
      </div>
      <div
        className={
          "absolute bg-white w-32 top-[100%]  px-2 py-1 rounded transition delay-300 duration-300 " +
          (showTooltip ? "right-0 opacity-100" : "left-[110%] opacity-0")
        }
      >
        <p className="label italic">Select a study unit to view metrics</p>
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
      <OpenToggle
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        disabled={selectedFeatures.length < 1}
      />
      <div className="right-panel-content">
        <TopBanner
          selectedFeatures={selectedFeatures}
          selectionType={selectionType}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <div className="overflow-y-scroll">
          <FlyToContext.Provider value={{ flyToViewport, setLayerGroup }}>
            <SelectedFeaturesPanel
              selectedFeatures={selectedFeatures}
              selectedYear={selectedYear}
            />
          </FlyToContext.Provider>
        </div>
      </div>
    </div>
  );
}
