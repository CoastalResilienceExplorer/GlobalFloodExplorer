import React, { useMemo, useContext } from "react";
import { kFormatter } from "hooks/utils/formattingUtils";
import "./selected-features-panel.css";
import "./stats-panel-container.css";

// Charts
import LineChart2 from "./charts/LineChart2";
import PieChart2 from "./charts/PieChart2";
import ColoredSVGChart from "./charts/ColoredSVGChart";
import ScaledSVGComparison from "./charts/ScaledSVGComparison";

import { aois as viewports } from "data/viewports";
import FlyToContext from "../FlyToContext";

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
  contentModifier,
  description = "Metric specific description to come here. Only shown when section is hovered.",
}) {
  return (
    <div className="aeb-container text-left">
      <MetricTitle Icon={icon} title={title} />
      <MetricContent contentModifier={contentModifier}>
        <p className="aeb-container-metric-description px-2">{description}</p>
        {children}
      </MetricContent>
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
  selectedYear,
  setLayerGroup,
}) {
  const stockNoMangroves = useMemo(
    () =>
      getStat(`Ben_Stock_${selectedYear}`, selectedFeatures) +
      getStat(`Risk_Stock_${selectedYear}`, selectedFeatures),
    [selectedFeatures, selectedYear],
  );
  const stockWithMangroves = useMemo(
    () => getStat(`Risk_Stock_${selectedYear}`, selectedFeatures),
    [selectedFeatures, selectedYear],
  );
  const popNoMangroves = useMemo(
    () =>
      getStat(`Ben_Pop_${selectedYear}`, selectedFeatures) +
      getStat(`Risk_Pop_${selectedYear}`, selectedFeatures),
    [selectedFeatures, selectedYear],
  );
  const popWithMangroves = useMemo(
    () => getStat(`Risk_Pop_${selectedYear}`, selectedFeatures),
    [selectedFeatures, selectedYear],
  );
  const AEB = useMemo(
    () => getStat(`Ben_Stock_${selectedYear}`, selectedFeatures),
    [selectedFeatures, selectedYear],
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
    () => getStat(`Mang_Ha_2015`, selectedFeatures),
    [selectedFeatures],
  );

  const stock1996 = useMemo(
    () => getStat(`Ben_Stock_1996`, selectedFeatures),
    [selectedFeatures],
  );
  const stock2010 = useMemo(
    () => getStat(`Ben_Stock_2010`, selectedFeatures),
    [selectedFeatures],
  );
  const stock2015 = useMemo(
    () => getStat(`Ben_Stock_2015`, selectedFeatures),
    [selectedFeatures],
  );

  const ben_per_ha = AEB / mangroves2015;
  const stock_risk_reduct_ratio =
    (stockNoMangroves - stockWithMangroves) / stockNoMangroves;

  const piechart_pop_data = [
    { name: "Residual", value: popWithMangroves },
    { name: "Protected", value: popNoMangroves - popWithMangroves },
  ];

  const linechart_data = [
    { name: 1996, stock: stock1996, mangroves: mangroves1996 },
    { name: 2010, stock: stock2010, mangroves: mangroves2010 },
    { name: 2015, stock: stock2015, mangroves: mangroves2015 },
  ];

  const domain_gap = 0.01;

  const linechart_keys = [
    {
      id: "stock",
      fill: "#7bccc4",
      axisOrientation: "left",
      tickFormatter: (tick) => {
        return "$" + kFormatter(tick);
      },
      domain: [
        Math.min(...linechart_data.map((d) => d.stock)) * (1 - domain_gap),
        Math.max(...linechart_data.map((d) => d.stock)) * (1 + domain_gap),
      ],
    },
    {
      id: "mangroves",
      fill: "#C76F85",
      axisOrientation: "right",
      tickFormatter: (tick) => {
        return kFormatter(tick) + " ha";
      },
      domain: [
        Math.min(...linechart_data.map((d) => d.mangroves)) * (1 - domain_gap),
        Math.max(...linechart_data.map((d) => d.mangroves)) * (1 + domain_gap),
      ],
    },
  ];

  const mangrove_disclaimer_text =
    "This analysis accounts changes in mangroves, population and coastal wealth over time. Flood risk benefits from mangroves grow signficantly with increases in coasal population and wealth.";

  return (
    <>
      <TemplateMetricContainer
        icon={layerGroups[LayerName.BenefitAEB].IconComponent}
        description="Annual Expected Benefit (AEB) is amount that mangroves are expected to reduce flood damage each year."
        title="Economic Benefit"
      >
        <>
          <div className="flex align-center flex-wrap w-full">
            <p className="w-3/5 italic text-right">Damages w/o Mangroves:</p>
            <p className="ml-2 lining-nums">${kFormatter(stockNoMangroves)}</p>
            <p className="w-3/5 italic text-right">- Damages w/ Mangroves:</p>
            <p className="ml-2 lining-nums">
              ${kFormatter(stockWithMangroves)}
            </p>
            <div className="w-3/5 my-1 -translate-x-2 mx-auto pr-4 self-center	 border-solid border-t-[1px] border-trench" />
            <p className="w-3/5 italic text-right">Total Damage Reduction:</p>
            <p className="ml-2 lining-nums">
              <b>${kFormatter(stockWithMangroves - stockNoMangroves)}</b>
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

      <TemplateMetricContainer
        icon={layerGroups[LayerName.Population].IconComponent}
        description="Changes in mangrove extent and their economic benefits from 1996-2015."
        title="Changing Mangroves & Benefits"
        height={50}
      >
        <>
          <div className="flex align-right flex-wrap">
            <p className="italic text-center px-2">
              {mangrove_disclaimer_text}
            </p>
          </div>
        </>
        <LineChart2 data={linechart_data} keys={linechart_keys} type="STOCK" />
      </TemplateMetricContainer>

      <TemplateMetricContainer
        icon={layerGroups[LayerName.Population].IconComponent}
        description="Population Benefit is number of people that mangroves protect from flooding each year."
        title="Population Benefit"
        height={50}
      >
        <>
          <div className="flex align-center flex-wrap">
            <p className="w-4/5 italic text-center">
              People flooded w/o Mangroves:
            </p>
            <p className="ml-2 lining-nums">{kFormatter(popNoMangroves)}</p>
            <p className="w-4/5 italic text-center">
              - People flooded w/ Mangroves:
            </p>
            <p className="ml-2 lining-nums">{kFormatter(popWithMangroves)}</p>
            <div className="w-4/5 my-1 -translate-x-2 mx-auto pr-4 self-center	 border-solid border-t-[1px] border-trench" />
            <p className="w-3/5 italic text-right">Total Protection:</p>
            <p className="ml-2 lining-nums">
              <b>{kFormatter(popWithMangroves - popNoMangroves)}</b>
            </p>
          </div>
        </>
        <PieChart2 data={piechart_pop_data} type="STOCK" />
      </TemplateMetricContainer>
    </>
  );
}

export default SelectedFeaturesPanel;
