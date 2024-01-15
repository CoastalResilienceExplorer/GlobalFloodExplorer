import React, { useState } from "react";
import "./BasemapManager.css";

const base_url = "mapbox://styles/mapbox/";

export enum BasemapStyle {
  Satellite = "satellite",
  Light = "light",
  Dark = "dark",
}

export const BasemapMap: Record<BasemapStyle, string> = {
  [BasemapStyle.Satellite]: base_url + "satellite-v9",
  [BasemapStyle.Light]: "mapbox://styles/clowrie/clpufcesr00g601q19a2jakzb",
  [BasemapStyle.Dark]: "mapbox://styles/clowrie/clpueibwk00fv01pxf6jeh7gr",
};

const CircleSelector = ({
  selectedStyle,
  thisStyle,
  setStyle,
}: {
  selectedStyle: string;
  thisStyle: BasemapStyle;
  setStyle: (style: string) => void;
}) => {
  const selected = BasemapMap[thisStyle] === selectedStyle;

  return (
    <div
      className="circle-selector-container"
      onClick={() => setStyle(BasemapMap[thisStyle])}
    >
      <p
        className={`font-sans font-bold uppercase circle-selector-text ${
          selectedStyle === BasemapMap.light ? "text-open" : "text-white"
        }`}
      >
        {thisStyle}
      </p>
      <div
        className={
          "circle-selector" + ` ${thisStyle} ${selected ? "selected" : ""}`
        }
      ></div>
    </div>
  );
};

export const BasemapManager = ({
  style,
  setStyle,
}: {
  style: string;
  setStyle: (style: string) => void;
}) => {
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
          {[BasemapStyle.Satellite, BasemapStyle.Light, BasemapStyle.Dark].map(
            (s) => {
              if (isOpen || BasemapMap[s] === style) {
                return (
                  <CircleSelector
                    key={s}
                    selectedStyle={style}
                    setStyle={setStyle}
                    thisStyle={s}
                  />
                );
              } else {
                return null;
              }
            },
          )}
        </div>
      </div>
    </div>
  );
};
