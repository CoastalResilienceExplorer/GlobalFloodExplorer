import { useState } from "react";
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
  selectedTheme,
  thisTheme,
  setTheme,
}: {
  selectedTheme: string;
  thisTheme: BasemapStyle;
  setTheme: (style: string) => void;
}) => {
  const selected = thisTheme === selectedTheme;

  return (
    <div
      className="circle-selector-container"
      onClick={() => setTheme(thisTheme)}
    >
      <p
        className={`font-sans font-bold uppercase circle-selector-text ${
          selectedTheme === BasemapStyle.Light ? "text-open" : "text-white"
        }`}
      >
        {thisTheme}
      </p>
      <div
        className={`circle-selector ${thisTheme} ${selected ? "selected" : ""}`}
      />
    </div>
  );
};

export const BasemapManager = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (style: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={
        "basemap-manager-container" + (theme.includes("light") ? " light" : "")
      }
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="basemap-manager-inner-container">
        <div className={"circle-selector-outer-container"}>
          {[BasemapStyle.Satellite, BasemapStyle.Light, BasemapStyle.Dark].map(
            (t) => {
              if (isOpen || t === theme) {
                return (
                  <CircleSelector
                    key={t}
                    selectedTheme={theme}
                    setTheme={setTheme}
                    thisTheme={t}
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
