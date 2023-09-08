import React, { useState, useRef } from "react";
import "./BasemapManager.css";
import { ReactComponent as OpenCloseToggleIcon } from "assets/OpenCloseToggle2.svg";
import { useInfoContext } from "maphooks/maphooks/useInfo";

const base_url = "mapbox://styles/mapbox/";

function OpenCloseToggle({ isOpen, setIsOpen }) {
  const openTransform = {
    transform: "rotate(180deg)",
  };

  return (
    <div
      className="open-close-legend-toggle-container basemaps"
      onClick={() => setIsOpen(!isOpen)}
    >
      <p className="open-close-toggle-text basemaps">Basemap</p>
      <OpenCloseToggleIcon
        className={"open-close-toggle" + (isOpen ? " open" : "")}
        style={isOpen ? {} : openTransform}
      />
    </div>
  );
}

function CircleSelector({ selectedStyle, thisStyle, setStyle, isOpen }) {
  const selected = selectedStyle.includes(thisStyle.toLowerCase());

  const styles = {
    Satellite: base_url + "satellite-v9",
    Light: base_url + "light-v10",
    Dark: base_url + "dark-v10",
  };

  return (
    <div
      className="circle-selector-container"
      onClick={() => setStyle(styles[thisStyle])}
    >
      <div className="circle-selector-text">{thisStyle}</div>
      <div
        className={
          "circle-selector" + ` ${thisStyle} ${selected ? "selected" : ""}`
        }
      ></div>
    </div>
  );
}

export default function BasemapManager({
  style,
  setStyle,
  floodGroup,
  setFloodGroup,
  floodingOn,
}) {
  const { useFirst, floodingRef } = useInfoContext();
  useFirst(
    () => !!floodingOn,
    "FIRST_FLOODING"
  );

  const [isOpen, setIsOpen] = useState(true);

  const ref = useRef(null);

  const styles = [
    {
      name: "Satellite",
      id: base_url + "satellite-v9",
    },
    {
      name: "Light",
      id: base_url + "light-v10",
    },
    {
      name: "Dark",
      id: base_url + "dark-v10",
    },
  ];

  const floodgroups = [
    {
      id: "None",
      displayAs: "None",
    },
    {
      id: "with",
      displayAs: "With Mangroves",
    },
    {
      id: "without",
      displayAs: "Without Mangroves",
    },
  ];

  const transformOffset =
    !isOpen && ref.current
      ? {
        transform: `translateX(${ref.current.offsetWidth + 5}px)`,
      }
      : {};

  return (
    <div
      className={"basemap-manager-outer-container" + (isOpen ? " open" : "")}
      transition={"transform 1s"}
      style={transformOffset}
    >
      <OpenCloseToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="basemap-manager-inner-container" ref={ref}>
        <div className="basemap-manager-header">Basemaps</div>
        <CircleSelector
          selectedStyle={style}
          setStyle={setStyle}
          thisStyle={"Satellite"}
        />
        <CircleSelector
          selectedStyle={style}
          setStyle={setStyle}
          thisStyle={"Light"}
        />
        <CircleSelector
          selectedStyle={style}
          setStyle={setStyle}
          thisStyle={"Dark"}
        />
      </div>
    </div>
  );

  return (
    <div className="basemap-manager-outer-container">
      <div className="basemap-manager-inner-container">
        <div className="basemap-options-container">
          <div className="basemap-options-header">Basemaps</div>
          {styles.map((s) => (
            <label className="basemap-options-button" key={s.id}>
              <input
                type="radio"
                checked={s.id === style}
                value={s.id}
                className="basemap-manager-toggle"
                onChange={() => setStyle(s.id)}
              ></input>
              {s.name}
            </label>
          ))}
        </div>
        {floodingOn && (
          <>
            <div className="vl" />
            <div className="basemap-options-container">
              <div className="basemap-options-header" ref={floodingRef}>
                Flooding
              </div>
              {floodgroups.map((s) => (
                <label className="basemap-options-button" key={s.id}>
                  <input
                    type="radio"
                    checked={s.id === floodGroup}
                    value={s.id}
                    className="basemap-manager-toggle"
                    onChange={() => setFloodGroup(s.id)}
                  ></input>
                  {s.displayAs}
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
