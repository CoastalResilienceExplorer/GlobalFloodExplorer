import { useEffect, useState, useRef } from "react";
import { syncMaps } from "./utils/syncMaps";

export function useSlideMap(left_map, right_map, other_map) {
  const [leftClip, setLeftClip] = useState(null);
  const [rightClip, setRightClip] = useState(null);
  const [slidePercent, setSlidePercent] = useState(50);
  const [slideTransformPx, setSlideTransformPx] = useState(null);
  const [mouseLocation, setMouseLocation] = useState(null);
  const mapsSynced = useRef(false);

  useEffect(() => {
    setSlideTransformPx((window.innerWidth * slidePercent) / 100);
    setLeftClip(
      `polygon(0% 0%, ${slidePercent}% 0%, ${slidePercent}% 100%, 0% 100%`,
    );
    setRightClip(
      `polygon(${slidePercent}% 0%, 100% 0%, 100% 100%, ${slidePercent}% 100%`,
    );
  }, [slidePercent]);

  useEffect(() => {
    setSlidePercent((mouseLocation / window.innerWidth) * 100);
  }, [mouseLocation]);

  useEffect(() => {
    if (left_map && right_map && other_map && !mapsSynced.current) {
      syncMaps(left_map, right_map, other_map);
      mapsSynced.current = true;
    }
  }, [left_map, right_map, other_map, slidePercent]);

  useEffect(() => {
    setMouseLocation(window.innerWidth / 2);
    const el = document.querySelector("#compare-swiper-vertical");
    const map = document.querySelector("#slide-map-container");
    const mouseListener = (e) => setMouseLocation(e.clientX);

    el.addEventListener("mousedown", (event) => {
      event.preventDefault();
      map.addEventListener("mousemove", mouseListener, true);
    });
    map.addEventListener("mouseup", () => {
      map.removeEventListener("mousemove", mouseListener, true);
    });
  }, []);

  return {
    leftClip,
    rightClip,
    slideTransformPx,
  };
}
