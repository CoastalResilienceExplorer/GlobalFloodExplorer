import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSpring, animated, SpringValue } from "@react-spring/web";
import { LayerGroup, LayerName } from "types/dataModel";
import { ReactComponent as LinkSvg } from "assets/link-icon.svg";
import downloads from "data/downloads";
import SearchBar, { Bounds } from "panels/home-info-panel/search-bar";
import { Icon } from "@iconify/react";
import {
  useLayerBounceContext,
  LayerSelectionFrom,
  LAYER_BOUNCE_FLASH_TIMEOUT,
  LAYER_BOUNCE_OPEN_TIMEOUT,
} from "layers/layer-bounce";
import "panels/layer-selection/layer-selection.css";
import QuickExplore from "panels/quick-explore";

type LayerSelectionProps = {
  layerGroups: Record<LayerName, LayerGroup>;
  selectedLayer: LayerName;
  setSelectedLayer: (layer: LayerName) => void;
  setBounds: (bounds: Bounds) => void;
};

const ICON_CONTAINER_INITIAL_WIDTH = 55;
const ICON_INITIAL_SIZE = 30;
const ICON_HOVER_SIZE = 35;

export const LayerSelection: React.FC<LayerSelectionProps> = ({
  layerGroups,
  selectedLayer,
  setSelectedLayer,
  setBounds,
}) => {
  const { layerGroupSelectedFrom, setLayerGroupSelectedFrom } =
    useLayerBounceContext();
  const layerSelectionContainer = useRef<HTMLDivElement>(null);
  const activeLayerButton = useRef<HTMLButtonElement>(null);
  const [containerSprings, containerApi] = useSpring(() => ({
    from: { width: ICON_CONTAINER_INITIAL_WIDTH },
  }));
  const [iconSprings, iconApi] = useSpring(() => ({
    from: { width: ICON_INITIAL_SIZE, height: ICON_INITIAL_SIZE },
  }));

  useEffect(() => {
    containerApi.start({ width: ICON_CONTAINER_INITIAL_WIDTH });
  }, [containerApi]);

  const handleIconHover = useCallback(() => {
    containerApi.start({ width: activeLayerButton.current?.scrollWidth });
    iconApi.start({ width: ICON_HOVER_SIZE, height: ICON_HOVER_SIZE });
  }, [containerApi, iconApi]);

  const handleIconUnhover = useCallback(() => {
    containerApi.start({ width: ICON_CONTAINER_INITIAL_WIDTH });
    iconApi.start({ width: ICON_INITIAL_SIZE, height: ICON_INITIAL_SIZE });
  }, [containerApi, iconApi]);

  useEffect(() => {
    if (layerGroupSelectedFrom === LayerSelectionFrom.breadcrumb) {
      handleIconHover();
      setTimeout(() => {
        handleIconUnhover();
      }, LAYER_BOUNCE_OPEN_TIMEOUT); //This is the length of time to open the panel
      setTimeout(() => {
        setLayerGroupSelectedFrom(LayerSelectionFrom.reset);
      }, LAYER_BOUNCE_FLASH_TIMEOUT); //This should correspond to whatever the CSS animation time is, or it will be cut short
    }
  }, [
    handleIconHover,
    handleIconUnhover,
    layerGroupSelectedFrom,
    setLayerGroupSelectedFrom,
  ]);

  return (
    <animated.div
      className="layer-selection absolute z-[02] top-0 left-0 bg-open overflow-hidden rounded-br-lg"
      onMouseEnter={handleIconHover}
      onMouseLeave={handleIconUnhover}
      ref={layerSelectionContainer}
      style={{ ...containerSprings }}
    >
      {Object.values(layerGroups).map((layerGroup, index) => (
        <button
          key={index}
          className={`hover:bg-shoreline block text-left transition-[height] ${
            layerGroup.name === selectedLayer && "bg-shoreline selected"
          } ${
            layerGroupSelectedFrom === LayerSelectionFrom.breadcrumb && "bounce"
          }`}
          onClick={() => {
            setSelectedLayer(layerGroup.name);
            setLayerGroupSelectedFrom(LayerSelectionFrom.layerSelectionPanel);
          }}
          ref={layerGroup.name === selectedLayer ? activeLayerButton : null}
        >
          <MenuItem
            iconSprings={iconSprings}
            name={layerGroup.name}
            IconComponent={layerGroup.IconComponent}
            description={layerGroup.shortDescription}
          />
        </button>
      ))}

      <div className="bg-trench hover:bg-shoreline block text-left transition-[height]">
        <MenuItem
          iconSprings={iconSprings}
          name="Links"
          description={
            <>
              <p>
                Learn more about{" "}
                <a
                  href="https://www.coastalresiliencelab.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-coral hover:stroke-coral hover:fill-coral"
                >
                  UCSC’s Coastal Resilience Lab&nbsp;–›
                </a>
              </p>
              <p>
                Read{" "}
                <a
                  href="https://doi.org/10.1038/s41598-020-61136-6"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-coral hover:stroke-coral hover:fill-coral"
                >
                  the report&nbsp;–›
                </a>
              </p>
            </>
          }
        />
      </div>
      <div className="bg-trench hover:bg-shoreline block text-left transition-[height]">
        <MenuItem
          iconSprings={iconSprings}
          name="Downloads"
          description={
            <p>
              {downloads.map((download) => (
                <a
                  href={download.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex row items-center gap-2 hover:text-coral hover:stroke-coral hover:fill-coral"
                >
                  {download.description} {download.icon}
                </a>
              ))}
            </p>
          }
          IconComponent={() => (
            <Icon
              icon="material-symbols:download"
              className="w-full h-full -translate-y-1"
              height="1.5em"
              width="1.5em"
              color="white"
            />
          )}
        />
      </div>
      <div className="bg-trench hover:bg-shoreline block text-left transition-[height]">
        <MenuItem
          iconSprings={iconSprings}
          name="Quick Explore"
          description={(updateHeight, hovered) => <QuickExplore />}
          IconComponent={() => (
            <Icon
              icon="material-symbols:explore-outline"
              color="white"
              className="w-full h-full"
            />
          )}
        />
      </div>
      {typeof window.google !== "undefined" && (
        <div className="bg-trench hover:bg-shoreline block text-left transition-[height]">
          <MenuItem
            iconSprings={iconSprings}
            name="Search"
            description={(updateHeight, hovered) => (
              <SearchBar
                setBounds={setBounds}
                updateHeight={updateHeight}
                hovered={hovered}
              />
            )}
            IconComponent={() => (
              <Icon
                icon="material-symbols:search"
                width="1.5em"
                height="1.5em"
                color="white"
                className="w-full h-full"
              />
            )}
          />
        </div>
      )}
    </animated.div>
  );
};

export type UpdateHeightFunc = (height?: number) => void;

const MenuItem: React.FC<{
  iconSprings: {
    width: SpringValue<number>;
    height: SpringValue<number>;
  };
  name: string | React.ReactNode;
  IconComponent?: React.FC<React.SVGProps<SVGSVGElement>>;
  description:
    | string
    | React.ReactNode
    | ((updateHeight: UpdateHeightFunc, hovered: boolean) => React.ReactNode);
}> = ({ iconSprings, name, IconComponent, description }) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [hovered, setHovered] = useState(false);
  const [descriptionSprings, descriptionApi] = useSpring(() => ({
    from: { height: 0 },
  }));

  const handleCopyHover = () => {
    descriptionApi.start({ height: descriptionRef.current?.scrollHeight });
    setHovered(true);
  };

  const handleCopyUnhover = () => {
    setTimeout(() => {
      descriptionApi.start({ height: 0 });
      setHovered(false);
    }, 200);
  };

  const updateHeight = useCallback<UpdateHeightFunc>(
    (height) => {
      descriptionApi.start({
        height: height ? height : descriptionRef.current?.scrollHeight,
      });
    },
    [descriptionApi],
  );

  return (
    <div className="grid grid-flow-col gap-3 px-3 max-w-lg">
      <div className="self-start py-2">
        <animated.div style={{ ...iconSprings }}>
          {IconComponent ? (
            <IconComponent fill="white" />
          ) : (
            <LinkSvg
              color="white"
              width="83%"
              height="83%"
              className="mx-auto"
            />
          )}
        </animated.div>
      </div>
      <div
        onMouseEnter={handleCopyHover}
        onMouseLeave={handleCopyUnhover}
        className="w-96 py-2 text-white px-3"
      >
        <h4 className="w-full">{name}</h4>
        {description && typeof description === "string" ? (
          <animated.p
            className="w-full overflow-hidden"
            style={{ ...descriptionSprings }}
            ref={descriptionRef}
          >
            {description}
          </animated.p>
        ) : (
          <animated.div
            className="w-full overflow-hidden"
            style={{ ...descriptionSprings }}
            ref={descriptionRef}
          >
            {typeof description === "function"
              ? description(updateHeight, hovered)
              : description}
          </animated.div>
        )}
      </div>
    </div>
  );
};
