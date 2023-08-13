import "./flood_selector.css";
import InfoContext from "context/infoContext";
import { useContext } from "react";

function CircleSelector({ selectedFloodGroup, thisFloodgroup, setFloodGroup }) {
  const selected = selectedFloodGroup === thisFloodgroup;

  const styles = {
    None: "None",
    with: "With Mangroves",
    without: "Without Mangroves",
  };

  return (
    <div
      className="circle-selector-container flooding"
      onClick={() => setFloodGroup(thisFloodgroup)}
    >
      <div className="circle-selector-text flooding">
        {styles[thisFloodgroup]}
      </div>
      <div
        className={
          "circle-selector flooding" +
          ` ${thisFloodgroup} ${selected ? "selected" : ""}`
        }
      ></div>
    </div>
  );
}

export default function FloodSelector({
  floodGroup,
  setFloodGroup,
  floodingOn,
}) {
  console.log(floodGroup);
  const { useFirst, floodingRef } = useContext(InfoContext);
  useFirst([floodingOn, "==", true], "FIRST_FLOODING", "NONE");

  const floodgroups = [
    {
      id: "None",
      displayAs: "None",
    },
    {
      id: "with",
      displayAs: "With Mangroves",
    },
    {
      id: "without",
      displayAs: "Without Mangroves",
    },
  ];

  return (
    <>
      {floodingOn ? (
        <div className="floodgroup-manager-outer-container">
          <div className="floodgroup-manager-inner-container">
            <>
              {/* <div className='basemap-options-header' ref={floodingRef}>Flooding</div> */}

              {["None", "with", "without"].map((f) => (
                <CircleSelector
                  selectedFloodGroup={floodGroup}
                  thisFloodgroup={f}
                  setFloodGroup={setFloodGroup}
                />
              ))}
            </>
          </div>
        </div>
      ) : null}
    </>
  );
}
