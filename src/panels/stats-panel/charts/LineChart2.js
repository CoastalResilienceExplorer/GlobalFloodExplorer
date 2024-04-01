import React from "react";
import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { kFormatter } from "hooks/utils/formattingUtils";
import "./Charts.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active) return <></>;
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-linechart">
        <p className="desc lining-nums">
          <div>{`Economic Benefit:`}</div>
          <div>{`$${kFormatter(payload[0].payload.stock)}`}</div>
        </p>
        <p className="desc lining-nums">
          <div>{`Mangroves:`}</div>
          <div>{`${kFormatter(payload[0].payload.mangroves)} ha`}</div>
        </p>
      </div>
    );
  }

  return null;
};

export default function Example({ data, keys }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        width={500}
        height={110}
        data={data}
        margin={{
          top: 15,
          right: 30,
          left: 5,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" dy={5} />
        {keys.map((k) => (
          <YAxis
            key={k.id}
            yAxisId={k.id}
            orientation={k.axisOrientation}
            tickFormatter={k.tickFormatter}
            domain={k.domain}
          ></YAxis>
        ))}
        <Tooltip content={<CustomTooltip />} />
        <Legend align="right" height={10} />
        {keys.map((k) => (
          <Line
            key={k.id}
            yAxisId={k.id}
            type="monotone"
            dataKey={k.id}
            stroke={k.fill}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
