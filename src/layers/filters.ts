import { mang_ha_perc_change, ben_stock } from "./layers";
import { Filter } from "types/dataModel";

const default_mang_ha_filter = -0.15;
export const filters: Record<string, Filter> = {
  tessela_bounds: ["<", mang_ha_perc_change, default_mang_ha_filter],
  tessela_rps: ["<", mang_ha_perc_change, default_mang_ha_filter],
};

export const no_filters: Record<string, Filter> = {};
