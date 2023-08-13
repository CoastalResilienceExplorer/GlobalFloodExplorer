import React from "react";
import {
  PieChart,
  Legend,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./Charts.css";
import { kFormatter } from "maphooks/utils/formattingUtils";

const COLORS1 = ["#7bccc4", "rgba(0,0,0,0)"];
const COLORS2 = ["rgba(0,0,0,0)", "#C76F85"];
const STROKES1 = ["#FFFFFF", "rgba(0,0,0,0)"];
const STROKES2 = ["rgba(0,0,0,0)", "#FFFFFF"];
const RADIAN = Math.PI / 180;

const GRAPH_TYPE = {
  STOCK: {
    title: "Building Stock Protected",
    description: " building stock risk reduction",
    valueFormatter: (data) =>
      (
        (data.filter((d) => d.name === "Protected")[0].value /
          data.map((d) => d.value).reduce((a, b) => a + b, 0)) *
        100
      ).toFixed(1) + "%",
  },
  PEOPLE: {
    title: "People Protected",
    description: " fewer people flooded annually",
    valueFormatter: (data) =>
      kFormatter(data.filter((d) => d.name === "Protected")[0].value),
  },
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="1.5em"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function RenderActiveShape({ center, nombre }) {
  return (
    <g>
      <text x={center} y={center} dy={8} textAnchor="middle">
        {nombre}
      </text>
    </g>
  );
}

export default function Example({ data, type }) {
  const percReduction = (
    data.filter((d) => d.name === "Protected")[0].value /
    data.map((d) => d.value).reduce((a, b) => a + b, 0)
  ).toFixed(2);

  return (
    <PieChart width={130} height={150}>
      <Pie
        data={data}
        cx="50%"
        cy="45%"
        innerRadius={35}
        outerRadius={60}
        // label={renderCustomizedLabel}
        // labelLine={false}
        paddingAngle={5}
        stroke="none"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS2[index % COLORS2.length]}
            stroke={STROKES2[index % STROKES2.length]}
          />
        ))}
      </Pie>
      <Pie
        data={data}
        cx="50%"
        cy="45%"
        innerRadius={30}
        outerRadius={50}
        labelLine={false}
        stroke="none"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS1[index % COLORS1.length]}
            stroke={STROKES1[index % STROKES1.length]}
          />
        ))}
      </Pie>
      <g>
        <text x="50%" y="45%" dy={10} textAnchor="middle" fontSize={"2.2em"}>
          {(percReduction * 100).toFixed(0) + "%"}
        </text>
        <text x="50%" y="45%" dy={22} textAnchor="middle" fontSize={"1.0em"}>
          risk reduction possible
        </text>
      </g>
      {/* <Legend align='center' height={10} /> */}
    </PieChart>
  );
}
