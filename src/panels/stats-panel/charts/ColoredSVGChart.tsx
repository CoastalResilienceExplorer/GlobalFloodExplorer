import { useEffect, useRef, useState } from "react";
import "./Charts.css";
import { ReactComponent as FloodingWith_Text } from "assets/Flooding_With.svg";
import { ReactComponent as FloodingWithout_Text } from "assets/Flooding_Without.svg";
import { kFormatter } from "hooks/utils/formattingUtils";
import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis } from "recharts";

export const ColoredSVGChart = ({
  risk_reduction_ratio,
  no_mang,
  with_mang,
}: {
  risk_reduction_ratio: number;
  no_mang: number;
  with_mang: number;
}) => {
  return (
    <BarChart
      width={370}
      height={150}
      layout="vertical"
      data={[
        { name: "Damage with mangroves", dollars: with_mang },
        { name: "Damage without mangroves", dollars: no_mang },
      ]}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <Tooltip
        formatter={(value) => [
          `$${kFormatter(value)} of flooding damage`,
          null,
        ]}
      />
      <XAxis type="number" hide />
      <YAxis type="category" dataKey="name" />
      <Bar dataKey="dollars" layout="vertical">
        <Cell fill={"var(--shoreline)"} />
        <Cell fill={"var(--red-tide)"} />
      </Bar>
    </BarChart>
  );
};

export default ColoredSVGChart;
