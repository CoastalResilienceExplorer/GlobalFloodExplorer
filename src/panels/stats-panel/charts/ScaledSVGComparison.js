import * as React from "react";
import "./Charts.css";

function SVGIcon({ Icon, size }) {
  return (
    <div className="svg-comparison-icon-with-text-container">
      <Icon style={{ height: size, width: size }} />
    </div>
  );
}

function DescriptorContainer({ year, size, _style }) {
  return (
    <div className="descriptor-container">
      <div className={"descriptor-container-year " + _style}>{year}</div>
      <div className="descriptor-container-size">{size} hectares</div>
    </div>
  );
}

export default function ScaledSVGComparison({
  Icon,
  title,
  size1,
  size2,
  scaleSize = 80,
  minSize = 10,
}) {
  const ratio = Math.max(size1, size2) / scaleSize;

  const size1_adj = Math.max(size1 / ratio, minSize) + "px";
  const size2_adj = Math.max(size2 / ratio, minSize) + "px";

  const increase_bool = size2 > size1;
  const equal_bool = size2 === size1;

  if (size1 === 0 && size2 === 0)
    return (
      <div className="aeb-content-container">
        No mangroves in selected study unit. Benefits come from mangroves in
        adjacent coastal areas.
      </div>
    );

  return (
    <div className="aeb-content-container">
      <DescriptorContainer year="1996" size={size1} _style="first" />
      <SVGIcon Icon={Icon} size={size1_adj} />
      <div className="svg-comparison-percent-change">
        <div className="svg-comparison-percent-text">
          {Math.abs(((size2 - size1) / size1) * 100).toFixed(0) + "%"}
        </div>
        {increase_bool && "increase"}
        {equal_bool && "change"}
        {!increase_bool && !equal_bool && "decrease"}
      </div>
      <div className="svg-comparison-icon-flipped">
        <SVGIcon
          className="svg-comparison-icon-flipped"
          Icon={Icon}
          size={size2_adj}
        />
      </div>
      <DescriptorContainer year="2015" size={size2} _style="second" />
    </div>
  );
}
