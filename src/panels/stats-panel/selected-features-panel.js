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
import { aois as viewports } from "data/viewports";
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

import layerGroups, { year } from "layers/layers";
import { LayerName } from "types/dataModel";
import { Icon } from "@iconify/react";

const sum = (acc, cur) => {
  return acc + cur;
};

function MetricContent({ children, contentModifier }) {
  return (
    <div
      className={
        "aeb-content-container " + (contentModifier ? contentModifier : "")
      }
    >
      {children}
    </div>
  );
}

function MetricTitle({ title, Icon, selected, setLayerGroup, clickable }) {
  return (
    <div
      className={
        "aeb-container-title" +
        (selected ? " selected" : "") +
        (clickable ? " clickable" : "")
      }
      onClick={setLayerGroup ? () => setLayerGroup(title) : null}
    >
      <div className="layer-image-container">
        <Icon />
      </div>
      <div className="aeb-title-text-container">
        <h4 className="text-white">{title}</h4>
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
  selected,
  setLayerGroup,
  contentModifier,
  description = "Metric specific description to come here. Only shown when section is hovered.",
  clickable = false,
}) {
  return (
    <div className="aeb-container text-left">
      <MetricTitle
        Icon={icon}
        title={title}
        selected={selected}
        setLayerGroup={setLayerGroup}
      />
      <MetricContent contentModifier={contentModifier}>
        <p className="aeb-container-metric-description">{description}</p>
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
  const stockNoMangroves = useMemo(
    () =>
      getStat(`Ben_Stock_${year}`, selectedFeatures) +
      getStat(`Risk_Stock_${year}`, selectedFeatures),
    [selectedFeatures],
  );
  const stockWithMangroves = useMemo(
    () => getStat(`Risk_Stock_${year}`, selectedFeatures),
    [selectedFeatures],
  );
  const AEB = useMemo(
    () => getStat(`Ben_Stock_${year}`, selectedFeatures),
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
    () => getStat(`Mang_Ha_${year}`, selectedFeatures),
    [selectedFeatures],
  );

  const ben_per_ha = AEB / mangroves2015;
  const stock_risk_reduct_ratio =
    (stockNoMangroves - stockWithMangroves) / stockNoMangroves;

  const piechart_stock_data = [
    { name: "Residual", value: stockWithMangroves },
    { name: "Protected", value: stockNoMangroves - stockWithMangroves },
  ];

  return (
    <>
      <TemplateMetricContainer
        metric={AEB}
        icon={layerGroups[LayerName.Flooding].IconComponent}
        description="The Annual Expected Benefit (AEB) is the expected annual damage reduction due to mangroves based on predicted damages from flooding."
        title="Flooding Damage"
        selected={layerGroup === "Flooding"}
        setLayerGroup={setLayerGroup}
        clickable={true}
      >
        <>
          <div className="flex align-center flex-wrap w-full">
            <p className="w-3/5 italic text-right">Damage w/o Mangroves:</p>
            <p className="ml-2 lining-nums">${kFormatter(stockNoMangroves)}</p>
            <p className="w-3/5 italic text-right">- Damage w/ Mangroves:</p>
            <p className="ml-2 lining-nums">
              ${kFormatter(stockWithMangroves)}
            </p>
            <div className="w-3/5 my-1 -translate-x-2 mx-auto pr-4 self-center	 border-solid border-t-[1px] border-trench" />
            <p className="w-3/5 italic text-right">Total Damage Reduction:</p>
            <p className="ml-2 lining-nums">
              ${kFormatter(stockWithMangroves - stockNoMangroves)}
            </p>
          </div>
          <div className="flex row w-full pt-8 justify-start">
            <ColoredSVGChart
              risk_reduction_ratio={stock_risk_reduct_ratio}
              no_mang={stockNoMangroves}
              with_mang={stockWithMangroves}
            />
            {/* <PieChart2 data={piechart_stock_data} type="STOCK" /> */}
          </div>
        </>
      </TemplateMetricContainer>
      {/* Just saving to reference while reworking this section
      <TemplateMetricContainer
        metric={AEB}
        icon={layerGroups[LayerName.BenefitAEB].IconComponent}
        title="Benefit (AEB) –›"
        height={50}
        selected={layerGroup === "Benefit (AEB)"}
        setLayerGroup={setLayerGroup}
        clickable={true}
      >
        <AEB_equation height={55} />
        <div>=</div>
        
      </TemplateMetricContainer>
      <TemplateMetricContainer
        icon={layerGroups[LayerName.RiskReduction].IconComponent}
        title="Risk Reduction Ratio –›"
        selected={layerGroup === "Risk Reduction Ratio"}
        setLayerGroup={setLayerGroup}
        height={60}
        clickable={true}
      >
        <RRR_equation height={80} />
        <div>=</div>
        
      </TemplateMetricContainer> */}
      <TemplateMetricContainer
        icon={() => (
          <Icon
            icon="icon-park-outline:leaves"
            color="white"
            className="w-5/6 h-5/6"
          />
        )}
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
    </>
  );
}

export default SelectedFeaturesPanel;
