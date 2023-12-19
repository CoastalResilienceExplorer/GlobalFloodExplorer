import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { LayerGroup, LayerName } from "types/dataModel";
import { ReactComponent as LinkSvg } from "assets/link-icon.svg";

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
    from: { width: 60 },
  }));
  const [iconSprings, iconApi] = useSpring(() => ({
    from: { width: 30, height: 30 },
  }));
  const [descriptionSprings, descriptionApi] = useSpring(() => ({
    from: { fontSize: 0 },
  }));

  useEffect(() => {
    containerApi.start({ width: 60 });
  }, [containerApi]);

  const handleHover = () => {
    containerApi.start({ width: activeLayerButton.current?.scrollWidth });
    iconApi.start({ width: 50, height: 50 });
    descriptionApi.start({ fontSize: 16 });
  };

  const handleUnhover = () => {
    containerApi.start({ width: 60 });
    iconApi.start({ width: 30, height: 30 });
    descriptionApi.start({ fontSize: 0 });
  };

  return (
    <animated.div
      className="absolute z-[02] top-0 left-0 bg-open overflow-hidden rounded-br-lg"
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
      ref={layerSelectionContainer}
      style={{ ...containerSprings }}
    >
      {layers.map((layerGroup, index) => (
        <button
          key={index}
          className={`hover:bg-shoreline text-left transition-[height] ${
            layerGroup.name === selectedLayer && "bg-shoreline"
          }}`}
          onClick={() => setSelectedLayer(layerGroup.name)}
          ref={layerGroup.name === selectedLayer ? activeLayerButton : null}
        >
          <div className="grid grid-flow-col gap-4 px-4 py-2 max-w-lg">
            <div className="self-start">
              <animated.div style={{ ...iconSprings }}>
                <layerGroup.IconComponent fill="white" />
              </animated.div>
            </div>
            <div className="w-96 text-white px-4  overflow-hidden">
              <h3 className="w-full">{layerGroup.name}</h3>
              <animated.p className="w-full" style={{ ...descriptionSprings }}>
                {layerGroup.shortDescription}
              </animated.p>
            </div>
          </div>
        </button>
      ))}
      <button className="bg-trench hover:bg-shoreline text-left transition-[height]">
        <div className="grid grid-flow-col gap-4 px-4 py-2 max-w-lg">
          <div className="self-start">
            <animated.div style={{ ...iconSprings }}>
              <LinkSvg fill="white" />
            </animated.div>
          </div>
          <div className="w-96 text-white px-4">
            <h3 className="w-full">Lab Website</h3>
            <animated.p className="w-full" style={{ ...descriptionSprings }}>
              Lab description to come
            </animated.p>
          </div>
        </div>
      </button>
      <button className="bg-trench hover:bg-shoreline text-left transition-[height]">
        <div className="grid grid-flow-col gap-4 px-4 py-2 max-w-lg">
          <div className="self-start">
            <animated.div style={{ ...iconSprings }}>
              <LinkSvg fill="white" />
            </animated.div>
          </div>
          <div className="w-96 text-white px-4">
            <h3 className="w-full">Publication</h3>
            <animated.p className="w-full" style={{ ...descriptionSprings }}>
              Menendez et al. 2020.
            </animated.p>
          </div>
        </div>
      </button>
    </animated.div>
  );
};
