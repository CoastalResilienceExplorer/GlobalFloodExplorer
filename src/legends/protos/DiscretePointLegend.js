import * as React from "react";
import "../legend.css";
import { kFormatter } from "hooks/utils/formattingUtils";
import {
  LegendLayerSwitch,
  LegendLayerToggle,
} from "legends/legend-layer-selector";

const spacing_styles = {
  CONSTANT: "CONSTANT", //a constant value between each circle
  CENTER_TO_TOP: "CENTER_TO_TOP", //the center of the circle is placed at the top of the circle below it
};

const dimensions = {
  leftMargin: 10,
  rightMargin: 10,
  topMargin: 10,
  bottomMargin: 10,
  ySpread: 50,
  baseSize: 150,
  textPadding: 80,
  additionalBubbleSpacing: 8,
};

export default React.memo(function DiscretePointLegend({
  legend,
  children,
  spacing_style = spacing_styles.CENTER_TO_TOP,
}) {
  const max_width = legend.sizeRamp[legend.sizeRamp.length - 1] * legend.Scale;

  let vertical_placement;
  switch (spacing_style) {
    case spacing_styles.CENTER_TO_TOP:
      vertical_placement = legend.sizeRamp.map((x, i) => {
        return legend.sizeRamp
          .slice(0, i + 1)
          .reduce((a, b) => a + b + dimensions.additionalBubbleSpacing, 0);
      });
      break;
    case spacing_styles.CONSTANT:
      vertical_placement = legend.sizeRamp.map((x, i) => {
        return legend.sizeRamp.slice(0, i).reduce((a, b) => a + 10, 0);
      });
      break;
    default:
      console.error("Invalid spacing style");
  }

  const bubbles_and_text_total_height =
    vertical_placement[vertical_placement.length - 1] +
    max_width +
    dimensions.topMargin +
    dimensions.bottomMargin;

  const bubbles_and_text_total_width =
    2 * max_width +
    dimensions.leftMargin +
    dimensions.textPadding +
    dimensions.rightMargin;

  const xTextOffs = 2 * (max_width + dimensions.leftMargin);

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
    <div className={`legend-item custom-legend-item`}>
      <div className="legend-layer-title">{legend.layer_title}</div>
      <div className="legend-layer-subtitle">{legend.layer_subtitle}</div>
      {switchChildren}
      {/* These toggles are only displayed if there is a switch */}
      {toggleChildren}
      <svg
        width={bubbles_and_text_total_width}
        height={bubbles_and_text_total_height}
        className="discrete-point-legend"
      >
        {legend.joinedColorSize.map((x, i) => {
          return (
            <g key={i}>
              <circle
                cx={max_width + dimensions.leftMargin}
                cy={bubbles_and_text_total_height - vertical_placement[i]}
                r={x.size}
                fill={x.color}
              />
              <circle
                cx={max_width + dimensions.leftMargin}
                cy={bubbles_and_text_total_height - vertical_placement[i]}
                r={x.size}
                fillOpacity={0}
                stroke={legend.strokes.color}
              />
              <text
                x={xTextOffs}
                y={bubbles_and_text_total_height - vertical_placement[i] + 5}
                fill="white"
                className="font-sans"
              >
                {">" + (legend.prefix ? legend.prefix : "")}
                {kFormatter(x.value, legend.format)}
                {"" + (legend.suffix ? legend.suffix : "")}
              </text>
            </g>
          );
        })}
      </svg>
      {/* These toggles are only displayed if there is not a switch */}
      {toggleChildren}
    </div>
  );
});
