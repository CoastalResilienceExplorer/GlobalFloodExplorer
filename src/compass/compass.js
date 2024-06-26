import "./compass.css";
import { useState, useRef, useEffect } from "react";
import { useInfoContext } from "hooks/useInfo";
import { ReactComponent as CompassSVG } from "assets/compass.svg";
import { ReactComponent as Plus } from "assets/Plus.svg";
import { ReactComponent as Minus } from "assets/Minus.svg";
import Hover from "components/hover";
import { useFilterContext } from "hooks/useFilters";
import { Icon } from "@iconify/react";
import { default_mang_perc_change_filter } from "layers/filters";
import { BasemapMap } from "basemap_manager/BasemapManager";

function reverseObject(obj) {
  const reversedObject = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      reversedObject[obj[key]] = key;
    }
  }
  return reversedObject;
}

const ReversedBasemapMap = reverseObject(BasemapMap);

export default function Compass(props) {
  const { useWhile } = useInfoContext();
  const [filterIsHovering, setFilterIsHovering] = useState(false);
  const filterIsHoveringRef = useRef();

  function adjustViewport(adjustment) {
    const newViewport = Object.assign(props.viewport, adjustment);
    props.setViewport(newViewport);
  }

  useEffect(() => {
    filterIsHoveringRef.current = filterIsHovering;
  }, [filterIsHovering]);

  const { filtersOn, setFiltersOn } = useFilterContext();

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
          <Hover
            text="Set Filter"
            extraClasses={ReversedBasemapMap[props.theme]}
          >
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
          <Hover text="Reorient" extraClasses={ReversedBasemapMap[props.theme]}>
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
          <Hover text="Zoom In" extraClasses={ReversedBasemapMap[props.theme]}>
            <div className="controls-icon">
              <Plus fill="white" />
            </div>
          </Hover>
        </div>
        <div
          className="controls-icon-container"
          onClick={() => adjustViewport({ zoom: props.viewport.zoom - 1 })}
        >
          <Hover text="Zoom Out" extraClasses={ReversedBasemapMap[props.theme]}>
            <div className="controls-icon">
              <Minus fill="white" />
            </div>
          </Hover>
        </div>
      </div>
    </div>
  );
}
