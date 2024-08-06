import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import layerGroups from "layers/layers";
import { LayerGroupName } from "types/dataModel";
import { kFormatter } from "hooks/utils/formattingUtils";
import { BasemapStyle } from "basemap_manager/BasemapManager";

const baseStyles = "transition-opacity w-56 ";

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
  const popover = useRef<mapboxgl.Popup | null>(null);
  const hoveredFeature = useRef<mapboxgl.MapboxGeoJSONFeature | null>(null);
  const colors = ThemeMap[theme];

  useEffect(() => {
    mapScale.current = map?.getZoom();
    map?.on("zoomend", () => {
      mapScale.current = map.getZoom();
    });
  }, [map]);

  const updateFeatureState = useCallback(
    (feature: mapboxgl.MapboxGeoJSONFeature, state: boolean) => {
      map.setFeatureState(
        {
          source: feature.layer.source as string,
          sourceLayer: feature.layer["source-layer"] as string,
          id: feature.id,
        },
        { hovered: state },
      );
    },
    [map],
  );

  const onHover = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      if (
        mapScale.current > 4 &&
        e.features?.[0]?.properties?.[
          layerGroups[selectedLayer]?.metricKey as string
        ]
      ) {
        map.getCanvas().style.cursor = "pointer";
        const hoveredTessela = e.features?.[0];

        if (popover.current) {
          popover.current.remove();
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        updateFeatureState(hoveredTessela, true);
        hoveredFeature.current = hoveredTessela;
        popover.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        popover.current.setHTML(`
          <div class="rounded border-${
            colors.borderColor
          } border-[1px] p-4 bg-${colors.bgColor}">
            <h6 class="mb-1 text-${colors.textColor}">Study Unit ${
              hoveredTessela.id
            } (${hoveredTessela.properties?.ISO3})</h6>
            ${
              layerGroups[selectedLayer]?.metricKey &&
              hoveredTessela.properties?.[
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
        `);

        // Copy coordinates array.
        const coordinates = (hoveredTessela.geometry as any).coordinates as [
          number,
          number,
        ];

        // Get the screen coordinates of the point
        const point = map.project(coordinates);
        const mapHeight = map.getContainer().clientHeight;

        // Determine if the popup should be rendered above or below the point
        const offset = point.y > mapHeight * 0.1 ? -20 : 20;

        // Populate the popup and set its coordinates
        // based on the feature found.
        popover.current
          .setLngLat({
            lng: coordinates[0],
            lat: coordinates[1],
          })
          .setOffset([0, offset])
          .addTo(map);

        setTimeout(() => {
          if (popover.current) {
            timeoutRef.current && clearTimeout(timeoutRef.current);
            popover.current.addClassName(baseStyles + "!opacity-100");
          }
        }, 100);
      }
    },
    [
      colors.bgColor,
      colors.borderColor,
      colors.textColor,
      map,
      selectedLayer,
      updateFeatureState,
    ],
  );

  const onHoverEnd = useCallback(() => {
    map.getCanvas().style.cursor = "grab";
    if (hoveredFeature.current) {
      updateFeatureState(hoveredFeature.current, false);
    }
    setTimeout(() => {
      if (popover.current) {
        popover.current.addClassName(baseStyles + "!opacity-0");
        timeoutRef.current = setTimeout(() => {
          if (popover.current) {
            popover.current.remove();
            popover.current = null;
          }
        }, 500);
      }
    }, 50);
  }, [map]);

  useEffect(() => {
    map?.on("mouseenter", "tessela_rps", (e: mapboxgl.MapLayerMouseEvent) => {
      onHover(e);
    });
    map?.on("mouseleave", "tessela_rps", () => {
      onHoverEnd();
    });
  }, [map, onHover, onHoverEnd]);
}
