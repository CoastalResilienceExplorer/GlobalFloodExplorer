import ReactGA from "react-ga4";

// Researchers
import UCSC from "../assets/UCSC_White_Logo.png";
import IHCant from "../assets/ih_logo.png";

// Other Sponsors
import IKI from "../assets/IKI_Climate.jpg";
import AXA from "../assets/AXA_Research_Fund.jpg";
import WB from "../assets/world-bank-logo.jpg";
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
      className="z-10 w-full h-full flex-col flex absolute bg-cover justify-between bg-open bg-[url('./assets/SplashBackground_Mobile.jpg')] md:bg-[url('./assets/SplashBackground.jpg')]"
    >
      <header className="flex flex-row m-2 md:m-8 items-center">
        <img src={UCSC} alt="UCSC Logo" className="w-64 mt-7 max-w-[45%]" />
        <img
          src={IHCant}
          alt="IH Logo"
          className="w-64 max-w-[45%]	ml-4 md:ml-8"
        />
      </header>
      <main className="flex text-left">
        <div
          className="mx-3 md:mx-[10%] md:max-w-[680px]"
          data-cy="splashscreen-body-title"
        >
          <h2 className="text-white leading-none md:leading-tight">
            Coastal Resilience{" "}
          </h2>
          <h1 className="text-white leading-10 mb-4 md:mb-8 -translate-x-1">
            Explorer
          </h1>
          <p className="body-large text-white mb-2">
            Increasing coastal hazards due to climate change require innovative
            solutions that leverage natural infrastructure like reefs and
            mangroves.
          </p>
          <p className="body-large text-white mb-6">
            Explore the shorelines providing the most greatest benefits to
            humans and those at greatest risk in our rapidly changing climate.
          </p>
          <p className="label-large text-white mb-4">
            Based on the findings of: Menéndez, P., Losada, I.J., Torres-Ortega,
            S. et al. The Global Flood Protection Benefits of Mangroves. Sci Rep
            10, 4404 (2020).{" "}
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
            Learn more about{" "}
            <a
              className="label-large text-white"
              href="https://www.coastalresiliencelab.org/"
              target="_blank"
              rel="noreferrer"
            >
              UCSC’s Coastal Resilience Lab&nbsp;–›
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
            className="max-h-8	max-w-[22%] md:max-w-[25%] mx-1 md:mx-4"
          />
          <img
            src={AXA}
            alt="AXA Research Fund Logo"
            className="max-h-8	max-w-[22%] md:max-w-[25%] mx-1 md:mx-4"
          />
          <img
            src={IKI}
            alt="International Climate Initiative Logo"
            className="max-h-8 max-w-[22%] md:max-w-[25%] mx-1 md:mx-4"
          />
          <img
            src={TNC}
            alt="TNC Logo"
            className="max-h-8 max-w-[22%] md:max-w-[25%] mx-1 md:mx-4"
          />
        </div>
      </footer>
    </animated.div>
  );
};
