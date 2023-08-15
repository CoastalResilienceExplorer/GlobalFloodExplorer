import * as React from "react";
import { useState } from "react";
import "./navigation-screen.css";
import { ReactComponent as CloseButton } from "../assets/close-button.svg";

import aois from "../data/aois.json";

const locations = aois.locations;

export default function NavigationScreen(props) {
  function organizeLocations() {
    let buffer = [];
    const roots = locations.filter((x) => !("parent" in x));
    for (const root in roots) {
      const r = roots[root];
      const root_buff = {};
      root_buff[r.id] = [];
      for (const i in locations) {
        const l = locations[i];
        if ("parent" in l && l.parent === r.id) {
          root_buff[r.id].push(l.id);
        }
      }
      buffer = Object.assign(buffer, root_buff);
    }
    return buffer;
  }

  function flyToButton(id) {
    const new_viewport = locations.filter((x) => x.id === id)[0].overview;
    return (
      <div
        className="fly-to-menu-icon"
        onClick={() => {
          props.setNavigationScreenStatus(false);
          props.setViewport(new_viewport);
        }}
      >
        {id}
      </div>
    );
  }

  if (!props.navigationScreenStatus) return null;

  return (
    <div className="navigation-panel-container">
      <div className="navigation-panel">
        <div className="navigation-panel-header">
          <p>Explore the Map</p>
          <div className="close-button-container">
            <CloseButton
              className="close-button"
              onClick={() => props.setNavigationScreenStatus(false)}
            />
          </div>
        </div>
        <div className="navigation-panel-map-places">
          {Object.keys(organizeLocations()).map((x) => (
            <div key={x.id}>
              <h3>{flyToButton(x)}</h3>
              {organizeLocations()[x].map((y) => (
                <div>{flyToButton(y)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
