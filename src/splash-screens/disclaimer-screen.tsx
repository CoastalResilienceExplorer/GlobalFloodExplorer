import * as React from "react";
import "./disclaimer-screen.css";
import { Icon } from "@iconify/react";

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
      data-cy="disclaimer-close-button"
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

export const DisclaimerScreen = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showClose, setShowClose] = React.useState(false);

  React.useEffect(() => {
    if (show) setShowClose(true);
  }, [show]);

  // Essentially, we're protecting ourselves from Microsoft Edge and Firefox
  const isSafeBroswer = React.useMemo(
    () =>
      navigator.userAgent.indexOf("Chrome") > -1 ||
      navigator.userAgent.indexOf("Safari") > -1,
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
          <h3 className="text-left mb-2">Disclaimer:</h3>
          <p className="body text-left">
            This map was created by the Coastal Resilience Lab to advance the
            knowledge of mangroves for coastal flood protection. It is based off
            a global model, and may contain issues when viewed at local scales.
          </p>
          {!isSafeBroswer && (
            <>
              <br />
              <div className="browser-disclaimer-container-parent">
                <div className="browser-disclaimer-container">
                  <p className="browser-disclaimer-text">
                    We recommend Chrome.
                  </p>
                  <div className="browser-icon">
                    <img src={chrome_icon} alt="" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </FadeInOut>
  );
};

export const NavigationControls = ({
  show,
  isTouch,
}: {
  show: boolean;
  isTouch: boolean;
}) => {
  return !isTouch ? (
    <FadeInOut
      show={show}
      animationDuration={animationDuration}
      additionalClasses={show ? "navigation-controls-fade" : ""}
    >
      <div className="navigation-controls-parent">
        <div className="navigation-controls">
          <div className="navigation-icon">
            <h5 className="mb-1">Pan</h5>
            <Icon
              icon="mdi:mouse-left-click-outline"
              color="white"
              width={42}
            />
          </div>
          <div className="navigation-icon">
            <h5 className="mb-1">Zoom</h5>
            <Icon icon="iconoir:mouse-scroll-wheel" color="white" width={42} />
          </div>
          <div className="navigation-icon">
            <h5 className="mb-1">Tilt</h5>
            <Icon
              icon="mdi:mouse-right-click-outline"
              color="white"
              width={42}
            />
          </div>
        </div>
      </div>
    </FadeInOut>
  ) : null;
};
