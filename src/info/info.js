import { useRef } from "react";
import "./info.css";

export default function Info({ activeInfo, refs, allTheThings }) {
  const dotRef = useRef();
  const infoToText = {
    FIRST_3D: {
      text: "To reorient the map, click the compass",
      ref: refs.COMPASS,
      with_dot: true,
      style: "orange",
    },
    FIRST_SELECT: {
      text: "Click for metrics",
      ref: refs.SELECT,
      with_dot: true,
      style: "orange",
    },
    FIRST_FLOODING: {
      text: "Toggle available flood layers",
      ref: refs.FLOOD,
      with_dot: true,
      style: "orange",
    },
    FIRST_FLOODING_ZOOM_IN: {
      text: "Zoom in to view flood layers",
      ref: refs.FLOOD_ZOOM,
      with_dot: false,
      style: "grey",
    },
    FIRST_HEX: {
      text: "Tilt the map with CTL + drag",
      ref: refs.LOWER_MIDDLE,
      with_dot: false,
      style: "grey",
    },
    FIRST_HOVER: {
      text: "Zoom To",
      ref: refs.LOWER_MIDDLE,
      with_dot: false,
      style: "grey",
    },
    FILTER_HOVER: {
      text: "Zoom To",
      ref: refs.LOWER_MIDDLE,
      with_dot: false,
      style: "grey",
    },
  };

  const { innerWidth, innerHeight } = window;

  return (
    <>
      {activeInfo &&
        activeInfo.length > 0 &&
        activeInfo.map(
          (i) =>
            infoToText[i].ref.current && (
              <div
                className="tooltip-container"
                style={{
                  position: "absolute",
                  zIndex: 5,
                  top:
                    infoToText[i].ref.current.getBoundingClientRect().top +
                    infoToText[i].ref.current.clientHeight / 2 +
                    "px",
                  right:
                    innerWidth -
                    infoToText[i].ref.current.getBoundingClientRect().left +
                    "px",
                }}
                key={i}
              >
                <div
                  className={
                    "tooltip" + (infoToText[i].style == "grey" ? " grey" : "")
                  }
                >
                  {allTheThings &&
                  allTheThings[i].payload &&
                  allTheThings[i].payload.text
                    ? allTheThings[i].payload.text
                    : infoToText[i].text}
                </div>
                {infoToText[i].with_dot && (
                  <div className="tooltip-dot" ref={dotRef} />
                )}
              </div>
            ),
        )}{" "}
    </>
  );
}
