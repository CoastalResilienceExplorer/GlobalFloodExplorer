import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSpring, animated, SpringValue } from "@react-spring/web";
import { LayerGroup, LayerName } from "types/dataModel";
import { ReactComponent as LinkSvg } from "assets/link-icon.svg";
import downloads from "data/downloads";
import SearchBar, { Bounds } from "panels/home-info-panel/search-bar";
import { Icon } from "@iconify/react";

type LayerSelectionProps = {
  layerGroups: Record<LayerName, LayerGroup>;
  selectedLayer: LayerName;
  setSelectedLayer: (layer: LayerName) => void;
  setBounds: (bounds: Bounds) => void;
};

const LINKS = [
  {
    name: "Lab Website",
    description: "Lab description to come",
    url: "https://www.google.com",
  },
  {
    name: "Publication",
    description: "Menendez et al. 2020.",
    url: "https://www.google.com",
  },
  {
    name: "Downloads",
    description: (
      <>
        {downloads.map((download, index) => (
          <a
            href={download.url}
            target="_blank"
            rel="noreferrer"
            className="flex row items-center gap-2 hover:text-trench"
          >
            {download.icon} {download.description}
          </a>
        ))}
      </>
    ),
    url: "https://www.google.com",
  },
];

const ICON_INITIAL_SIZE = 30;
const ICON_HOVER_SIZE = 40;

export const LayerSelection: React.FC<LayerSelectionProps> = ({
  layerGroups,
  selectedLayer,
  setSelectedLayer,
  setBounds,
}) => {
  const layerSelectionContainer = useRef<HTMLDivElement>(null);
  const activeLayerButton = useRef<HTMLButtonElement>(null);
  const [containerSprings, containerApi] = useSpring(() => ({
    from: { width: 60 },
  }));
  const [iconSprings, iconApi] = useSpring(() => ({
    from: { width: ICON_INITIAL_SIZE, height: ICON_INITIAL_SIZE },
  }));

  useEffect(() => {
    containerApi.start({ width: 60 });
  }, [containerApi]);

  const handleIconHover = () => {
    containerApi.start({ width: activeLayerButton.current?.scrollWidth });
    iconApi.start({ width: ICON_HOVER_SIZE, height: ICON_HOVER_SIZE });
  };

  const handleIconUnhover = () => {
    containerApi.start({ width: 60 });
    iconApi.start({ width: ICON_INITIAL_SIZE, height: ICON_INITIAL_SIZE });
  };

  return (
    <animated.div
      className="absolute z-[02] top-0 left-0 bg-open overflow-hidden rounded-br-lg"
      onMouseEnter={handleIconHover}
      onMouseLeave={handleIconUnhover}
      ref={layerSelectionContainer}
      style={{ ...containerSprings }}
    >
      {Object.values(layerGroups).map((layerGroup, index) => (
        <button
          key={index}
          className={`hover:bg-shoreline block text-left transition-[height] ${
            layerGroup.name === selectedLayer && "bg-shoreline"
          }`}
          onClick={() => setSelectedLayer(layerGroup.name)}
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
      {LINKS.map((link, i) => (
        <button
          key={i}
          className="bg-trench hover:bg-shoreline block  text-left transition-[height]"
        >
          <MenuItem
            iconSprings={iconSprings}
            name={link.name}
            description={link.description}
          />
        </button>
      ))}
      <div className="bg-trench hover:bg-shoreline block  text-left transition-[height]">
        <MenuItem
          iconSprings={iconSprings}
          name="Search"
          description={(updateHeight) => (
            <SearchBar setBounds={setBounds} updateHeight={updateHeight} />
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
    | ((updateHeight: UpdateHeightFunc) => React.ReactNode);
}> = ({ iconSprings, name, IconComponent, description }) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const [descriptionSprings, descriptionApi] = useSpring(() => ({
    from: { height: 0 },
  }));

  const handleCopyHover = () => {
    descriptionApi.start({ height: descriptionRef.current?.scrollHeight });
  };

  const handleCopyUnhover = () => {
    setTimeout(() => {
      descriptionApi.start({ height: 0 });
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
    <div className="grid grid-flow-col gap-4 px-4 max-w-lg">
      <div className="self-start py-2">
        <animated.div style={{ ...iconSprings }}>
          {IconComponent ? (
            <IconComponent fill="white" />
          ) : (
            <LinkSvg fill="white" />
          )}
        </animated.div>
      </div>
      <div
        onMouseEnter={handleCopyHover}
        onMouseLeave={handleCopyUnhover}
        className="w-96 py-2 text-white px-4"
      >
        <h3 className="w-full">{name}</h3>
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
              ? description(updateHeight)
              : description}
          </animated.div>
        )}
      </div>
    </div>
  );
};
