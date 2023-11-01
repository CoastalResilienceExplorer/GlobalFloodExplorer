import mapboxgl from "mapbox-gl";
import * as mapboxCompare from 'mapbox-gl-compare';
import { useEffect, useState, useRef } from "react";
import { getViewport } from "./utils/viewportUtils";
import { syncMaps } from "./utils/syncMaps";

export function useSlideMap(init_viewport, style, access_token, other_map) {
    mapboxgl.accessToken = access_token
    const leftContainer = useRef(null)
    const rightContainer = useRef(null)
    const [leftMap, setleftMap] = useState(null)
    const leftMapRef = useRef(null)
    const rightMapRef = useRef(null)
    const [rightMap, setrightMap] = useState(null)
    const [map, setMap] = useState(null)
    const mapContainer = useRef(null)
    const [viewport, setViewport] = useState(init_viewport);
    // const [style, setStyle] = useState(init_style);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [leftClip, setLeftClip] = useState(null)
    const [rightClip, setRightClip] = useState(null)
    const [slidePercent, setSlidePercent] = useState(50)
    const [slideTransformPx, setSlideTransformPx] = useState(null)
    const [mouseLocation, setMouseLocation] = useState(window.innerWidth / 2)
    const mapsSynced = useRef(false)

    useEffect(() => {
        setSlideTransformPx(window.innerWidth * slidePercent/100)
    }, [slidePercent])

    useEffect(() => {
        console.log(mouseLocation / window.innerWidth * 100)
        setSlidePercent(mouseLocation / window.innerWidth * 100)
    }, [mouseLocation])

    useEffect(() => {
        leftMapRef.current = leftMap
        rightMapRef.current = rightMap
        if (mapContainer.current && !map) {
            setMap(new mapboxgl.Compare(
                leftMapRef.current,
                rightMapRef.current,
                "slide-map-container", {}))
        }
        setLeftClip(`polygon(0% 0%, ${slidePercent}% 0%, ${slidePercent}% 100%, 0% 100%`)
        setRightClip(`polygon(${slidePercent}% 0%, 100% 0%, 100% 100%, ${slidePercent}% 100%`)
        if (leftMap && rightMap && other_map && !mapsSynced.current) {
            syncMaps(leftMap, rightMap, other_map)
            mapsSynced.current = true
        }    
    }, [leftMap, rightMap, mapContainer, slidePercent])

    useEffect(() => {
        if (!map) return;
        map.on("load", () => {
            map.getCanvas().style.cursor = "pointer";
            map.setRenderWorldCopies(true);
            map.flyToViewport = flyToViewport;
            map.flyToBounds = flyToBounds;

            map.on("move", () => {
                setViewport(getViewport(map));
            });

            setMapLoaded(true);
        });
        map.setSlider(0.5);
    }, [map]); // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        if (leftContainer.current) {
            console.log(document.querySelector("#left-map"))
            setleftMap(
                new mapboxgl.Map({
                    container: "left-map",
                    style: style,
                    center: [0, 0],
                    zoom: 0
                })
            )
        }

        if (rightContainer.current) {
            console.log(document.querySelector("#left-map"))
            setrightMap(
                new mapboxgl.Map({
                    container: "right-map",
                    style: style,
                    center: [0, 0],
                    zoom: 0
                }))
        }

        const el = document.querySelector("#compare-swiper-vertical")
        const map = document.querySelector("#slide-map-container")
        const mouseListener = (e) => setMouseLocation(e.clientX)

        el.addEventListener("mousedown", () => {
            map.addEventListener("mousemove", mouseListener, true)
        })
        map.addEventListener("mouseup", ()=> {
            map.removeEventListener("mousemove", mouseListener, true)
        })
    }, [])

    function flyToViewport(viewport) {
        const viewport_formatted = {
            center: [viewport.longitude, viewport.latitude],
            zoom: viewport.zoom,
            bearing: viewport.bearing,
            pitch: viewport.pitch,
            transitionDuration: viewport.transitionDuration,
        };
        map.flyTo(viewport_formatted);
    }

    function flyToBounds(bounds) {
        map.fitBounds(bounds);
    }

    return {
        map,
        mapContainer,
        leftMap,
        rightMap,
        leftMapRef,
        rightMapRef,
        leftContainer,
        rightContainer,
        leftClip,
        rightClip,
        viewport,
        style,
        slideTransformPx,
        // setStyle,
        setViewport,
        flyToViewport,
    };
}


