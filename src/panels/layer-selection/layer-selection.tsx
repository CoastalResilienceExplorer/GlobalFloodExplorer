import React, { useEffect, useRef } from "react";
import { LayerGroup, LayerName } from "layers/layers";
import { useSpring, animated } from "@react-spring/web";

type LayerSelectionProps = {
  layers: LayerGroup[];
  // TODO: refactor this state to reference the layer name instead of the layer group
  selectedLayer: LayerName;
  setSelectedLayer: (layer: LayerName) => void;
};

export const LayerSelection: React.FC<LayerSelectionProps> = ({
  layers,
  selectedLayer,
  setSelectedLayer,
}) => {
  const layerSelectionContainer = useRef<HTMLDivElement>(null);
  const activeLayerButton = useRef<HTMLButtonElement>(null);
  const [containerSprings, containerApi] = useSpring(() => ({
    from: {
      height: 60,
      width: 80,
    },
  }));
  const [innerSprings, innerApi] = useSpring(() => ({
    from: { y: 0 },
  }));

  useEffect(() => {
    containerApi.start({
      height: 60,
      width: 80,
    });
  }, [containerApi]);

  const handleHover = () => {
    containerApi.start({
      height: layerSelectionContainer.current?.scrollHeight,
      width: activeLayerButton.current?.scrollWidth,
    });
    innerApi.start({ y: 0 });
  };

  const handleUnhover = () => {
    containerApi.start({
      height: 60,
      width: 80,
    });
    innerApi.start({
      y: -(activeLayerButton.current?.offsetTop ?? 0),
    });
  };

  return (
    <animated.div
      className="absolute z-3 top-0 left-0 bg-open overflow-hidden rounded-br-lg"
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
      ref={layerSelectionContainer}
      style={{
        ...containerSprings,
      }}
    >
      <animated.div style={{ ...innerSprings }}>
        {layers.map((layerGroup, index) => (
          <button
            key={index}
            className={`hover:bg-shoreline text-left w-96	 ${
              layerGroup.name === selectedLayer && "bg-shoreline"
            }}`}
            onClick={() => setSelectedLayer(layerGroup.name)}
            ref={layerGroup.name === selectedLayer ? activeLayerButton : null}
          >
            <div className="grid grid-flow-col gap-4 px-4 py-2 ">
              <div className="self-start">
                <layerGroup.IconComponent width={50} fill="white" />
              </div>
              <div className="max-w-sm">
                <h3 className="text-white">{layerGroup.name}</h3>
                <p className="text-white">{layerGroup.shortDescription}</p>
              </div>
            </div>
          </button>
        ))}
      </animated.div>
    </animated.div>
  );
};
