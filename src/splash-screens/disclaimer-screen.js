import * as React from "react";
import "./disclaimer-screen.css";
import "./splash-screen.css";
import pan_logo from "assets/pan.png";
import tilt_logo from "assets/tilt.png";
import zoom_logo from "assets/zoom.png";

import chrome_icon from "assets/ChromeIcon.png";
import FadeInOut from "components/fade-in-out";

export default function DisclaimerScreen({ show, setShow, isTouch }) {
  return (
    <FadeInOut show={show} additionalClasses={show && "splash-screen-fade"}>
      <div className="splash-screen-disclaimer">
        <div className="disclaimer-container">
          <div className="disclaimer-title">Disclaimer:</div>
          <div className="disclaimer-body">
            This map was created by the Coastal Resilience Lab to advance the
            knowledge of mangroves for coastal flood protection. It is based off
            a global model, and may contain issues when viewed at local scales.
          </div>
          <br />
          <div className="browser-disclaimer-container-parent">
            <div className="browser-disclaimer-container">
              <div className="browser-disclaimer-text">
                We recommend Chrome.
              </div>
              <div className="browser-icon">
                <img src={chrome_icon}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='browser-disclaimer-container-parent'>  
          <div className='browser-disclaimer-container'>
              <div className='browser-icon'>
                  <img src={chrome_icon}></img>
              </div>
              <div className='browser-icon'>
                  <img src={safari_icon}></img>
              </div>
          </div>
      </div> */}
      {!isTouch && (
        <div className="navigation-controls-parent">
          <div className="navigation-controls">
            <div className="navigation-icon title">
              <p>
                navigation<br></br>controls
              </p>
            </div>
            <div className="navigation-icon">
              pan<br></br>
              <img src={pan_logo}></img>
            </div>
            <div className="navigation-icon">
              tilt<br></br>
              <img src={tilt_logo}></img>
            </div>
            <div className="navigation-icon">
              zoom<br></br>
              <img src={zoom_logo}></img>
            </div>
          </div>
        </div>
      )}
    </FadeInOut>
  );
}
