import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import layerGroups from "layers/layers";
import { LayerGroupName } from "types/dataModel";
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

export function useHover(
  map: mapboxgl.Map,
  selectedLayer: LayerGroupName,
  theme: BasemapStyle,
) {
  const mapScale = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popover = useRef<HTMLDivElement | null>(null);
  const [hoveredTessela, setHoveredTessela] = useState<Tessela | null>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const colors = ThemeMap[theme];

  useEffect(() => {
    mapScale.current = map?.getZoom();
    map?.on("zoomend", () => {
      mapScale.current = map.getZoom();
    });
  }, [map]);

  const onHover = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      if (
        mapScale.current > 4 &&
        e.features?.[0]?.properties?.[
          layerGroups[selectedLayer]?.metricKey as string
        ]
      ) {
        map.getCanvas().style.cursor = "pointer";
        hoverTimer.current = setTimeout(() => {
          if (e.features?.[0]?.id && e.features[0].id !== hoveredTessela?.id) {
            setHoveredTessela({
              ...e.features[0],
              lngLat: e.lngLat,
            });
          }
        }, 100);
      }
    },
    [hoveredTessela?.id, map, selectedLayer],
  );

  const onHoverEnd = useCallback(() => {
    map.getCanvas().style.cursor = "grab";
    setTimeout(() => {
      setHoveredTessela(null);
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current);
      }
    }, 50);
  }, [map]);

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
                  selectedLayer === LayerGroupName.Population ? "" : "$"
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
          timeoutRef.current && clearTimeout(timeoutRef.current);
          const popoverHeight = popover.current.getBoundingClientRect().height;
          marker.setOffset([0, -popoverHeight]);
          popover.current.className = baseStyles + "opacity-100";
        }
      }, 10);
    } else {
      if (popover.current) {
        popover.current.className = baseStyles + "!opacity-0";
        timeoutRef.current = setTimeout(() => {
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
    });
    map?.on("mouseleave", "tessela_rps", () => {
      onHoverEnd();
    });
  }, [map, onHover, onHoverEnd]);
}
