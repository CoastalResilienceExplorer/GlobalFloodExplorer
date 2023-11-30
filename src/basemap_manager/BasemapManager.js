import React, { useState, useRef } from "react";
import "./BasemapManager.css";
import { useInfoContext } from "hooks/useInfo";

const base_url = "mapbox://styles/mapbox/";

function CircleSelector({ selectedStyle, thisStyle, setStyle }) {
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

export default function BasemapManager({ style, setStyle }) {
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
      className={
        "basemap-manager-container" + (style.includes("light") ? " light" : "")
      }
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* <OpenCloseToggle isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      <div className="basemap-manager-inner-container" ref={ref}>
        <div className="basemap-manager-header">Basemaps</div>
        <div className="circle-selector-outer-container">
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
    </div>
  );

  return (
    <div className="basemap-manager-outer-container">
      <div className="basemap-manager-inner-container">
        <div className={"circle-selector-outer-container"}>
          {["Satellite", "Light", "Dark"].map((s) => {
            if (isOpen || style.includes(s.toLowerCase())) {
              return (
                <CircleSelector
                  key={s}
                  selectedStyle={style}
                  setStyle={setStyle}
                  thisStyle={s}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
