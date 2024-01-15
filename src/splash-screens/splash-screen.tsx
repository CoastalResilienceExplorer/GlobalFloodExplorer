import * as React from "react";
import ReactGA from "react-ga4";
import "./splash-screen.css";

// Researchers
import UCSC from "../assets/UCSC_White_Logo.png";
import TNC from "../assets/TNC logo_grayscale.png";
import IHCant from "../assets/ih_logo.png";

// Other Sponsors
import IKI from "../assets/IKI_Climate.jpg";
import AXA from "../assets/AXA_Research_Fund.jpg";
import WB from "../assets/world-bank-logo.jpg";

export const SplashScreen = () => {
  return (
    <div className="z-10 w-full h-full flex-col flex absolute bg-cover justify-between bg-[url('./assets/SplashBackground.jpg')]">
      <header className="flex flex-row m-8 items-center">
        <img src={UCSC} alt="UCSC Logo" className="w-52" />
        <img src={TNC} alt="TNC Logo" className="w-60	ml-4" />
        <img src={IHCant} alt="IH Logo" className="w-52	ml-4" />
      </header>
      <main className="flex text-left">
        <div className="mx-32 max-w-[680px]">
          <h2 className="text-white leading-none">Coastal Resilience </h2>
          <h1 className="text-white leading-10 mb-6">Explorer</h1>
          <p className="body-large text-white mb-2">
            Increasing coastal hazards due to climate change require innovative
            solutions that leverage natural infrastructure like reefs and
            mangroves.
          </p>
          <p className="body-large text-white mb-6">
            Explore the shorelines providing the most greatest benefits to
            humans and those at greatest risk in our rapidly changing climate.
          </p>
          <p className="label-large text-white">
            Based on the findings of: Menéndez, P., Losada, I.J., Torres-Ortega,
            S. et al. The Global Flood Protection Benefits of Mangroves. Sci Rep
            10, 4404 (2020).{" "}
            <a
              className="label-large text-white"
              href="https://doi.org/10.1038/s41598-020-61136-6"
              target="_blank"
              rel="noreferrer"
            >
              https://doi.org/10.1038/s41598-020-61136-6 –›
            </a>
          </p>
          <p className="label-large text-white mb-6">
            Learn more about{" "}
            <a
              className="label-large text-white"
              href="https://www.coastalresiliencelab.org/"
              target="_blank"
              rel="noreferrer"
            >
              UCSC’s Coastal Resilience Lab –›
            </a>
          </p>
        </div>
      </main>
      <footer className="flex px-8 py-1 pr-24 mr-auto bg-[length:100%_100%] bg-[url('./assets/SplashFooterBackground.png')]">
        <img src={WB} alt="UCSC Logo" className="h-12	mx-4" />
        <img src={AXA} alt="TNC Logo" className="h-12	mx-4" />
        <img src={IKI} alt="IH Logo" className="h-12 mx-4" />
      </footer>
    </div>
  );
};
