import React from "react";
import "./home-info-panel.css";
import { ReactComponent as NavigationIcon } from "assets/navigation-icon.svg";
import { ReactComponent as HomeIcon } from "assets/home-icon.svg";
import { Icon } from "@iconify/react";

import LayerSelectionPanel from "./layer-selection-panel";

const downloads = [
  {
    url: "https://storage.googleapis.com/cwon-data/Downloads/UCSC_CWON_studyunits.gpkg",
    icon: <Icon icon="material-symbols:download-sharp" />,
    download: true,
  },
  {
    url: "https://storage.googleapis.com/cwon-data/Downloads/FloodMaps.zip",
    icon: <Icon icon="teenyicons:layers-outline" />,
    download: true,
  },
  {
    url: "https://www.coastalresiliencelab.org/",
    icon: <Icon icon="streamline-emojis:water-wave" />,
    download: false,
  },
  {
    url: "https://doi.org/10.1038/s41598-020-61136-6",
    icon: <Icon icon="game-icons:materials-science" />,
    download: false,
  },
];

function HomeButton(props) {
  return (
    <div
      className="home-info-button-container"
      onClick={() => props.setSplashScreen(true)}
    >
      <HomeIcon className="home-info-button" />
      <div className="home-info-text">home</div>
      {/* </div> */}
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

function HomePanel(props) {
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
  isTouch,
}) {
  return (
    <div className="left-pane">
      <LayerSelectionPanel
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        breadcrumbs={breadcrumbs}
        isTouch={isTouch}
      />
      <div className="homeinfo-breadcrumbs-panel-layout" onClick={() => {}}>
        <HomePanel setSplashScreen={setSplashScreen} />
      </div>
    </div>
  );
}

export default LeftPanel;
