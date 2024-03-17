import { mang_ha_perc_change, mang_ha_total_change } from "./layers";

export const default_mang_perc_change_filter = -0.15;
export const default_mang_total_change_filter = -100;
const default_filter = [
  "any",
  ["<", mang_ha_perc_change, default_mang_perc_change_filter],
  ["<", mang_ha_total_change, default_mang_total_change_filter],
];
const all_features = ["<", mang_ha_total_change, 10000000];

export const filters = {
  tessela_bounds: default_filter,
  tessela_rps: default_filter,
  hex: default_filter,
  hex2: default_filter,
};

export const no_filters = {
  tessela_bounds: all_features,
  tessela_rps: all_features,
  hex: all_features,
  hex2: all_features,
};
