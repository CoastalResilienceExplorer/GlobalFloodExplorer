import { useEffect, useState, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import layerGroups from "layers/layers";
import { LayerName } from "types/dataModel";
import { kFormatter } from "hooks/utils/formattingUtils";
import { BasemapStyle } from "basemap_manager/BasemapManager";

const baseStyles = "transition-opacity w-56 ";

interface Tessela {
  id?: number | string;
  properties: any;
  lngLat: mapboxgl.LngLat;
}

interface ColorDefintion {
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const ThemeMap: Record<BasemapStyle, ColorDefintion> = {
  [BasemapStyle.Satellite]: {
    bgColor: "trench",
    textColor: "white",
    borderColor: "trench",
  },
  [BasemapStyle.Light]: {
    bgColor: "white",
    textColor: "black",
    borderColor: "shoreline",
  },
  [BasemapStyle.Dark]: {
    bgColor: "trench",
    textColor: "white",
    borderColor: "trench",
  },
};

function updatePaintProperties(
  map: mapboxgl.Map,
  style: any, //Object
  layer: string,
  feature_state: string,
) {
  Object.keys(style).map((k) => {
    const v = style[k];
    const current = map.getPaintProperty(layer, k);
    map.setPaintProperty(layer, k, [
      "case",
      ["boolean", ["feature-state", feature_state], false],
      v,
      current,
    ]);
  });
}

export function useHover(
  map: mapboxgl.Map,
  selectedLayer: LayerName,
  theme: BasemapStyle,
) {
  const popover = useRef<HTMLDivElement | null>(null);
  const [hoveredTessela, setHoveredTessela] = useState<Tessela | null>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const colors = ThemeMap[theme];

  const onHover = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      hoverTimer.current = setTimeout(() => {
        if (e.features?.[0]?.id && e.features[0].id !== hoveredTessela?.id) {
          setHoveredTessela({
            ...e.features[0],
            lngLat: e.lngLat,
          });
        }
      }, 500);
    },
    [hoveredTessela?.id],
  );

  const onHoverEnd = useCallback(() => {
    setHoveredTessela(null);
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
  }, []);

  useEffect(() => {
    if (hoveredTessela) {
      if (popover.current) {
        popover.current.remove();
      }
      popover.current = document.createElement("div");
      popover.current.className = baseStyles + "opacity-0";
      popover.current.innerHTML = `
        <div class="rounded border-${colors.borderColor} border-[1px] p-4 bg-${
          colors.bgColor
        }">
          <h6 class="mb-1 text-${colors.textColor}">Study Unit ${
            hoveredTessela.id
          } (${hoveredTessela.properties.ISO3})</h6>
          ${
            layerGroups[selectedLayer]?.metricKey &&
            hoveredTessela.properties[
              layerGroups[selectedLayer]?.metricKey as string
            ]
              ? `<p class="lining-nums text-${
                  colors.textColor
                }">${selectedLayer}:  ${
                  selectedLayer === LayerName.Population ? "" : "$"
                }${kFormatter(
                  hoveredTessela.properties[
                    layerGroups[selectedLayer]?.metricKey as string
                  ],
                )} ${layerGroups[selectedLayer]?.units}</p>`
              : ""
          }
        </div>
      `;

      // create the marker
      const marker = new mapboxgl.Marker(popover.current).setLngLat(
        hoveredTessela.lngLat,
      );
      marker.setOffset([0, -200]);
      marker.addTo(map);

      setTimeout(() => {
        if (popover.current) {
          const popoverHeight = popover.current.getBoundingClientRect().height;
          marker.setOffset([0, -popoverHeight]);
          popover.current.className = baseStyles + "opacity-100";
        }
      }, 10);
    } else {
      if (popover.current) {
        popover.current.className = baseStyles + "!opacity-0";
        setTimeout(() => {
          if (popover.current) {
            popover.current.remove();
            popover.current = null;
          }
        }, 500);
      }
    }
  }, [
    colors.bgColor,
    colors.borderColor,
    colors.textColor,
    hoveredTessela,
    map,
    selectedLayer,
  ]);

  useEffect(() => {
    map?.on("mouseenter", "tessela_rps", (e: mapboxgl.MapLayerMouseEvent) => {
      onHover(e);
      map.getCanvas().style.cursor = "pointer";
    });
    map?.on("mouseleave", "tessela_rps", () => {
      onHoverEnd();
      map.getCanvas().style.cursor = "grab";
    });
  }, [map, onHover, onHoverEnd]);
}
