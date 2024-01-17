import React, { useMemo, useContext } from "react";
import { kFormatter } from "hooks/utils/formattingUtils";
import "./selected-features-panel.css";
import "./stats-panel-container.css";

// Charts
import LineChart2 from "./charts/LineChart2";
import PieChart2 from "./charts/PieChart2";
import ColoredSVGChart from "./charts/ColoredSVGChart";
import ScaledSVGComparison from "./charts/ScaledSVGComparison";

// Zoom To Icons
import FlyTo_AEB from "assets/Snapshot_AEB_out.png";
import FlyTo_perHa from "assets/Snapshot_AEB_Zoom.png";
import FlyTo_Flooding from "assets/Snapshot_Flooding.png";
import FlyTo_Hex from "assets/Snapshot_Hex.png";
import viewports from "data/viewports.json";
import FlyToContext from "../FlyToContext";

// Metric Panel Icons
import aeb_ha from "assets/AEB_ha_square.png";
import aeb from "assets/AEB_square.png";
import HEX from "assets/HEX_square.png";
import Flood from "assets/Flood_square.png";
import MangroveExtent from "assets/Mangrove_Extent.png";
import StormIcon from "assets/Storm_Icon.png";

// In-Panel Icons
import { ReactComponent as MangroveIcon } from "assets/Mangrove.svg";
import { ReactComponent as AEB_equation } from "assets/AEB_equation.svg";
import { ReactComponent as AEBperHectare_equation } from "assets/AEBperHECTARE.svg";
import { ReactComponent as RRR_equation } from "assets/RiskReductionRatio.svg";

const sum = (acc, cur) => {
  return acc + cur;
};

function MetricIcon({ image }) {
  return (
    <div className="layer-image-container">
      <img src={image} className="layer-icon" alt="" />
    </div>
  );
}

function MetricContent({ children, height = 50, contentModifier }) {
  return (
    <div
      className={
        "aeb-content-container " + (contentModifier ? contentModifier : "")
      }
      style={{ height: height + "px" }}
    >
      {children}
    </div>
  );
}

function MetricTitle({ title, icon, selected, setLayerGroup, clickable }) {
  return (
    <div
      className={
        "aeb-container-title" +
        (selected ? " selected" : "") +
        (clickable ? " clickable" : "")
      }
      onClick={setLayerGroup ? () => setLayerGroup(title) : null}
    >
      <MetricIcon image={icon} />
      <div className="aeb-title-text-container">
        <div className="aeb-title-text">{title}</div>
      </div>
    </div>
  );
}

function SimpleMetric({ metric, suffix, formatter = "$" }) {
  return (
    <div className="aeb-number-text">
      ${kFormatter(metric, formatter)}
      {suffix ? suffix : null}
    </div>
  );
}

function TemplateMetricContainer({
  title,
  icon,
  children,
  height,
  selected,
  setLayerGroup,
  contentModifier,
  clickable = false,
}) {
  return (
    <div className="aeb-container">
      <MetricTitle
        icon={icon}
        title={title}
        selected={selected}
        setLayerGroup={setLayerGroup}
        clickable={clickable}
      />
      <MetricContent height={height} contentModifier={contentModifier}>
        {children}
      </MetricContent>
    </div>
  );
}

function MapExplorerButton({ image, text, type = "x", region, group }) {
  const { flyToViewport, setLayerGroup } = useContext(FlyToContext);

  return (
    <div className={`fly-to-icon ${type}`}>
      <img
        src={image}
        alt=""
        onClick={() => {
          flyToViewport(viewports.filter((x) => x.id === region)[0].overview);
          setLayerGroup(group);
        }}
      />
      <div className="fly-to-icon-text">{text}</div>
    </div>
  );
}

function getStat(
  metric,
  selectedFeatures,
  distinct = false,
  reduce_by = "sum",
) {
  let return_val;
  return_val = selectedFeatures.map((x) => x.properties[metric]);
  if (distinct) return_val = [...new Set(return_val)];
  switch (reduce_by) {
    case "sum":
      return_val = return_val.reduce(sum, 0);
      break;
    default:
      break;
  }
  return return_val;
}

function SelectedFeaturesPanel({
  selectedFeatures,
  layerGroup,
  setLayerGroup,
}) {
  let year = 2020;
  if (year === 2015) {
    year = "";
  } else {
    year = `_${year}`;
  }
  const stockNoMangroves = useMemo(
    () =>
      getStat(`Ben_Stock${year}`, selectedFeatures) +
      getStat(`Risk_Stock${year}`, selectedFeatures),
    [selectedFeatures],
  );
  const stockWithMangroves = useMemo(
    () => getStat(`Risk_Stock${year}`, selectedFeatures),
    [selectedFeatures],
  );
  const AEB = useMemo(
    () => getStat(`Ben_Stock${year}`, selectedFeatures),
    [selectedFeatures],
  );
  const mangroves1996 = useMemo(
    () => getStat(`Mang_Ha_1996`, selectedFeatures),
    [selectedFeatures],
  );
  const mangroves2010 = useMemo(
    () => getStat(`Mang_Ha_2010`, selectedFeatures),
    [selectedFeatures],
  );
  const mangroves2015 = useMemo(
    () => getStat(`Mang_Ha`, selectedFeatures),
    [selectedFeatures],
  );

  const ben_per_ha = AEB / mangroves2010;
  const stock_risk_reduct_ratio =
    (stockNoMangroves - stockWithMangroves) / stockNoMangroves;

  const piechart_stock_data = [
    { name: "Residual", value: stockWithMangroves },
    { name: "Protected", value: stockNoMangroves - stockWithMangroves },
  ];

  return (
    <div>
      <TemplateMetricContainer
        metric={AEB}
        icon={Flood}
        title="Flooding"
        height={110}
        selected={layerGroup === "Flooding"}
        setLayerGroup={setLayerGroup}
        clickable={true}
      >
        <ColoredSVGChart
          risk_reduction_ratio={stock_risk_reduct_ratio}
          no_mang={stockNoMangroves}
          with_mang={stockWithMangroves}
        />
      </TemplateMetricContainer>
      <TemplateMetricContainer
        metric={AEB}
        icon={aeb}
        title="Benefit (AEB)"
        height={50}
        selected={layerGroup === "Benefit (AEB)"}
        setLayerGroup={setLayerGroup}
        clickable={true}
      >
        <AEB_equation height={55} />
        <div>=</div>
        <SimpleMetric metric={AEB} />
      </TemplateMetricContainer>
      <TemplateMetricContainer
        metric={ben_per_ha}
        icon={aeb_ha}
        title="Benefit per Hectare"
        height={60}
        selected={layerGroup === "Benefit per Hectare"}
        setLayerGroup={setLayerGroup}
        clickable={true}
      >
        {mangroves2010 === 0 ? (
          <div className="aeb-content-container">
            No mangroves in selected study unit. Benefits come from mangroves in
            adjacent coastal areas.
          </div>
        ) : (
          <>
            <AEBperHectare_equation height={80} />
            <div>=</div>
            <SimpleMetric metric={ben_per_ha} suffix="/ha" />
          </>
        )}
      </TemplateMetricContainer>
      <TemplateMetricContainer
        icon={HEX}
        title="Risk Reduction Ratio"
        selected={layerGroup === "Risk Reduction Ratio"}
        setLayerGroup={setLayerGroup}
        height={60}
        clickable={true}
      >
        <RRR_equation height={80} />
        <div>=</div>
        <PieChart2 data={piechart_stock_data} type="STOCK" />
      </TemplateMetricContainer>
      <TemplateMetricContainer
        icon={MangroveExtent}
        title="Mangrove Change"
        height={80}
      >
        <ScaledSVGComparison
          Icon={MangroveIcon}
          title="Mangrove Trend"
          size1={mangroves1996}
          size2={mangroves2015}
          scaleSize={85}
        />
      </TemplateMetricContainer>
    </div>
  );
}

export default SelectedFeaturesPanel;
