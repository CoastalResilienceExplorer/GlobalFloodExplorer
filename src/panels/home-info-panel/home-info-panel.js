import React from "react";
import "./home-info-panel.css";
import { ReactComponent as HomeIcon } from "assets/home-icon.svg";

import LayerSelectionPanel from "./layer-selection-panel";
import SearchBar from "panels/home-info-panel/search-bar";
import downloads from "data/downloads";

function HomeButton(props) {
  return (
    <div
      className="home-info-button-container"
      onClick={() => props.setSplashScreen(true)}
    >
      <div className="home-info-text">Home</div>
      <HomeIcon className="home-info-button" />
    </div>
  );
}

function DownloadReportButton({ url, Icon, download }) {
  return (
    <div className="home-info-button-container">
      {download ? (
        <a href={url} download={`./${url.split("/").at(-1)}`}>
          {Icon}
        </a>
      ) : (
        <a href={url} target="_blank" rel="noreferrer">
          {Icon}
        </a>
      )}
    </div>
  );
}

export function HomePanel(props) {
  return (
    <div className="home-container">
      <HomeButton setSplashScreen={props.setSplashScreen} />
      {/* <hr className='horiz-break' /> */}
      {/* <NavigationButton setNavigationScreenStatus={props.setNavigationScreenStatus} /> */}
      <hr className="horiz-break" />
      {downloads.map((d) => (
        <DownloadReportButton url={d.url} Icon={d.icon} download={d.download} />
      ))}
    </div>
  );
}

function LeftPanel({
  breadcrumbs,
  setSplashScreen,
  selectedLayer,
  setSelectedLayer,
  setBounds,
  isTouch,
}) {
  return (
    <div className="left-pane">
      <HomePanel setSplashScreen={setSplashScreen} />
      <LayerSelectionPanel
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        breadcrumbs={breadcrumbs}
        isTouch={isTouch}
      />
    </div>
  );
}

export default LeftPanel;
