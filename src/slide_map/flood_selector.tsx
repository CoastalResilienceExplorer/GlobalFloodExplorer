import { useInfoContext } from "hooks/useInfo";
import "./flood_selector.css";

type CircleSelectorKeys =
  | "None"
  | "flooding_1996"
  | "flooding_2015"
  | "flooding_nomang";

type CircleSelectorStyles = Record<CircleSelectorKeys, string>;

const styles: CircleSelectorStyles = {
  None: "None",
  flooding_1996: "1996",
  flooding_2015: "2015",
  flooding_nomang: "W/O",
};

const CircleSelector = ({
  thisFloodgroup,
  setFloodGroup,
}: {
  thisFloodgroup: CircleSelectorKeys;
  setFloodGroup: (floodGroup: CircleSelectorKeys) => void;
}) => {
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
};

export const FloodSelector = ({
  floodGroup,
  setFloodGroup,
  floodingOn,
  position,
}: {
  floodGroup: CircleSelectorKeys;
  setFloodGroup: (floodGroup: CircleSelectorKeys) => void;
  floodingOn: boolean;
  position: "left" | "right";
}) => {
  // @ts-ignore not ready to type InfoContext yet
  const { useFirst } = useInfoContext();
  useFirst(() => !!floodingOn, "FIRST_FLOODING");

  const offset = position === "left" ? "right" : "left";
  return (
    <>
      {floodingOn ? (
        <div
          className="floodgroup-manager-outer-container"
          style={{
            position: "absolute",
            bottom: "20px",
            [offset]: "1px",
          }}
        >
          <div className="floodgroup-manager-inner-container">
            <CircleSelector
              thisFloodgroup={floodGroup}
              setFloodGroup={setFloodGroup}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
