import React, { useMemo, useContext } from "react";
import { kFormatter } from "maphooks/utils/formattingUtils";
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

function NoSelectedFeaturesPanel() {
  return (
    <div className="no-selected-features-panel">
      <div className="no-selected-features-panel-text">
        Quick Explorer
        <div className="sub-text">
          Select features to explore metrics, or use one of the zoom links below
        </div>
      </div>
      <MapExplorerButton
        image={FlyTo_Flooding}
        text="Flooding"
        type="flooding"
        region="Zhanjiang"
        group="Flooding"
      />
      <MapExplorerButton
        image={FlyTo_Hex}
        text="Risk Reduction Ratio"
        type="hex"
        region="Florida"
        group="Risk Reduction Ratio"
      />
      <MapExplorerButton
        image={FlyTo_AEB}
        text="Benefit (AEB)"
        type="aeb"
        region="Florida"
        layerKey="AEB"
        group="Benefit (AEB)"
      />
      <MapExplorerButton
        image={FlyTo_perHa}
        text="Benefit per Hectare"
        type="aeb-per-ha"
        region="Zhanjiang"
        group="Benefit per Hectare"
      />
    </div>
  );
}

function getStat(
  metric,
  selectedFeatures,
  distinct = false,
  reduce_by = "sum",
) {
  return () => {
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
  };
}

function SelectedFeaturesPanel({
  selectedFeatures,
  layerGroup,
  setLayerGroup,
}) {
  const stockNoMangroves = useMemo(
    () => getStat("Ab_S_WoAE", selectedFeatures),
    [selectedFeatures],
  );
  const stockWithMangroves = useMemo(
    () => getStat("Ab_S_WAE", selectedFeatures),
    [selectedFeatures],
  );
  const AEB = useMemo(
    () => getStat("Ab_S_BAE", selectedFeatures),
    [selectedFeatures],
  );
  const mangroves1996 = useMemo(
    () => getStat("Man1996", selectedFeatures),
    [selectedFeatures],
  );
  const mangroves2010 = useMemo(
    () => getStat("Man2010", selectedFeatures),
    [selectedFeatures],
  );
  const mangroves2015 = useMemo(
    () => getStat("Man2015", selectedFeatures),
    [selectedFeatures],
  );

  const ben_per_ha = AEB / mangroves2010;
  const stock_risk_reduct_ratio =
    (stockNoMangroves - stockWithMangroves) / stockNoMangroves;

  const totalStock_10_WO = useMemo(
    () => getStat("Ab_S_Wo10", selectedFeatures),
    [selectedFeatures],
  );
  const totalStock_25_WO = useMemo(
    () => getStat("Ab_S_Wo25", selectedFeatures),
    [selectedFeatures],
  );
  const totalStock_50_WO = useMemo(
    () => getStat("Ab_S_Wo50", selectedFeatures),
    [selectedFeatures],
  );
  const totalStock_100_WO = useMemo(
    () => getStat("Ab_S_Wo100", selectedFeatures),
    [selectedFeatures],
  );
  const totalStock_10_W = useMemo(
    () => getStat("Ab_S_W10", selectedFeatures),
    [selectedFeatures],
  );
  const totalStock_25_W = useMemo(
    () => getStat("Ab_S_W25", selectedFeatures),
    [selectedFeatures],
  );
  const totalStock_50_W = useMemo(
    () => getStat("Ab_S_W50", selectedFeatures),
    [selectedFeatures],
  );
  const totalStock_100_W = useMemo(
    () => getStat("Ab_S_W100", selectedFeatures),
    [selectedFeatures],
  );

  const linechart_data = [
    { name: "RP10", with: totalStock_10_W, without: totalStock_10_WO },
    { name: "RP25", with: totalStock_25_W, without: totalStock_25_WO },
    { name: "RP50", with: totalStock_50_W, without: totalStock_50_WO },
    { name: "RP100", with: totalStock_100_W, without: totalStock_100_WO },
  ];

  const piechart_stock_data = [
    { name: "Residual", value: stockWithMangroves },
    { name: "Protected", value: stockNoMangroves - stockWithMangroves },
  ];

  if (selectedFeatures.length === 0) {
    return <NoSelectedFeaturesPanel />;
  }

  return (
    <div onScroll={(e) => console.log(e)}>
      {/* <MetricHeadlineContainer metric={AEB} title='Annual Expected Benefit' conRef={aebRef} /> */}
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
      <TemplateMetricContainer
        icon={StormIcon}
        title="Expected Damages"
        height={220}
      >
        <LineChart2 data={linechart_data} />
      </TemplateMetricContainer>
      {/* <TemplateMetricContainer icon={HEX} title='National Site Rank' height={150} contentModifier='start'>
            <CountryLevelList countries={countries} highlightFIDs={fids} />
        </TemplateMetricContainer> */}
    </div>
  );
}

export default SelectedFeaturesPanel;
