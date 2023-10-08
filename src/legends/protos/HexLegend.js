import * as React from "react";
import "../legend.css";

function pt_to_hex(x, y, rad) {
  // clockwise, 6 points
  const angles = [
    Math.PI / 6,
    Math.PI / 3 + Math.PI / 6,
    (Math.PI * 2) / 3 + Math.PI / 6,
    Math.PI + Math.PI / 6,
    (Math.PI * 4) / 3 + Math.PI / 6,
    (Math.PI * 5) / 3 + Math.PI / 6,
  ];
  return angles.map((a) => [x + Math.cos(a) * rad, y + Math.sin(a) * rad]);
}

export default function HexLegend({ legend }) {
  const startingPoint = [45, 50];
  const rad = 30;
  const xOffs = 40;
  const yOffs = 8;
  const padding = 0;
  const placements = legend.colorRamp.map((c, i) => {
    if (i % 2 === 0)
      return [
        c,
        [
          startingPoint[0],
          startingPoint[1] + i * (2 * rad + padding) * Math.cos(Math.PI / 6),
        ],
      ];
    else
      return [
        c,
        [
          startingPoint[0] + (2 * rad + padding) * Math.sin(Math.PI / 6),
          startingPoint[1] + i * (2 * rad + padding) * Math.cos(Math.PI / 6),
        ],
      ];
  });

  return (
    <div className="legend-item">
      <div className="legend-layer-title">{legend.layer_title}</div>
      <div className="legend-layer-subtitle">
        Hex height represents total potential risk.
      </div>
      <svg width={300} height={300} className="discrete-point-legend">
        {placements
          .map((p) => [p[0], pt_to_hex(p[1][0], p[1][1], rad)])
          .map((h) => (
            <polygon
              class="hex"
              fill={h[0]}
              stroke="white"
              points={`${h[1][0][0]},${h[1][0][1]} 
                        ${h[1][1][0]},${h[1][1][1]} 
                        ${h[1][2][0]},${h[1][2][1]} 
                        ${h[1][3][0]},${h[1][3][1]} 
                        ${h[1][4][0]},${h[1][4][1]} 
                        ${h[1][5][0]},${h[1][5][1]}`}
            ></polygon>
          ))}
        {placements.map((p, i) => (
          <text
            class="hex-text"
            fill={p[0]}
            fontSize="1.2em"
            x={p[1][0] + xOffs}
            y={p[1][1] + yOffs}
          >
            {(legend.breaks[i] * 100).toFixed(0)}%
          </text>
        ))}
      </svg>
    </div>
  );
}
