import React, { useEffect, useRef, useState } from "react";
import "./Charts.css";
import { ReactComponent as FloodingWith_Text } from "assets/Flooding_With.svg";
import { ReactComponent as FloodingWithout_Text } from "assets/Flooding_Without.svg";
import { kFormatter } from "hooks/utils/formattingUtils";

export default function ColoredSVGChart({
  risk_reduction_ratio,
  no_mang,
  with_mang,
}) {
  const prevValue = useRef(null);
  const [background, setBackground] = useState(
    `linear-gradient(90deg, #C76F85 0%, #7bccc4 0%, #7bccc4 100%)`,
  );
  const startTime = useRef(null);

  useEffect(() => {
    const stops = 1500;
    function step() {
      if (!startTime.current) startTime.current = new Date().getTime();
      const now = new Date().getTime();
      const elapsed = now - startTime.current;
      if (elapsed > stops) {
        setBackground(
          () => `linear-gradient(
                    90deg, #C76F85 ${risk_reduction_ratio * 100}%, 
                    #7bccc4 ${risk_reduction_ratio * 100}%, 
                    #7bccc4 100%)`,
        );

        prevValue.current = risk_reduction_ratio;
        startTime.current = null;
      } else {
        const intermediateValue =
          prevValue.current -
          ((prevValue.current - risk_reduction_ratio) * elapsed) / stops;

        setBackground(
          () => `linear-gradient(
                    90deg, #C76F85 ${intermediateValue * 100}%, 
                    #7bccc4 ${intermediateValue * 100}%, 
                    #7bccc4 100%)`,
        );
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }, [risk_reduction_ratio]);

  return (
    <div className="flooding-body">
      <div className="flooding-header">
        <div className="flooding-header-mangrove-icon-w-text">
          <FloodingWithout_Text height={50} fill="#C76F85" />
        </div>
        <div className="flooding-header-mangrove-icon-w-text end">
          <FloodingWith_Text height={50} fill="#7bccc4" />
        </div>
      </div>
      <div
        className="svg-background-homes"
        style={{
          background: background,
        }}
      ></div>
      <div className="flooding-metrics">
        <div className="metric nomang">${kFormatter(no_mang, "$")}</div>
        <div className="metric withmang">${kFormatter(with_mang, "$")}</div>
      </div>
    </div>
  );
}
