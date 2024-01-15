import * as React from "react";
import "./disclaimer-screen.css";
import pan_logo from "assets/pan.png";
import tilt_logo from "assets/tilt.png";
import zoom_logo from "assets/zoom.png";

import chrome_icon from "assets/ChromeIcon.png";
import FadeInOut from "components/fade-in-out";

const animationDuration = 500;

const AnimatedXIcon = ({
  animationDuration,
}: {
  animationDuration: number;
}) => {
  const circumference = 2 * Math.PI * 14.5; // 2 * π * r
  const [offset, setOffset] = React.useState(circumference); // Start with the entire circle hidden

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      data-test-id="disclaimer-close-button"
    >
      {/* Black circle */}
      <circle cx="15" cy="15" r="14.5" fill="black" />

      {/* White X in the center */}
      <line x1="9" y1="9" x2="21" y2="21" stroke="white" strokeWidth="2" />
      <line x1="9" y1="21" x2="21" y2="9" stroke="white" strokeWidth="2" />

      {/* White border circle */}
      <circle
        cx="15"
        cy="15"
        r="14.5"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90, 15, 15)"
        style={{
          transition: `stroke-dashoffset ${animationDuration}ms ease-out`,
        }}
      />
    </svg>
  );
};

export function DisclaimerScreen({
  show,
  setShow,
  isTouch,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  isTouch: boolean;
}) {
  const [showClose, setShowClose] = React.useState(false);

  React.useEffect(() => {
    if (show) setShowClose(true);
  }, [show]);

  const isChrome = React.useMemo(
    () => navigator.userAgent.indexOf("Chrome") > -1,
    [],
  );
  return (
    <FadeInOut
      show={show}
      animationDuration={animationDuration}
      additionalClasses={show ? "splash-screen-fade" : ""}
    >
      <div className="splash-screen-disclaimer">
        <div className="disclaimer-container">
          <div
            className="disclaimer-close-button"
            onClick={() => setShow(false)}
            role="button"
          >
            {showClose && <AnimatedXIcon animationDuration={5000} />}
          </div>
          <div className="disclaimer-title">Disclaimer:</div>
          <div className="disclaimer-body">
            This map was created by the Coastal Resilience Lab to advance the
            knowledge of mangroves for coastal flood protection. It is based off
            a global model, and may contain issues when viewed at local scales.
          </div>
          <br />
          {!isChrome && (
            <div className="browser-disclaimer-container-parent">
              <div className="browser-disclaimer-container">
                <div className="browser-disclaimer-text">
                  We recommend Chrome.
                </div>
                <div className="browser-icon">
                  <img src={chrome_icon} alt="" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeInOut>
  );
}

export function NavigationControls({
  show,
  isTouch,
}: {
  show: boolean;
  isTouch: boolean;
}) {
  return !isTouch ? (
    <FadeInOut
      show={show}
      animationDuration={animationDuration}
      additionalClasses={show ? "navigation-controls-fade" : ""}
    >
      <div className="navigation-controls-parent">
        <div className="navigation-controls">
          <div className="navigation-icon title">
            <p>
              navigation
              <br />
              controls
            </p>
          </div>
          <div className="navigation-icon">
            pan
            <br />
            <img src={pan_logo} alt="" />
          </div>
          <div className="navigation-icon">
            tilt
            <br />
            <img src={tilt_logo} alt="" />
          </div>
          <div className="navigation-icon">
            zoom
            <br />
            <img src={zoom_logo} alt="" />
          </div>
        </div>
      </div>
    </FadeInOut>
  ) : null;
}
