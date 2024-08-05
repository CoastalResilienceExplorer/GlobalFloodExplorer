import { RP } from "./floodconf";
const PMSERVER_URL = "https://pmtileserver-staging-myzvqet7ua-uw.a.run.app";

const flooding_1996_pt = {
  id: "flooding_1996_pt",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/cwon_data_chunked/with_1996_TC_Tr_${RP}/{z}/{x}/{y}.mvt`,
  ],
  minzoom: 0,
  maxzoom: 14,
};

const flooding_2015_pt = {
  id: "flooding_2015_pt",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/cwon_data_chunked/with_2015_TC_Tr_${RP}/{z}/{x}/{y}.mvt`,
  ],
  minzoom: 0,
  maxzoom: 14,
};

const flooding_nomang_pt = {
  id: "flooding_nomang_pt",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/cwon_data_chunked/Without_TC_Tr_${RP}/{z}/{x}/{y}.mvt`,
  ],
  minzoom: 0,
  maxzoom: 14,
};

const flooding_squares = {
  id: "flooding_squares",
  type: "vector",
  format: "mvt",
  tiles: [`${PMSERVER_URL}/CWON_reindexed/CWON_all_reindexed/{z}/{x}/{y}.mvt`],
  minzoom: 0,
  maxzoom: 14,
};

const mangroves_1996 = {
  id: "mangroves_1996",
  type: "vector",
  format: "mvt",
  tiles: [`${PMSERVER_URL}/vectors/GMW_1996_v3_Areas/{z}/{x}/{y}.mvt`],
  minzoom: 0,
  maxzoom: 14,
};

const mangroves_2015 = {
  id: "mangroves_2015",
  type: "vector",
  format: "mvt",
  tiles: [`${PMSERVER_URL}/vectors/GMW_2015_v3_Areas/{z}/{x}/{y}.mvt`],
  minzoom: 0,
  maxzoom: 14,
};

const CWON_RESULTS_TESELA_ALLYEARS_RepPt = {
  id: "CWON_RESULTS_TESELA_ALLYEARS_RepPt",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/cwon-teselas/CWON_RESULTS_TESELA_ALLYEARS_RepPt/{z}/{x}/{y}.mvt`,
  ],
  minzoom: 0,
  maxzoom: 14,
};

const CWON_RESULTS_TESELA_ALLYEARS = {
  id: "CWON_RESULTS_TESELA_ALLYEARS",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/cwon-teselas/CWON_RESULTS_TESELA_ALLYEARS/{z}/{x}/{y}.mvt`,
  ],
  minzoom: 0,
  maxzoom: 14,
};

const CWON_RESULTS_TESELA_ALLYEARS_Hex = {
  id: "CWON_RESULTS_TESELA_ALLYEARS_Hex",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/cwon-teselas/CWON_RESULTS_TESELA_ALLYEARS_Hex/{z}/{x}/{y}.mvt`,
  ],
  minzoom: 0,
  maxzoom: 14,
};

const CWON_countries = {
  id: "UCSC_CWON_countrybounds",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/vectors/cwon-countries/UCSC_CWON_countrybounds/{z}/{x}/{y}.mvt`,
  ],
  minzoom: 0,
  maxzoom: 4,
};

const sources = [
  ["flooding_1996_pt", flooding_1996_pt],
  ["mangroves_2015", mangroves_2015],
  ["mangroves_1996", mangroves_1996],
  ["flooding_2015_pt", flooding_2015_pt],
  ["flooding_nomang_pt", flooding_nomang_pt],
  ["flooding_squares", flooding_squares],
  ["CWON_RESULTS_TESELA_ALLYEARS", CWON_RESULTS_TESELA_ALLYEARS],
  ["CWON_RESULTS_TESELA_ALLYEARS_RepPt", CWON_RESULTS_TESELA_ALLYEARS_RepPt],
  ["CWON_RESULTS_TESELA_ALLYEARS_Hex", CWON_RESULTS_TESELA_ALLYEARS_Hex],
  ["UCSC_CWON_countrybounds", CWON_countries],
];

export default sources;
