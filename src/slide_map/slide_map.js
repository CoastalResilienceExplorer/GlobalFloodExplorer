import { useMap } from "hooks/useMap"
import { useSlideMap } from "hooks/useSlideMap_copy";
import { useLayers } from "hooks/layers/useLayers";

import sources from "layers/sources";
import layers from "layers/layers";
import { protos as custom_layer_protos } from "layers/protos/custom_protos";
import { useEffect } from "react";

import "./flood_selector.css";
import { FloodSelector } from './flood_selector'

export function SlideMap({
    visible,
    initialStates,
    access_token,
    other_map
}) {
    const {
        map: left_map,
        mapContainer: left_mapContainer,
        mapLoaded: left_mapLoaded,
        viewport: left_viewport,
        style: left_style,
        setStyle: left_setStyle,
        flyToViewport: left_flyToViewport,
    } = useMap(
        initialStates.viewport,
        "mapbox://styles/mapbox/satellite-v9",
        access_token
    );

    const {
        map: right_map,
        mapContainer: right_mapContainer,
        mapLoaded: right_mapLoaded,
        viewport: right_viewport,
        style: right_style,
        setStyle: right_setStyle,
        flyToViewport: right_flyToViewport,
    } = useMap(
        initialStates.viewport,
        "mapbox://styles/mapbox/satellite-v9",
        access_token
    )

    const {
        layerGroup: left_layerGroup,
        layerSelectionDependencies: left_layerSelectionDependencies,
        subgroup: left_subgroup,
        subgroupOn: left_subgroupOn,
        setLayerGroup: left_setLayerGroup,
        setSubgroup: left_setSubgroup,
    } = useLayers(
        left_map,
        left_mapLoaded,
        initialStates.layer,
        initialStates.subgroup,
        left_style,
        layers,
        sources,
        custom_layer_protos,
    );

    const {
        layerGroup: right_layerGroup,
        layerSelectionDependencies: right_layerSelectionDependencies,
        subgroup: right_subgroup,
        subgroupOn: right_subgroupOn,
        setLayerGroup: right_setLayerGroup,
        setSubgroup: right_setSubgroup,
    } = useLayers(
        right_map,
        right_mapLoaded,
        initialStates.layer,
        initialStates.subgroup,
        right_style,
        layers,
        sources,
        custom_layer_protos,
    );

    useEffect(() => {
        left_setLayerGroup("Flooding")
        right_setLayerGroup("Flooding")
    }, [left_mapLoaded, right_mapLoaded])

    const {
        leftClip,
        rightClip,
        slideTransformPx
    } = useSlideMap(
        left_map,
        right_map,
        other_map
    );

    return <div
        id="slide-map-container"
        style={{ visibility: visible }}>
        <div
            ref={left_mapContainer}
            className="map"
            style={{ "clipPath": leftClip }}></div>
        <div
            ref={right_mapContainer}
            className="map"
            style={{ "clipPath": rightClip }}></div>
        <div
            className="mapboxgl-compare"
            style={{ "transform": `translate(${slideTransformPx}px, 0px)` }}>
            <div className='left'>
                <FloodSelector
                    offset={-133}
                    floodGroup={left_subgroup}
                    setFloodGroup={left_setSubgroup}
                    floodingOn={true}
                />
            </div>
            <div id="compare-swiper-vertical"></div>
            <FloodSelector
                offset={5}
                floodGroup={right_subgroup}
                setFloodGroup={right_setSubgroup}
                floodingOn={true}
            />
        </div>
    </div>
}
