import React from "react";
import "./home-info-panel.css";
import { ReactComponent as NavigationIcon } from "assets/navigation-icon.svg";
import { ReactComponent as HomeIcon } from "assets/home-icon.svg";
import LayerSelectionPanel from "./layer-selection-panel";

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

// function DownloadReportButton() {

//     return <div className='home-info-button-container' >
//         <a href={`${host}/download-report`}
//             download='download-test.txt'>
//             <DownloadReport className='home-info-button' style={{
//         width: '50px',
//         height: '50px'
//     }}/>
//             {/* <div className='home-info-text'>download</div> */}
//         </a>
//     </div>
//     {/* <div className='download-button'>
//         <a href={`${host}/download-report`}
//             download='download-test.txt'>
//             <DownloadReport />
//         </a>
//     </div> */}
// }

function HomePanel(props) {
  return (
    <div className="home-container">
      <HomeButton setSplashScreen={props.setSplashScreen} />
      {/* <hr className='horiz-break' /> */}
      {/* <NavigationButton setNavigationScreenStatus={props.setNavigationScreenStatus} /> */}
      {/* <hr className='horiz-break' />
        <DownloadReportButton /> */}
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
