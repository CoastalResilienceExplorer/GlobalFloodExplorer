import React from "react";
import {
  CartesianGrid,
  Legend,
  Label,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { kFormatter } from "hooks/utils/formattingUtils";
import "./Charts.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active) return <></>;
  const rp = label.slice(2);
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-linechart">
        <p className="label">{`1 in ${rp} year flood`}</p>
        <p className="desc">
          <div>{`Without:`}</div>
          <div>{`$${kFormatter(payload[0].payload.without)}`}</div>
        </p>
        <p className="desc">
          <div>{`With:`}</div>
          <div>{`$${kFormatter(payload[0].payload.with)}`}</div>
        </p>
      </div>
    );
  }

  return null;
};

export default function Example({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
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
        <YAxis
          tickFormatter={(tick) => {
            return "$" + kFormatter(tick);
          }}
        >
          {/* <Label angle={-90} value='Expected Damage (USD)' offset={15} position='insideLeft' style={{textAnchor: 'middle'}} /> */}
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Legend align="right" height={10} />
        <Area
          type="monotone"
          dataKey="without"
          fillOpacity={1}
          fill="#C76F85"
          stroke="none"
          activeDot={{ r: 5 }}
        />
        <Area
          type="monotone"
          dataKey="with"
          fillOpacity={1}
          fill="#7bccc4"
          stroke="none"
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
