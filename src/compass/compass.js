import "./compass.css";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useInfoContext } from "hooks/useInfo";
import { ReactComponent as CompassSVG } from "assets/compass.svg";
import { ReactComponent as MapSVG } from "assets/Map_Icon.svg";
import { ReactComponent as Plus } from "assets/Plus.svg";
import { ReactComponent as Minus } from "assets/Minus.svg";
import { ReactComponent as Controls } from "assets/Controls.svg";
import Hover from "components/hover";
import { useFilterContext } from "hooks/useFilters";
import { Icon } from "@iconify/react";
import { HOVER_TIMEOUT } from "hooks/useBreadcrumbs";
import { default_mang_perc_change_filter } from "layers/filters";

export default function Compass(props) {
  const { useWhile } = useInfoContext();
  const [filterIsHovering, setFilterIsHovering] = useState(false);
  const filterIsHoveringRef = useRef();

  function adjustViewport(adjustment, transitionDuration = 500) {
    const newViewport = Object.assign(props.viewport, adjustment);
    props.setViewport(newViewport);
  }

  useEffect(() => {
    console.log(filterIsHovering);
    filterIsHoveringRef.current = filterIsHovering;
  }, [filterIsHovering]);

  const { filtersOn, setFiltersOn, activeFilters, activeFiltersRef } =
    useFilterContext();

  useWhile.on(
    () => filterIsHovering && filtersOn,
    [filterIsHovering, filtersOn],
    "FILTER_HOVER",
    undefined,
    `Filtering to >${default_mang_perc_change_filter * -100}% Mangrove Loss`,
    0,
  );

  useWhile.off(
    () => !filterIsHovering,
    [filterIsHovering],
    "FILTER_HOVER",
    undefined,
    1000,
  );

  useWhile.off(() => !filtersOn, [filtersOn], "FILTER_HOVER", undefined, 0);

  const highlightCompass =
    props.viewport.pitch !== 0 || props.viewport.bearing !== 0;
  return (
    <div className="controls-panel-container">
      <div className="controls-panel" ref={props._ref}>
        <div
          className={`controls-icon-container ${filtersOn ? "coral" : ""}`}
          onClick={() => setFiltersOn(!filtersOn)}
          onMouseMove={() => setFilterIsHovering(true)}
          onMouseLeave={() => setFilterIsHovering(false)}
        >
          <Hover text="Set Filters">
            <Icon
              icon="mdi:filter"
              className={`controls-icon ${filtersOn ? "coral" : ""}`}
            />
          </Hover>
        </div>
        <div
          className={
            "controls-icon-container " + (highlightCompass ? "coral" : "white")
          }
          onClick={() => adjustViewport({ bearing: 0, pitch: 0 })}
        >
          <Hover text="Reorient">
            <CompassSVG
              fill={highlightCompass ? "coral" : "white"}
              className={"controls-icon compass"}
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
