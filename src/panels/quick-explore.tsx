import { useCallback, useContext } from "react";
import FlyToContext from "./FlyToContext";
import { aois } from "data/viewports";

export type Bounds = [[number, number], [number, number]];

const ExplorerButton = ({
  text,
  region,
  group,
}: {
  text: string;
  region: string;
  group: string;
}) => {
  const flyToContext = useContext(FlyToContext);

  const onClick = useCallback(() => {
    flyToContext.flyToViewport(aois.find((x) => x.id === region)?.overview);
    flyToContext.setLayerGroup(group);
  }, [flyToContext, region, group]);

  return (
    <button onClick={onClick} className="basis-1/2 my-2 hover:text-coral">
      <h6 className="transition">{text}</h6>
      <p className="label italic">({region})</p>
    </button>
  );
};

const QuickExplore = () => {
  return (
    <div>
      <p>Jump to the areas that best demonstration this report's findings:</p>
      <div className="flex flex-row flex-wrap">
        <ExplorerButton
          text="Benefit (AEB)"
          region="Florida"
          group="Benefit (AEB)"
        />
        <ExplorerButton
          text="Risk Reduction Ratio"
          region="Florida"
          group="Risk Reduction Ratio"
        />
        <ExplorerButton text="Flooding" region="Vietnam" group="Flooding" />
        <ExplorerButton
          text="Benefit per Hectare"
          region="Yucatan"
          group="Benefit per Hectare"
        />
      </div>
    </div>
  );
};

export default QuickExplore;
