import ReactGA from "react-ga4";

// Researchers
import UCSC from "../assets/CCCR-UCSC.png";
import IHCant from "../assets/IHCantabria.png";

// Other Sponsors
import AXA from "../assets/AXA_Research_Fund.png";
import WB from "../assets/The_World_Bank.png";
import TNC from "../assets/Nature_Conservancy_Logo_Color.jpg";
import { useSpring, animated } from "@react-spring/web";

export const SplashScreen = ({
  showSplashScreen,
  setSplashScreen,
}: {
  showSplashScreen: boolean;
  setSplashScreen: (show: boolean) => void;
}) => {
  const [springProps, springPropsApi] = useSpring(() => ({
    opacity: showSplashScreen ? 1 : 0,
    config: { duration: 300 },
  }));

  const enterExplorer = async () => {
    ReactGA.event({
      category: "Splash Screen",
      action: "Enter Explorer",
    });
    springPropsApi.start({ opacity: 0 })[0].then(() => {
      setSplashScreen(false);
    });
  };

  if (!showSplashScreen) return null;

  return (
    <animated.div
      style={springProps}
      className="z-10 w-full h-full overflow-scroll absolute bg-cover bg-bottom bg-open bg-[url('./assets/splash-screen-mobile.jpg')] md:bg-[url('./assets/splash-screen-wide.jpg')]"
    >
      <div className="z-10 w-full h-full overflow-scroll flex-col flex absolute justify-between">
        <header className="flex px-2 md:px-8 py-1 pr-12 md:pr-24 scale-y-[-1] mr-auto bg-[length:100%_100%] bg-[url('./assets/SplashFooterBackground.png')]">
          <div className="flex flex-row items-center scale-y-[-1]">
            <img src={UCSC} alt="UCSC Logo" className="w-48 mt-5 max-w-[45%]" />
            <img
              src={IHCant}
              alt="IH Logo"
              className="w-48 max-w-[45%]	ml-4 md:ml-8"
            />
          </div>
        </header>
        <main className="flex text-left">
          <div
            className="mx-3 my-4 md:mx-[5%] md:max-w-[630px]"
            data-cy="splashscreen-body-title"
          >
            <h2 className="text-white leading-none md:leading-tight">
              Coastal Resilience{" "}
            </h2>
            <h1 className="text-white leading-10 mb-4 md:mb-8 -translate-x-1">
              Explorer
            </h1>
            <p className="body-large text-white mb-2">
              Climate change, coastal development and habitat loss all increase
              coastal risk to people and property.
            </p>
            <p className="body-large text-white mb-6">
              Explore the coastlines at the greatest risk and where nature-based
              solutions provide the greatest benefits.
            </p>
            <p className="label-large text-white mb-4">
              Source to be Cited: Menéndez, Losada, Torres-Ortega, Narayan &
              Beck. The Global Flood Protection Benefits of Mangroves. 2020.{" "}
              <a
                className="label-large text-white"
                href="https://doi.org/10.1038/s41598-020-61136-6"
                target="_blank"
                rel="noreferrer"
              >
                https://doi.org/10.1038/s41598-020-61136-6&nbsp;–›
              </a>
            </p>
            <p className="label-large text-white mb-8">
              Learn more about the{" "}
              <a
                className="label-large text-white"
                href="https://www.coastalresiliencelab.org/"
                target="_blank"
                rel="noreferrer"
              >
                UCSC Center for Coastal Climate Resilience&nbsp;–›
              </a>
            </p>
            <button
              className="btn-large"
              onClick={enterExplorer}
              data-cy="splashscreen-cta"
            >
              Enter the Explorer
            </button>
          </div>
        </main>
        <footer className="flex flex-col px-2 md:px-8 py-1 pr-12 md:pr-24 mr-auto bg-[length:100%_100%] bg-[url('./assets/SplashFooterBackground.png')]">
          <p className="label text-left mx-1 mb-2 md:mx-4">
            This project is made possible by the support of our sponsors:
          </p>
          <div className="flex">
            <img
              src={WB}
              alt="The World Bank Logo"
              className="max-h-7	pt-0.25 max-w-[30%] md:max-w-[30%] mx-1 md:mx-4"
            />
            <img
              src={AXA}
              alt="AXA Research Fund Logo"
              className="max-h-8	max-w-[33%] md:max-w-[33%] mx-1 md:mx-4"
            />
            <img
              src={TNC}
              alt="TNC Logo"
              className="max-h-8 max-w-[33%] md:max-w-[33%] mx-1 md:mx-4"
            />
          </div>
        </footer>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-open/70 to-open/90 md:from-open/10 md:via-open/60 md:to-open/90" />
    </animated.div>
  );
};
