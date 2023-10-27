import * as React from "react";
import "../legend.css";
import { kFormatter } from "hooks/utils/formattingUtils";

export default function InterpolateLegend({ legend }) {
  const xTextOffs = "50%";
  const max_break = legend.breaks[legend.breaks.length - 1];
  const breaks_as_perc = [
    ...[...Array(legend.breaks.length - 1).keys()].map(
      (i) => legend.breaks[i] / max_break,
    ),
    1,
  ].map((x, i) => [x, legend.colorRamp[i], legend.breaks[i]]);

  return (
    <div className="legend-item">
      <div className="legend-layer-title">{legend.layer_title}</div>
      <svg width="100%" height="100%" className="interpolate-legend">
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          {breaks_as_perc.map((b) => (
            <stop key={b} offset={b[0] * 100 + "%"} stopColor={b[1]} />
          ))}
        </linearGradient>
        <rect
          x="5%"
          y="5%"
          rx="15"
          ry="15"
          width="30%"
          height="90%"
          fill="url(#gradient)"
        />
        {[breaks_as_perc[0], breaks_as_perc[breaks_as_perc.length - 1]].map(
          (b) => (
            <text
              key={b[0]}
              x={xTextOffs}
              y={b[0] * 100 + (50 - b[0] * 30) - 33 + "%"}
              fill="black"
            >
              {">" + (legend.prefix ? legend.prefix : "")}
              {kFormatter(b[2])}
              {"" + (legend.suffix ? legend.suffix : "")}
            </text>
          ),
        )}
      </svg>
    </div>
  );
}
