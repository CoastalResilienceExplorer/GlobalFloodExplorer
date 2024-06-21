import { AOI, LayerName } from "types/dataModel";

export const aois: Array<AOI> = [
  {
    id: "Florida",
    overview: {
      bearing: -66,
      latitude: 27.3,
      longitude: -79.8,
      pitch: 33.2,
      zoom: 5.4,
      transitionDuration: 500,
    },
    location_awareness: {
      bbox: [
        [-78, 24],
        [-84, 32],
      ],
      marker: [-82, 30],
      minzoom: 0,
      maxzoom: 6,
    },
    parent: "Caribbean",
    size: 50,
    description:
      "Florida has one of the highest concentrations of mangrove shoreline protection in the world",
    layerGroup: LayerName.BenefitAEB,
  },
  {
    id: "Yucatan",
    overview: {
      bearing: -66,
      latitude: 20,
      longitude: -87,
      pitch: 33.2,
      zoom: 5.4,
      transitionDuration: 500,
    },
    location_awareness: {
      bbox: [
        [-90.192, 16.147],
        [-84.302, 23.288],
      ],
      marker: [-86, 20],
      minzoom: 0,
      maxzoom: 7,
    },
    parent: "Caribbean",
    size: 40,
    description:
      "Belize is protected by mangroves from over $100M of damage each year",
    layerGroup: LayerName.Population,
  },
  {
    id: "Sundarbans",
    overview: {
      latitude: 22.240289593943885,
      longitude: 91.05503181957988,
      zoom: 6.249021130949604,
      bearing: 0,
      pitch: 0,
      transitionDuration: 500,
    },
    location_awareness: {
      bbox: [
        [85.48164590729124, 24.117473070906755],
        [93.5943754849456, 19.20988763344326],
      ],
      marker: [89.732967763489, 20.233492839672707],
      minzoom: 0,
      maxzoom: 7,
    },
    size: 50,
    description: "The Sundarbans protect over 600,000 people per year",
    layerGroup: LayerName.Population,
  },
  {
    id: "Vietnam",
    overview: {
      latitude: 13.29283913627529,
      longitude: 105.824939323546,
      zoom: 5.754528743100825,
      bearing: -48.9777456517503,
      pitch: 52.5,
    },
    location_awareness: {
      marker: [112.58743143207556, 12.704472499593777],
      minzoom: 0,
      maxzoom: 7,
    },
    size: 50,
    description: "Mangroves reduce over 60% of coastal risk in Vietnam",
    layerGroup: LayerName.RiskReduction,
  },
  // {
  //   id: "Caribbean",
  //   overview: {
  //     bearing: -66,
  //     latitude: 27.3,
  //     longitude: -79.8,
  //     pitch: 33.2,
  //     zoom: 5.4,
  //     transitionDuration: 500,
  //   },
  //   location_awareness: {
  //     bbox: [
  //       [-91.19, 12.87],
  //       [-63.78, 34.47],
  //     ],
  //     marker: [-75, 25],
  //     minzoom: 0,
  //     maxzoom: 4,
  //   },
  //   size: 40,
  //   layerGroup: LayerName.BenefitAEB,
  // },
  // {
  //   "id": "Bay of Bengal",
  //   "overview": {
  //     "bearing": -66,
  //     "latitude": 13.817,
  //     "longitude": 88.291,
  //     "pitch": 33.2,
  //     "zoom": 5.4,
  //     "transitionDuration": 500
  //   },
  //   "location_awareness": {
  //     "bbox": [
  //       [75.78, 4.57],
  //       [102.36, 24.2]
  //     ],
  //     "marker": [88.291, 13.817],
  //     "minzoom": 3,
  //     "maxzoom": 11
  //   },
  //   "parent": "Indian Ocean",
  //   "size": 60
  // },
  // {
  //   "id": "South China Sea",
  //   "overview": {
  //     "bearing": -66,
  //     "latitude": 16.534,
  //     "longitude": 114.283,
  //     "pitch": 33.2,
  //     "zoom": 5.4,
  //     "transitionDuration": 500
  //   },
  //   "location_awareness": {
  //     "bbox": [
  //       [104.44, 8.64],
  //       [125.25, 24.01]
  //     ],
  //     "marker": [114.283, 16.534],
  //     "minzoom": 0,
  //     "maxzoom": 3
  //   },
  //   "size": 40
  // },
  // {
  //   "id": "Kenya and Tanzania",
  //   "overview": {
  //     "bearing": -66,
  //     "latitude": -5.684,
  //     "longitude": 42.374,
  //     "pitch": 33.2,
  //     "zoom": 5.4,
  //     "transitionDuration": 500
  //   },
  //   "location_awareness": {
  //     "bbox": [
  //       [35.19, -10.32],
  //       [48.84, -0.24]
  //     ],
  //     "marker": [42.374, -5.684],
  //     "minzoom": 3,
  //     "maxzoom": 11
  //   },
  //   "size": 30
  // },
  // {
  //   "id": "Gulf of Guinea",
  //   "overview": {
  //     "bearing": -66,
  //     "latitude": 0.114,
  //     "longitude": 1.423,
  //     "pitch": 33.2,
  //     "zoom": 5.4,
  //     "transitionDuration": 500
  //   },
  //   "location_awareness": {
  //     "bbox": [
  //       [-9.8, -6.33],
  //       [14.08, 11.32]
  //     ],
  //     "marker": [1.423, 0.114],
  //     "minzoom": 0,
  //     "maxzoom": 5
  //   },
  //   "size": 30
  // }
];
