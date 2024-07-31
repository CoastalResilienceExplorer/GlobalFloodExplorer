import { memo, useRef } from "react";
import "./legend.css";

import { all_protos } from "./protos/all_protos";

export default memo(function Legend({ legend_items, children }) {
  const isOpen = true;
  const ref = useRef(null);

  const transformOffset =
    !isOpen && ref.current
      ? { transform: `translateX(${-ref.current.offsetWidth - 5}px)` }
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
          return (
            <Proto legend={x} key={x.layer_title}>
              {children}
            </Proto>
          );
        })}
      </div>
    </div>
  );
});
