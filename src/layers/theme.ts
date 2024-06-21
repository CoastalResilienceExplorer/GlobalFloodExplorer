import { BasemapStyle } from "basemap_manager/BasemapManager";

export const initTheme = window.matchMedia
  ? window.matchMedia("(prefers-color-scheme: dark)").matches
    ? BasemapStyle.Dark
    : BasemapStyle.Light
  : BasemapStyle.Light;
