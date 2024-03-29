import { useInfoContext } from "hooks/useInfo";
import "./flood_selector.css";

function CircleSelector({ selectedFloodGroup, thisFloodgroup, setFloodGroup }) {
  const selected = selectedFloodGroup === thisFloodgroup;

  const styles = {
    None: "None",
    flooding_1996: "1996",
    flooding_2015: "2015",
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

export function FloodSelector({
  floodGroup,
  setFloodGroup,
  floodingOn,
  offset,
}) {
  const { useFirst } = useInfoContext();
  useFirst(() => !!floodingOn, "FIRST_FLOODING");

  return (
    <>
      {floodingOn ? (
        <div
          className="floodgroup-manager-outer-container"
          style={{
            position: "absolute",
            bottom: "20px",
            left: `${offset}px`,
          }}
        >
          <div className="floodgroup-manager-inner-container">
            <>
              {/* <div className='basemap-options-header' ref={floodingRef}>Flooding</div> */}

              {["flooding_1996", "flooding_2015"].map((f) => (
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
