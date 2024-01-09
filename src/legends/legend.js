import * as React from "react";
import { useState, useRef, useMemo } from "react";
import "./legend.css";
import { ReactComponent as OpenCloseToggleIcon } from "../assets/OpenCloseToggle2.svg";

import { all_protos } from "./protos/all_protos";

function OpenCloseToggle({ isOpen, setIsOpen }) {
  const openTransform = {
    transform: "rotate(180deg)",
  };

  return (
    <div
      className="open-close-legend-toggle-container"
      onClick={() => setIsOpen(!isOpen)}
    >
      <p className="open-close-toggle-text">Legend</p>
      <OpenCloseToggleIcon
        className={"open-close-toggle" + (isOpen ? " open" : "")}
        style={isOpen ? openTransform : {}}
      />
    </div>
  );
}

export default function Legend({ legend_items }) {
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef(null);

  const openTransform = {
    transform: "rotate(0deg)",
  };

  const transformOffset =
    !isOpen && ref.current
      ? {
          transform: `translateX(${-ref.current.offsetWidth - 5}px)`,
        }
      : {};

  if (legend_items.length === 0) return null;

  return (
    <div
      className={"legend-container" + (isOpen ? " open" : "")}
      style={transformOffset}
    >
      <div className="legend-content" ref={ref}>
        {legend_items.map((x, i) => {
          const Proto = all_protos[x.layer_type];
          return <Proto legend={x} key={x.layer_title} />;
        })}
      </div>
      {/* <OpenCloseToggle
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        style={isOpen ? openTransform : {}}
      /> */}
    </div>
  );
}
