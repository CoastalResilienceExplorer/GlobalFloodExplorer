import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

import "./layer-selection-panel.css";
import aeb_ha from "assets/AEB_ha_square.png";
import aeb from "assets/AEB_square.png";
import HEX from "assets/HEX_square.png";
import Flood from "assets/Flood_square.png";

import { ReactComponent as OpenCloseToggleIcon } from "assets/OpenCloseToggle2.svg";

enum LayerGroupName {
  AEB = "Benefit (AEB)",
  AEB_HA = "Benefit per Hectare",
  RRR = "Risk Reduction Ratio",
  FLOOD = "Flooding",
}

const LayerDisplayText: Record<LayerGroupName, string> = {
  "Benefit per Hectare": "Annual Expected Benefits per Hectare Mangroves",
  "Benefit (AEB)": "Annual Expected Benefits",
  "Risk Reduction Ratio": "Risk Reduction Ratio",
  Flooding: "Flooding",
};

const layers: Record<LayerGroupName, React.ReactNode> = {
  [LayerGroupName.AEB]: (
    <div className="layer-selection-image-container">
      <img
        src={aeb}
        className="layer-selection-icon"
        alt={`Graphic representing ${LayerDisplayText[LayerGroupName.AEB]}`}
      />
    </div>
  ),
  [LayerGroupName.AEB_HA]: (
    <div className="layer-selection-image-container">
      <img
        src={aeb_ha}
        className="layer-selection-icon"
        alt={`Graphic representing ${LayerDisplayText[LayerGroupName.AEB_HA]}`}
      />
    </div>
  ),
  [LayerGroupName.RRR]: (
    <div className="layer-selection-image-container">
      <img
        src={HEX}
        className="layer-selection-icon"
        alt={`Graphic representing ${LayerDisplayText[LayerGroupName.RRR]}`}
      />
    </div>
  ),
  [LayerGroupName.FLOOD]: (
    <div className="layer-selection-image-container">
      <img
        src={Flood}
        className="layer-selection-icon"
        alt={`Graphic representing ${LayerDisplayText[LayerGroupName.FLOOD]}`}
      />
    </div>
  ),
};

function LayerSelectionButtonContainer({
  id,
  isSelected,
  setSelectedLayer,
  isOpen,
}: {
  id: LayerGroupName;
  isSelected: boolean;
  setSelectedLayer: (layer: LayerGroupName) => void;
  isOpen: boolean;
}) {
  return (
    <div
      className={
        "layer-selection-button-container" +
        (isSelected ? " selected" : "") +
        (!isOpen ? " collapsed" : "")
      }
      onClick={() => setSelectedLayer(id)}
    >
      <div className="layer-selection-button-text-container">
        {id && (
          <div
            className={
              "layer-selection-button-text" + (isSelected ? " selected" : "")
            }
          >
            {id.toUpperCase()}
          </div>
        )}
      </div>
      {layers[id]}
    </div>
  );
}

function OpenCloseToggle({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const openTransform = {
    transform: "rotate(180deg)",
  };

  return (
    <div className="open-close-toggle-container">
      <OpenCloseToggleIcon
        className={"open-close-toggle" + (!isOpen ? " collapsed" : "")}
        onClick={() => setIsOpen(!isOpen)}
        style={isOpen ? openTransform : {}}
      />
    </div>
  );
}

function CurrentlyViewingTitle({
  selectedLayer,
}: {
  selectedLayer: LayerGroupName;
}) {
  return (
    <div className="currently-viewing-text-container">
      <div>
        Currently Viewing: <br></br>
        <div className="currently-viewing-text-layer">
          {LayerDisplayText[selectedLayer]}
        </div>
      </div>
    </div>
  );
}

function TouchLayerSelectionPanel({
  selectedLayer,
  setSelectedLayer,
}: {
  selectedLayer: LayerGroupName;
  setSelectedLayer: (layer: LayerGroupName) => void;
}) {
  const isOpen = false;
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);
  const [swipeCurrentX, setSwipeCurrentX] = useState<number | null>(null);
  const [swipeCurrentY, setSwipeCurrentY] = useState<number | null>(null);

  function swipeType() {
    if (
      swipeStartX === null ||
      swipeStartY === null ||
      swipeCurrentX === null ||
      swipeCurrentY === null
    )
      return null;
    if (Math.abs(swipeCurrentX - swipeStartX) < 50) return null;
    if (Math.abs(swipeCurrentY - swipeStartY) > 50) return null;
    if (swipeCurrentX > swipeStartX) return "RIGHT";
    if (swipeCurrentX < swipeStartX) return "LEFT";
  }

  function changeSelectedLayer() {
    const l = Object.keys(layers) as LayerGroupName[];
    const currentIndex = l.indexOf(selectedLayer);
    if (swipeType() === "RIGHT") {
      const nextIndex = (currentIndex + 1) % l.length;
      setSelectedLayer(l[nextIndex]);
    }
    if (swipeType() === "LEFT") {
      const nextIndex = (currentIndex - 1) % l.length;
      nextIndex < 0
        ? setSelectedLayer(l[l.length + nextIndex])
        : setSelectedLayer(l[nextIndex]);
    }
  }

  return (
    <div
      className="layer-selection-container mobile"
      onTouchStart={(e) => {
        setSwipeStartX(e.touches[0].clientX);
        setSwipeStartY(e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        setSwipeCurrentX(e.touches[0].clientX);
        setSwipeCurrentY(e.touches[0].clientY);
      }}
      onTouchEnd={() => {
        changeSelectedLayer();
        setTimeout(() => {
          setSwipeStartX(null);
          setSwipeStartY(null);
          setSwipeCurrentX(null);
          setSwipeCurrentY(null);
        }, 100);
      }}
    >
      <div className="swipe-title">Swipe</div>
      <div className="layer-selection-content-container mobile">
        <LayerSelectionButtonContainer
          id={selectedLayer}
          key={selectedLayer}
          isSelected={true}
          setSelectedLayer={setSelectedLayer}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
}

const LAYER_PANEL_WIDTH = 460;

function LayerSelectionPanel({
  selectedLayer,
  setSelectedLayer,
  isTouch,
}: {
  selectedLayer: LayerGroupName;
  setSelectedLayer: (layer: LayerGroupName) => void;
  isTouch: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [parentSprings, parentApi] = useSpring(() => ({
    from: { width: LAYER_PANEL_WIDTH },
  }));

  const [childSprings, childApi] = useSpring(() => ({
    from: { x: 0 },
  }));

  useEffect(() => {
    if (isOpen) {
      parentApi.start({ to: { width: LAYER_PANEL_WIDTH } });
      childApi.start({ to: { x: 0 } });
    } else {
      parentApi.start({ to: { width: LAYER_PANEL_WIDTH / 4 } });
      const layerIndex = Object.keys(layers).indexOf(selectedLayer);
      childApi.start({ to: { x: layerIndex * (LAYER_PANEL_WIDTH / 4) } });
    }
  }, [childApi, isOpen, parentApi, selectedLayer]);

  if (isTouch) {
    return (
      <TouchLayerSelectionPanel
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
      />
    );
  }

  return (
    <div className="layer-selection-container">
      <animated.div
        className="layer-selection-content-parent-container"
        style={{ ...parentSprings }}
      >
        <animated.div
          className="layer-selection-content-container"
          style={{ x: childSprings.x.to((val) => val * -1) }}
        >
          {(Object.keys(layers) as LayerGroupName[]).map((x) => (
            <LayerSelectionButtonContainer
              id={x}
              key={x}
              isSelected={selectedLayer === x}
              setSelectedLayer={setSelectedLayer}
              isOpen={isOpen}
            />
          ))}
        </animated.div>
      </animated.div>
      <OpenCloseToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      <CurrentlyViewingTitle selectedLayer={selectedLayer} />
    </div>
  );
}

export default LayerSelectionPanel;
