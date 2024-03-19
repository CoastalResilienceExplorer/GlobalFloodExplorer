import { ReactComponent as LinkSvg } from "assets/link-icon.svg";

export const downloads = [
  {
    description: "Data summarized by country",
    url: "https://storage.googleapis.com/cwon-data/Downloads/UCSC_CWON_countrybounds.gpkg",
    icon: <LinkSvg height="1em" width="1em" />,
    download: true,
  },
  {
    description: "Data summarized by coastal study units (~20km)",
    url: "https://storage.googleapis.com/cwon-data/Downloads/UCSC_CWON_studyunits.gpkg",
    icon: <LinkSvg height="1em" width="1em" />,
    download: true,
  },
];

export default downloads;
