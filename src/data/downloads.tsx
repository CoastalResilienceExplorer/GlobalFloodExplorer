import { ReactComponent as LinkSvg } from "assets/link-icon.svg";

export const downloads = [
  {
    description: "CWON Study Units",
    url: "https://storage.googleapis.com/cwon-data/Downloads/UCSC_CWON_studyunits.gpkg",
    icon: <LinkSvg height="1em" width="1em" />,
    download: true,
  },
  {
    description: "CWON Country Bounds",
    url: "https://storage.googleapis.com/cwon-data/Downloads/UCSC_CWON_countrybounds.gpkg",
    icon: <LinkSvg height="1em" width="1em" />,
    download: true,
  },
];

export default downloads;
