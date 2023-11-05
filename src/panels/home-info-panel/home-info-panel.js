import React from "react";
import "./home-info-panel.css";
import { ReactComponent as NavigationIcon } from "assets/navigation-icon.svg";
import { ReactComponent as HomeIcon } from "assets/home-icon.svg";
import LayerSelectionPanel from "./layer-selection-panel";
import SearchBar from "panels/home-info-panel/search-bar";

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
      <SearchBar setBounds={setBounds} />
    </div>
  );
}

export default LeftPanel;
