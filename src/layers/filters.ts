import { LayerName } from "types/dataModel";
import { mang_ha_perc_change, ben_stock } from "./layers";
import { Filter } from "types/dataModel";

const default_mang_ha_filter = -0.0;
export const filters: Record<string, Filter> = {
  tessela_bounds: ["<", mang_ha_perc_change, default_mang_ha_filter],
  tessela_rps: ["<", mang_ha_perc_change, default_mang_ha_filter],
};
