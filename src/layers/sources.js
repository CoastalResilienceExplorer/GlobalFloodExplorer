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
  tiles: [`${PMSERVER_URL}/CWON_reindexed/CWON_Tr50_reindexed/{z}/{x}/{y}.mvt`],
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

const CWON_tesela_reppts = {
  id: "UCSC_CWON_studyunits_reppts",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/vectors/cwon-teselas/UCSC_CWON_studyunits_reppts/{z}/{x}/{y}.mvt`,
  ],
  minzoom: 0,
  maxzoom: 14,
};

const CWON_tesela_bounds = {
  id: "UCSC_CWON_studyunits",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/vectors/cwon-teselas/UCSC_CWON_studyunits/{z}/{x}/{y}.mvt`,
  ],
  minzoom: 0,
  maxzoom: 14,
};

const CWON_tesela_hexs = {
  id: "UCSC_CWON_studyunits_hexs",
  type: "vector",
  format: "mvt",
  tiles: [
    `${PMSERVER_URL}/vectors/cwon-teselas/UCSC_CWON_studyunits_hexs/{z}/{x}/{y}.mvt`,
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
  ["UCSC_CWON_studyunits", CWON_tesela_bounds],
  ["UCSC_CWON_studyunits_reppts", CWON_tesela_reppts],
  ["UCSC_CWON_studyunits_hexs", CWON_tesela_hexs],
  ["UCSC_CWON_countrybounds", CWON_countries],
];

export default sources;
