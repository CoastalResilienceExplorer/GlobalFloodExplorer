import { useCallback, useContext } from "react";
import FlyToContext from "./FlyToContext";
import { aois } from "data/viewports";
import { LayerName } from "types/dataModel";
import { LayerSelectionFrom, useLayerBounceContext } from "layers/layer-bounce";
import { Viewport } from "types/map";

export type Bounds = [[number, number], [number, number]];

const ExplorerButton = ({
  text,
  region,
  layerName,
}: {
  text: string;
  region: string;
  layerName: LayerName;
}) => {
  const flyToContext = useContext(FlyToContext);
  const { setLayerGroupSelectedFrom } = useLayerBounceContext();

  const onClick = useCallback(() => {
    // Need to give Flooding sub-maps time to initialize
    const flyToTimeout = layerName === LayerName.Flooding ? 1000 : 250;
    flyToContext?.setLayerGroup?.(layerName);
    setLayerGroupSelectedFrom(LayerSelectionFrom.layerSelectionPanel);

    setTimeout(() => {
      flyToContext?.flyToViewport?.({
        ...(aois.find((x) => x.id === region)?.overview as Viewport),
      });
    }, flyToTimeout);
  }, [flyToContext, layerName, setLayerGroupSelectedFrom, region]);

  return (
    <button
      onClick={onClick}
      className="basis-1/2 my-2 hover:text-coral hover:drop-shadow"
    >
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
          layerName={LayerName.BenefitAEB}
        />
        <ExplorerButton
          text="Risk Reduction Ratio"
          region="Florida"
          layerName={LayerName.RiskReduction}
        />
        <ExplorerButton
          text="Flooding"
          region="Vietnam"
          layerName={LayerName.Flooding}
        />
        <ExplorerButton
          text="Benefit (Social)"
          region="Yucatan"
          layerName={LayerName.Population}
        />
      </div>
    </div>
  );
};

export default QuickExplore;
