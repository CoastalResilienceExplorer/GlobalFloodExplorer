import * as React from "react";
import "./Opening_11_11.css";

// Researchers
import UCSC from "../assets/UCSC_White_Logo.png";
import TNC from "../assets/TNC logo_grayscale.png";
import IHCant from "../assets/ih_logo.png";
import CRL_Logo from "../assets/Coastal Resilience Lab Logo.png";

// Other Sponsors
import IKI from "../assets/IKI_Climate.jpg";
import AXA from "../assets/AXA_Research_Fund.jpg";
import WB from "../assets/world-bank-logo.jpg";

// Links
const paper = "https://www.nature.com/articles/s41598-020-61136-6?sf231926366";
const lab = "https://www.coastalresiliencelab.org/";

const title = "Coastal Resilience";
const subtitle = "Explorer";

const body =
  "Increasing coastal hazards due to climate change require innovative solutions that leverage natural infrastructure like reefs and mangroves.";

const citation =
  "Menéndez, P., Losada, I.J., Torres-Ortega, S. et al. The Global Flood Protection Benefits of Mangroves. Sci Rep 10, 4404 (2020).";
const doi = (
  <a href="https://doi.org/10.1038/s41598-020-61136-6">
    https://doi.org/10.1038/s41598-020-61136-6
  </a>
);

function CreditIcon({ image, type = "partner" }) {
  return <img src={image} className={`credit-icon ${type}`}></img>;
}

function NavigationButton({ text, link, setSplashScreen, type = "minor" }) {
  if (type === "gotomap") {
    return (
      <div
        className={`navigation-button ${type}`}
        onClick={() => {
          setSplashScreen(false);
        }}
      >
        {text}
      </div>
    );
  }

  return (
    <div className={`navigation-button ${type}`}>
      <a
        href={link}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        rel="noreferrer"
      >
        {text}
      </a>
    </div>
  );
}

function Desktop({ splashScreenOn, setSplashScreen }) {
  return (
    <>
      {splashScreenOn ? (
        <>
          <div className="splash-screen">
            <div className="splash-screen-toplevel-vertical-divide">
              <div className="splash-screen-toplevel-half left">
                <div className="partners-panel">
                  <CreditIcon image={UCSC}></CreditIcon>
                  <CreditIcon image={TNC}></CreditIcon>
                  <CreditIcon image={IHCant}></CreditIcon>
                </div>
                <div className="body-panel">
                  <CreditIcon image={CRL_Logo} type="lab"></CreditIcon>
                  <div className="splashscreen-body-text-container">
                    <div className="splashscreen-body-title">
                      {title}
                      <div className="emph">{subtitle}</div>
                    </div>
                    <div className="splashscreen-body-main">
                      {body}
                      <div className="sub">
                        {citation} {doi}
                      </div>
                    </div>
                  </div>
                  <div className="navigation-buttons-container">
                    <NavigationButton text="Lab Website" link={lab} />
                    <NavigationButton text="Learn More" link={paper} />
                  </div>
                </div>
                <div className="sponsors-panel">
                  <CreditIcon
                    image={WB}
                    type="sponsor"
                    height={38}
                  ></CreditIcon>
                  <CreditIcon
                    image={AXA}
                    type="sponsor"
                    height={38}
                  ></CreditIcon>
                  <CreditIcon
                    image={IKI}
                    type="sponsor"
                    height={38}
                  ></CreditIcon>
                </div>
              </div>
              <div className="splash-screen-toplevel-half right" />
              <div className="centered-button-container">
                <NavigationButton
                  text="Explore"
                  type="gotomap"
                  setSplashScreen={setSplashScreen}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

function Mobile({ splashScreenOn, setSplashScreen }) {
  return (
    <>
      {splashScreenOn ? (
        <>
          <div className="splash-screen">
            <div className="splash-screen-toplevel-vertical-divide">
              <div className="splash-screen-toplevel-half left mobile">
                <div className="partners-panel">
                  <CreditIcon image={UCSC}></CreditIcon>
                  <CreditIcon image={TNC}></CreditIcon>
                  <CreditIcon image={IHCant}></CreditIcon>
                </div>
                <div className="body-panel">
                  <CreditIcon image={CRL_Logo} type="lab"></CreditIcon>
                  <div className="splashscreen-body-text-container">
                    <div className="splashscreen-body-title">
                      {title}
                      <div className="emph">{subtitle}</div>
                    </div>
                    <div className="splashscreen-body-main">
                      {body}
                      <div className="sub">
                        {citation} {doi}
                      </div>
                    </div>
                  </div>
                  <div className="navigation-buttons-container">
                    <NavigationButton
                      text="Explore"
                      type="gotomap"
                      setSplashScreen={setSplashScreen}
                    />
                    <NavigationButton text="Lab Website" link={lab} />
                    <NavigationButton text="Learn More" link={paper} />
                  </div>
                </div>
                <div className="sponsors-panel">
                  <CreditIcon
                    image={WB}
                    type="sponsor"
                    height={38}
                  ></CreditIcon>
                  <CreditIcon
                    image={AXA}
                    type="sponsor"
                    height={38}
                  ></CreditIcon>
                  <CreditIcon
                    image={IKI}
                    type="sponsor"
                    height={38}
                  ></CreditIcon>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default function SplashScreen({ splashScreenOn, setSplashScreen }) {
  const { innerWidth } = window;
  if (innerWidth < 1100) {
    return (
      <Mobile
        splashScreenOn={splashScreenOn}
        setSplashScreen={setSplashScreen}
      />
    );
  }
  return (
    <Desktop
      splashScreenOn={splashScreenOn}
      setSplashScreen={setSplashScreen}
    />
  );
}
