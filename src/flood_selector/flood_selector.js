import { useInfoContext } from "maphooks/maphooks/useInfo";
import "./flood_selector.css";

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
  const { useFirst } = useInfoContext();
  useFirst([floodingOn, "==", true], "FIRST_FLOODING", "NONE");

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
