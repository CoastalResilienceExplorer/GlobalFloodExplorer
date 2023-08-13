import "./compass.css";
import * as React from "react";
import { ReactComponent as CompassSVG } from "assets/compass.svg";

export default function Compass(props) {
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

  return (
    <>
      <div className="compass-panel" onClick={alignViewport}>
        <div className="compass-container" ref={props._ref}>
          <CompassSVG
            className="compass"
            style={{
              transform: `
                    rotateX(${props.viewport.pitch}deg)
                    rotateZ(${-props.viewport.bearing}deg)  
                    `,
            }}
          ></CompassSVG>
        </div>
      </div>
    </>
  );
}
