import React from "react";
import "./breadcrumbs.css";

import aois from "data/aois.json";

const locations = aois.locations;

function Breadcrumb({ crumb, category, setViewport }) {
  return (
    <div
      className="crumb-container"
      onClick={() => {
        const new_viewport = locations.filter((x) => x.id === crumb)[0]
          .overview;
        setViewport(new_viewport);
      }}
    >
      <div className="crumb-circle-holder">
        <div className={`crumb-circle ${category}`} />
      </div>
      <div className={`crumb-text ${category}`}>{crumb}</div>
    </div>
  );
}

function Breadcrumbs({ crumbs, setViewport }) {
  return (
    <div className="breadcrumb-layout">
      <Breadcrumb
        crumb={crumbs[0]}
        category="major"
        setViewport={setViewport}
      />
      {crumbs.slice(1).map((crumb) => (
        <Breadcrumb crumb={crumb} category="minor" setViewport={setViewport} />
      ))}
    </div>
  );
}

export default Breadcrumbs;
