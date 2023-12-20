import React, { useState, useRef } from "react";
import "./BasemapManager.css";
import { useInfoContext } from "hooks/useInfo";

const base_url = "mapbox://styles/mapbox/";

const styles = {
  Satellite: base_url + "satellite-v9",
  Light: "mapbox://styles/clowrie/clpufcesr00g601q19a2jakzb",
  Dark: "mapbox://styles/clowrie/clpueibwk00fv01pxf6jeh7gr",
};

function CircleSelector({ selectedStyle, thisStyle, setStyle }) {
  const selected = styles[thisStyle] === selectedStyle;

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={
        "basemap-manager-container" + (style.includes("light") ? " light" : "")
      }
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="basemap-manager-inner-container">
        <div className={"circle-selector-outer-container"}>
          {["Satellite", "Light", "Dark"].map((s) => {
            if (isOpen || styles[s] === style) {
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
