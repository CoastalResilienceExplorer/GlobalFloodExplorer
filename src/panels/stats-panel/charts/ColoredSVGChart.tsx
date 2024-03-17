import "./Charts.css";
import { kFormatter } from "hooks/utils/formattingUtils";
import { Bar, BarChart, Cell, ReferenceArea, XAxis, YAxis } from "recharts";

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
      width={350}
      height={250}
      data={[
        { name: "Damage w/o mangroves", dollars: no_mang },
        { name: "Damage w/ mangroves", dollars: with_mang },
      ]}
    >
      <XAxis dataKey="name" />
      <YAxis
        type="number"
        tickFormatter={(value) => `$${kFormatter(value, "$", 0)}`}
      />
      <Bar dataKey="dollars">
        <Cell fill={"var(--red-tide)"} />
        <Cell fill={"var(--shoreline)"} />
      </Bar>
      <ReferenceArea
        x1="Damage w/ mangroves"
        x2="Damage w/ mangroves"
        y1={no_mang}
        y2={with_mang}
        shape={<CustomReference riskReductionRatio={risk_reduction_ratio} />}
      />
    </BarChart>
  );
};

export default ColoredSVGChart;

const CustomReference = (props: any) => {
  return (
    <>
      <svg
        width="100"
        height={props.height}
        viewBox="0 0 100 115"
        x={props.x + 130}
        y={props.y}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path d="M0 1H8" stroke="black" />
        <path d="M0 53H8" stroke="black" />
        <path d="M8 114L8 1" stroke="black" />
        <path d="M0 114H8" stroke="black" />
      </svg>
      <svg
        width={100}
        height={props.height * 0.6}
        viewBox={`0 0 100 ${props.height * 0.6}`}
        x={props.x + 35}
        y={props.y}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text y={props.height / 2} fill="#666">
          {kFormatter(props.riskReductionRatio, "%")}% reduction
        </text>
      </svg>
    </>
  );
};
