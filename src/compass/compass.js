import "./compass.css";
import * as React from "react";
import { ReactComponent as CompassSVG } from "assets/compass.svg";
import { ReactComponent as MapSVG } from "assets/Map_Icon.svg";
import { ReactComponent as Plus } from "assets/Plus.svg";
import { ReactComponent as Minus } from "assets/Minus.svg";
import { ReactComponent as Controls } from "assets/Controls.svg";
import Hover from "components/hover";
import { useFilterContext } from "hooks/useFilters";
import { Icon } from "@iconify/react";

export default function Compass(props) {
  function adjustViewport(adjustment, transitionDuration = 500) {
    const newViewport = Object.assign(props.viewport, adjustment);
    props.setViewport(newViewport);
  }

  const { filtersOn, setFiltersOn, activeFilters, activeFiltersRef } =
    useFilterContext();

  function alignViewport() {
    const viewport_base = {
      latitude: props.viewport.latitude,
      longitude: props.viewport.longitude,
      zoom: props.viewport.zoom,
      pitch: props.viewport.pitch,
      bearing: props.viewport.bearing,
      transitionDuration: 500,
    };
    let viewport_to;
    if (props.viewport.bearing === 0) {
      viewport_to = Object.assign(viewport_base, { pitch: 0 });
    } else {
      viewport_to = Object.assign(viewport_base, { bearing: 0 });
    }
    props.setViewport(viewport_to);
  }

  const highlightCompass =
    props.viewport.pitch !== 0 || props.viewport.bearing !== 0;
  return (
    <div className="controls-panel-container">
      <div className="controls-panel" ref={props._ref}>
        <div
          className={`controls-icon-container`}
          onClick={() => setFiltersOn(!filtersOn)}
        >
          <Hover text="Set Filters">
            <Icon
              icon="mdi:filter"
              className={`controls-icon ${filtersOn ? "filters-on" : ""}`}
            />
          </Hover>
        </div>
        <div
          className={`controls-icon-container`}
          onClick={() => adjustViewport({ bearing: 0, pitch: 0 })}
        >
          <Hover text="Reorient">
            <CompassSVG
              fill={highlightCompass ? "coral" : "white"}
              className="controls-icon compass"
              style={{
                transform: `
                  rotateX(${props.viewport.pitch}deg)
                  rotateZ(${-props.viewport.bearing}deg)  
                `,
              }}
            />
          </Hover>
        </div>
        <div
          className="controls-icon-container"
          onClick={() => adjustViewport({ zoom: props.viewport.zoom + 1 })}
        >
          <Hover text="Zoom In">
            <div className="controls-icon">
              <Plus fill="white" />
            </div>
          </Hover>
        </div>
        <div
          className="controls-icon-container"
          onClick={() => adjustViewport({ zoom: props.viewport.zoom - 1 })}
        >
          <Hover text="Zoom Out">
            <div className="controls-icon">
              <Minus fill="white" />
            </div>
          </Hover>
        </div>
      </div>
    </div>
  );
}
