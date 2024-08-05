import "./compass.css";
import { useState } from "react";
import { ReactComponent as CompassSVG } from "assets/compass.svg";
import { ReactComponent as Plus } from "assets/Plus.svg";
import { ReactComponent as Minus } from "assets/Minus.svg";
import Hover from "components/hover";
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

function Tooltip({ text }) {
  return <div className="tooltips-slot">{text}</div>;
}

export default function Compass(props) {
  const [tooltipText, setTooltipText] = useState(null);

  function adjustViewport(adjustment) {
    const newViewport = Object.assign(props.viewport, adjustment);
    props.setViewport(newViewport);
  }

  const highlightCompass =
    props.viewport.pitch !== 0 || props.viewport.bearing !== 0;
  return (
    <div className="controls-panel-container">
      <div className="controls-panel" ref={props._ref}>
        <div
          className={
            "controls-icon-container " + (highlightCompass ? "coral" : "white")
          }
          onClick={() => adjustViewport({ bearing: 0, pitch: 0 })}
        >
          <Hover
            text="Reorient"
            extraClasses={ReversedBasemapMap[props.theme]}
            action={setTooltipText}
          >
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
          <Hover
            text="Zoom In"
            extraClasses={ReversedBasemapMap[props.theme]}
            action={setTooltipText}
          >
            <div className="controls-icon">
              <Plus fill="white" />
            </div>
          </Hover>
        </div>
        <div
          className="controls-icon-container"
          onClick={() => adjustViewport({ zoom: props.viewport.zoom - 1 })}
        >
          <Hover
            text="Zoom Out"
            extraClasses={ReversedBasemapMap[props.theme]}
            action={setTooltipText}
          >
            <div className="controls-icon">
              <Minus fill="white" />
            </div>
          </Hover>
        </div>
      </div>
      <Tooltip text={tooltipText} />
    </div>
  );
}
