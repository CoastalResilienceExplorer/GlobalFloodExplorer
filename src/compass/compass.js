import "./compass.css";
import * as React from "react";
import { ReactComponent as CompassSVG } from "assets/compass.svg";
import { ReactComponent as MapSVG } from "assets/Map_Icon.svg"
import { ReactComponent as Plus } from "assets/Plus.svg"
import { ReactComponent as Minus } from "assets/Minus.svg"
import { ReactComponent as Controls } from "assets/Controls.svg"
import Hover from "components/hover";

export default function Compass(props) {

  function adjustViewport(adjustment, transitionDuration = 500) {
    const newViewport = Object.assign(
      props.viewport,
      adjustment
    )
    props.setViewport(newViewport)
  }

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
    <div className="controls-panel-container">
      <div className="controls-panel-title">Controls</div>
      <div className="controls-panel" ref={props._ref}>
        <div className="controls-icon-container" onClick={alignViewport}>
          <Hover
            text="2D">
            <div className="controls-icon" onClick={() => adjustViewport({ pitch: 0 })}>
              2D
            </div>
          </Hover>
        </div>
        <div className="controls-icon-container" onClick={() => adjustViewport({ bearing: 0 })}>
          <Hover
            text="Reorient">
            <CompassSVG
              className="controls-icon compass"
              style={{
                transform: `
                    rotateX(${props.viewport.pitch}deg)
                    rotateZ(${-props.viewport.bearing}deg)  
                    `,
              }}
            ></CompassSVG>
          </Hover>
        </div>
        <div className="controls-icon-container" onClick={() => adjustViewport({
          latitude: 0,
          longitude: 0,
          zoom: 1.8,
          pitch: 0,
          bearing: 0
        })}>
          <div className="controls-icon zoom-full">
            <Hover
              text="Zoom Full">
              <MapSVG />
            </Hover>
          </div>
        </div>
        <div className="controls-icon-container" onClick={() => props.setNavigationControls(!props.naviationControls)}>
          <Hover
            text="Controls">
            <div className="controls-icon">
              <Controls />
            </div>
          </Hover>
        </div>
        <div className="controls-icon-container" onClick={() => adjustViewport({ zoom: props.viewport.zoom+1 })}>
          <Hover
            text="Zoom In">
            <div className="controls-icon">
              <Plus />
            </div>
          </Hover>
        </div>
        <div className="controls-icon-container" onClick={() => adjustViewport({ zoom: props.viewport.zoom-1 })}>
          <Hover
            text="Zoom Out">
            <div className="controls-icon">
              <Minus />
            </div>
          </Hover>
        </div>
      </div>
    </div>
  );
}
