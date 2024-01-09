import React, { useEffect, useState } from "react";
import "./layer-selection-panel.css";
import aeb_ha from "assets/AEB_ha_square.png";
import aeb from "assets/AEB_square.png";
import HEX from "assets/HEX_square.png";
import Flood from "assets/Flood_square.png";

import { ReactComponent as OpenCloseToggleIcon } from "assets/OpenCloseToggle2.svg";

const layers = {
  "Benefit (AEB)": (
    <div className="layer-selection-image-container">
      <img src={aeb} className="layer-selection-icon" />
    </div>
  ),
  "Benefit per Hectare": (
    <div className="layer-selection-image-container">
      <img src={aeb_ha} className="layer-selection-icon" />
    </div>
  ),
  "Risk Reduction Ratio": (
    <div className="layer-selection-image-container">
      <img src={HEX} className="layer-selection-icon" />
    </div>
  ),
  Flooding: (
    <div className="layer-selection-image-container">
      <img src={Flood} className="layer-selection-icon" />
    </div>
  ),
};

function LayerSelectionButtonContainer({
  id,
  isSelected,
  setSelectedLayer,
  isOpen,
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
            {id}
          </div>
        )}
      </div>
      {layers[id]}
    </div>
  );
}

function OpenCloseToggle({ isOpen, setIsOpen }) {
  const transform = isOpen ? "rotate(270deg)" : "rotate(90deg)";

  return (
    <div className="open-close-toggle-container">
      <OpenCloseToggleIcon
        className={"open-close-toggle" + (!isOpen ? " collapsed" : "")}
        onClick={() => setIsOpen(!isOpen)}
        style={{ transform }}
      />
    </div>
  );
}

function CurrentlyViewingTitle({ selectedLayer, breadcrumbs }) {
  const layer_display_text_mapping = {
    "Benefit per Hectare": "Annual Expected Benefits per Hectare Mangroves",
    "Benefit (AEB)": "Annual Expected Benefits",
    "Risk Reduction Ratio": "Risk Reduction Ratio",
    Flooding: "Flooding",
  };

  return (
    <div className="currently-viewing-text-container">
      <div>
        Currently Viewing: <br></br>
        <div className="currently-viewing-text-layer">
          {layer_display_text_mapping[selectedLayer]}
        </div>
        {/* <br></br>
            {breadcrumbs[0] && 'in '}
            <div className='currently-viewing-text-location'>
                {breadcrumbs[0] && breadcrumbs[0]}
            </div> */}
      </div>
    </div>
  );
}

function TouchLayerSelectionPanel({ selectedLayer, setSelectedLayer }) {
  const isOpen = false;
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [swipeStartY, setSwipeStartY] = useState(null);
  const [swipeCurrentX, setSwipeCurrentX] = useState(null);
  const [swipeCurrentY, setSwipeCurrentY] = useState(null);

  useEffect(() => {
    console.log("X", swipeStartX, swipeCurrentX);
    console.log("Y", swipeStartY, swipeCurrentY);
    console.log(Math.abs(swipeCurrentY - swipeStartY));
  }, [swipeCurrentX]);

  function swipeType() {
    if (Math.abs(swipeCurrentX - swipeStartX) < 50) return null;
    if (Math.abs(swipeCurrentY - swipeStartY) > 50) return null;
    if (swipeCurrentX > swipeStartX) return "RIGHT";
    if (swipeCurrentX < swipeStartX) return "LEFT";
  }

  function changeSelectedLayer() {
    const l = Object.keys(layers);
    const currentIndex = l.indexOf(selectedLayer);
    console.log(swipeType());
    if (swipeType() === "RIGHT") {
      const nextIndex = (currentIndex + 1) % l.length;
      console.log(nextIndex);
      setSelectedLayer(l[nextIndex]);
    }
    if (swipeType() === "LEFT") {
      const nextIndex = (currentIndex - 1) % l.length;
      nextIndex < 0
        ? setSelectedLayer(l[l.length + nextIndex])
        : setSelectedLayer(l[nextIndex]);
      console.log(nextIndex);
    }
  }

  return (
    <div
      className="layer-selection layer-selection-container mobile"
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
      {/* <OpenCloseToggle isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      {/* <CurrentlyViewingTitle selectedLayer={selectedLayer} breadcrumbs={breadcrumbs} /> */}
    </div>
  );
}

function LayerSelectionPanel({
  selectedLayer,
  setSelectedLayer,
  breadcrumbs,
  isTouch,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getLayersToDisplay = () => {
    if (isOpen) return Object.keys(layers);
    else return [selectedLayer];
  };

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
      <div className="layer-selection-content-container">
        {getLayersToDisplay().map((x) => (
          <LayerSelectionButtonContainer
            id={x}
            key={x}
            isSelected={selectedLayer === x}
            setSelectedLayer={setSelectedLayer}
            isOpen={isOpen}
          />
        ))}
      </div>
      <OpenCloseToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* <CurrentlyViewingTitle
        selectedLayer={selectedLayer}
        breadcrumbs={breadcrumbs}
      /> */}
    </div>
  );
}

export default LayerSelectionPanel;
