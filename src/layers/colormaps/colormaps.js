/*
AEB:
- Degradation
- Restoration
- PostStorm

Hex:
- Degradation
- Restoration
- PostStorm

Floodmasks:
- Degradation
- Restoration
- PostStorm
*/

import { FILTER } from "layers/layers";

class MapboxPaintManager {
  constructMapboxExpression(array) {
    return [array[0]].concat(
      this.breaks.slice(1).map((x, i) => [x, array[i + 1]]),
    );
  }
}

export class DiscreteColorSizeScale extends MapboxPaintManager {
  constructor(info, strokes, scale = 1) {
    super();
    this.breaks = info.breaks;
    this.colorRamp = info.colorRamp;
    this.sizeRamp = info.sizeRamp;
    this.colorHeader = this.colorHeader;
    this.legendSize = 100;
    this.strokes = strokes;
    this.scale = scale;
  }

  get SizeRamp() {
    return this.constructMapboxExpression(this.sizeRamp);
  }

  get ColorRamp() {
    return this.constructMapboxExpression(this.colorRamp);
  }

  get Filter() {
    return this.breaks[0];
  }

  colorHeader(colorValue) {
    return ["step", colorValue];
  }

  get joinedColorSize() {
    return this.colorRamp.map((c, i) => {
      return {
        color: c,
        size: this.sizeRamp[i],
        value: this.breaks[i],
      };
    });
  }

  get Scale() {
    return this.scale;
  }
}

export class SimpleColorScale {
  constructor(strokes, scale = 1) {
    this.strokes = strokes;
    this.scale = scale;
  }
}

const BasicStrokes = {
  width: 0.2,
  color: "white",
  opacity: 1.0,
  selected: {
    width: 8.0,
    color: "cyan",
    opacity: 0.7,
  },
};

const SelectedTesselaStrokes = {
  width: 1.0,
  color: "#000000",
  opacity: 0.0,
  selected: {
    width: 8.0,
    color: "cyan",
    opacity: 0.7,
  },
};

const _Blue_5Step = {
  breaks: [1, 100000, 1000000, 10000000, 100000000, 1000000000],

  colorRamp: [
    "rgba(202, 240, 248, 0.5)",
    "#caf0f8",
    "#90e0ef",
    "#00b4d8",
    "#0077b6",
    "#03045e",
  ],

  sizeRamp: [1.6, 5, 10, 15, 20, 25],

  legendScale: 3,
};

const _Blue_5Step_Pop = {
  breaks: [15, 500, 1000, 10000, 20000],

  colorRamp: ["#caf0f8", "#90e0ef", "#00b4d8", "#0077b6", "#03045e"],

  sizeRamp: [5, 10, 15, 20, 25],

  legendScale: 3,
};

const _Red_5Step_ExistingRisk = {
  breaks: [1, 10000, 100000, 1000000, 10000000, 100000000],

  colorRamp: [
    "rgba(255, 255, 178, 1)",
    "rgba(254, 204, 92, 1)",
    "rgba(254, 170, 75, 1)",
    "rgba(253, 141, 60, 1)",
    "rgba(240, 59, 32, 1)",
    "rgba(189, 0, 38, 1)",
  ],

  sizeRamp: [2, 3, 6, 8, 15, 22],

  legendScale: 3,
};

const _Blue_5Step_0_1 = {
  breaks: [0, 0.2, 0.4, 0.6, 0.8],

  colorRamp: ["#caf0f8", "#90e0ef", "#00b4d8", "#0077b6", "#03045e"],

  sizeRamp: [5, 10, 15, 20, 25],

  legendScale: 3,
};

const _Floodmaps = {
  breaks: [0, 1.5, 3],

  colorRamp: [
    "rgba(255, 255, 0, 1)",
    "rgba(255, 200, 0, 1)",
    "rgba(255, 0, 0, 1)",
  ],

  sizeRamp: [10, 10, 10],

  legendScale: 3,
};

const _Green = {
  breaks: [0, 1, 2],

  colorRamp: ["#00871D", "#00871D", "#00871D"],

  sizeRamp: [5, 10, 15],

  legendScale: 3,
};

const _Grey = {
  breaks: [0, 1, 2],

  colorRamp: ["#B0B0B0", "#B0B0B0", "#B0B0B0"],

  sizeRamp: [5, 10, 15],

  legendScale: 3,
};

const _Red = {
  breaks: [0, 1.5, 3],

  colorRamp: ["#FB1414", "#FB1414", "#FB1414"],

  sizeRamp: [5, 10, 15],

  legendScale: 3,
};

export const Blue_5Step_0_1 = new DiscreteColorSizeScale(
  _Blue_5Step_0_1,
  BasicStrokes,
);

export const Blue_5Step = new DiscreteColorSizeScale(_Blue_5Step, BasicStrokes);

export const SelectedTessela = new SimpleColorScale(SelectedTesselaStrokes);

export const FloodMaps_Bathy = new DiscreteColorSizeScale(
  _Floodmaps,
  BasicStrokes,
);

export const Blue_5Step_Pop = new DiscreteColorSizeScale(
  _Blue_5Step_Pop,
  BasicStrokes,
);

export const Green = new DiscreteColorSizeScale(_Green, BasicStrokes);
export const Grey = new DiscreteColorSizeScale(_Grey, BasicStrokes);

export const Red_5Step = new DiscreteColorSizeScale(
  _Red_5Step_ExistingRisk,
  BasicStrokes,
);
