import { useInfoContext } from "hooks/useInfo";
import "./flood_selector.css";

function CircleSelector({ selectedFloodGroup, thisFloodgroup, setFloodGroup }) {
  const selected = selectedFloodGroup === thisFloodgroup;

  const styles = {
    None: "None",
    flooding_1996: "1996",
    flooding_2015: "2015",
    flooding_nomang: "No Mangroves",
  };

  return (
    <div
      className="circle-selector-container flooding"
      onClick={() => setFloodGroup(thisFloodgroup)}
    >
      <p className="circle-selector-text text-white flooding font-sans font-bold">
        {styles[thisFloodgroup]}
      </p>
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
            <CircleSelector
              selectedFloodGroup={floodGroup}
              thisFloodgroup={floodGroup}
              setFloodGroup={setFloodGroup}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
