import "./compass.css";
import * as React from "react";
import { ReactComponent as CompassSVG } from "assets/compass.svg";
import { ReactComponent as MapSVG } from "assets/Map_Icon.svg";
import { ReactComponent as Plus } from "assets/Plus.svg";
import { ReactComponent as Minus } from "assets/Minus.svg";

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

  function zoomToHome() {
    props.setViewport({
      latitude: 0,
      longitude: 0,
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      transitionDuration: 500,
    });
  }

  function zoomInOut(val) {
    const viewport_base = {
      latitude: props.viewport.latitude,
      longitude: props.viewport.longitude,
      zoom: props.viewport.zoom,
      pitch: props.viewport.pitch,
      bearing: props.viewport.bearing,
      transitionDuration: 500,
    };
    const viewport_to = Object.assign(viewport_base, {
      zoom: props.viewport.zoom + val,
    });
    props.setViewport(viewport_to);
  }

  return (
    <>
      <div className="compass-panel">
        <div
          className="compass-container"
          ref={props._ref}
          onClick={alignViewport}
        >
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
        <div className="full-extent-zoom" onClick={zoomToHome}>
          <div className="full-extent-zoom-container">
            <MapSVG
              style={{
                width: "80%",
              }}
            />
          </div>
        </div>
        <div
          className="plus-minus-zoom-container plus"
          onClick={() => zoomInOut(1)}
        >
          <div className="plus-minus-zoom-icon">
            <Plus />
          </div>
        </div>
        <div
          className="plus-minus-zoom-container minus"
          onClick={() => zoomInOut(-1)}
        >
          <div className="plus-minus-zoom-icon">
            <Minus />
          </div>
        </div>
      </div>
    </>
  );
}
