import * as React from "react";
import "../legend.css";
import {
  LegendLayerSwitch,
  LegendLayerToggle,
} from "legends/legend-layer-selector";

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

export default function HexLegend({ legend, children }) {
  const startingPoint = [35, 35];
  const rad = 20;
  const xOffs = 30;
  const yOffs = 5;
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

  const switchChildren = React.Children.toArray(children).filter(
    (child) =>
      React.isValidElement(child) &&
      (child.type === LegendLayerSwitch ||
        child.type.name === LegendLayerSwitch.displayName),
  );

  const toggleChildren = React.Children.toArray(children).filter(
    (child) =>
      React.isValidElement(child) &&
      (child.type === LegendLayerToggle ||
        child.type.name === LegendLayerToggle.displayName),
  );

  return (
    <div className="legend-item wide">
      <div className="legend-layer-title">{legend.layer_title}</div>
      <div className="legend-layer-subtitle">
        Height represents total potential risk. Color represents the reduction
        in risk.
      </div>
      {switchChildren}
      {/* These toggles are only displayed if there is a switch */}
      {toggleChildren}
      <svg width={200} height={200} className="discrete-point-legend">
        {placements
          .map((p) => [p[0], pt_to_hex(p[1][0], p[1][1], rad)])
          .map((h, i) => (
            <polygon
              className="hex"
              key={h + i}
              fill={h[0]}
              stroke="white"
              points={` ${h[1][0][0]},${h[1][0][1]} 
                        ${h[1][1][0]},${h[1][1][1]} 
                        ${h[1][2][0]},${h[1][2][1]} 
                        ${h[1][3][0]},${h[1][3][1]} 
                        ${h[1][4][0]},${h[1][4][1]} 
                        ${h[1][5][0]},${h[1][5][1]}`}
            ></polygon>
          ))}
        {placements.map((p, i) => (
          <text
            key={i}
            className="font-sans"
            fill="white"
            fontSize="1em"
            x={p[1][0] + xOffs}
            y={p[1][1] + yOffs}
          >
            {(legend.breaks[i] * 100).toFixed(0)}%
          </text>
        ))}
      </svg>
      {toggleChildren}
    </div>
  );
}
