import { PieChart, Pie, Cell } from "recharts";
import "./Charts.css";

const COLORS1 = ["#7bccc4", "rgba(0,0,0,0)"];
const COLORS2 = ["rgba(0,0,0,0)", "#C76F85"];
const STROKES1 = ["#FFFFFF", "rgba(0,0,0,0)"];
const STROKES2 = ["rgba(0,0,0,0)", "#FFFFFF"];

const CustomPieChart = ({ data, type }) => {
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
        paddingAngle={3}
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
        innerRadius={35}
        outerRadius={55}
        labelLine={false}
        stroke="none"
        paddingAngle={3}
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
};

export default CustomPieChart;
