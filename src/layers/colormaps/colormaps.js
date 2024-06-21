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

class RasterInterpolatedSymbology {
  constructor(symbology) {
    this.breaks = symbology.breaks;
    this.colors = symbology.colors;
  }
}

export class SimpleColorScale {
  constructor(strokes, scale = 1) {
    this.strokes = strokes;
    this.scale = scale;
  }
}

const BasicStrokes = {
  width: 1.0,
  color: "white",
  opacity: 0.2,
  selected: {
    width: 10.0,
    color: "cyan",
    opacity: 0.5,
  },
};

const BasicStrokes_Thick = {
  width: 1.5,
  color: "white",
  opacity: 0.5,
  selected: {
    width: 10.0,
    color: "cyan",
    opacity: 0.5,
  },
};

const SelectedTesselaStrokes = {
  width: 0.2,
  color: "white",
  opacity: 0.5,
  selected: {
    width: 10.0,
    color: "cyan",
    opacity: 0.5,
  },
};

const MangroveStrokes = {
  width: 1,
  color: "white",
  opacity: 0.6,
  selected: {
    width: 10.0,
    color: "cyan",
    opacity: 0.5,
  },
};

const _Blue_5Step = {
  breaks: [0, 1000000, 10000000, 100000000, 1000000000],

  colorRamp: [
    "rgba(255, 255, 255, 0)",
    "#bae4bc",
    "#7bccc4",
    "#43a2ca",
    "#0868ac",
  ],

  sizeRamp: [5, 10, 15, 20, 25],

  legendScale: 3,
};

const _Blue_5Step_Pop = {
  breaks: [0, 500, 5000, 10000, 25000],

  colorRamp: [
    "rgba(255, 255, 255, 0)",
    "#bae4bc",
    "#7bccc4",
    "#43a2ca",
    "#0868ac",
  ],

  sizeRamp: [5, 10, 15, 20, 25],

  legendScale: 3,
};

const _Blue_5Step_0_1 = {
  breaks: [0, 0.2, 0.4, 0.6, 0.8],

  colorRamp: [
    "rgba(255, 255, 255, 0.35)",
    "#bae4bc",
    "#7bccc4",
    "#43a2ca",
    "#0868ac",
  ],

  sizeRamp: [5, 10, 15, 20, 25],

  legendScale: 3,
};

const _Blue_5Step_per_ha = {
  breaks: [0, 1000, 5000, 10000, 100000],

  colorRamp: [
    "rgba(255, 255, 255, 0)",
    "#bae4bc",
    "#7bccc4",
    "#43a2ca",
    "#0868ac",
  ],

  sizeRamp: [5, 10, 15, 20, 25],

  legendScale: 3,
};

const _Floodmaps_Bathy = {
  breaks: [0, 2, 4, 6, 8],

  colorRamp: [
    "rgba(255, 255, 255, 0.8)",
    "#bae4bc",
    "#7bccc4",
    "#43a2ca",
    "#0868ac",
  ],

  sizeRamp: [10, 10, 10, 10, 10],

  legendScale: 3,
};

const _Floodmaps_Bathy2 = {
  breaks: [0, 2, 4, 6, 8],

  colorRamp: [
    "rgba(255, 255, 255, 0.8)",
    "rgba(255, 255, 255, 0.8)",
    "rgba(255, 255, 255, 0.8)",
    "rgba(255, 255, 255, 0.8)",
    "rgba(255, 255, 255, 0.8)",
  ],

  sizeRamp: [10, 10, 10, 10, 10],

  legendScale: 3,
};

const _Empty = {
  breaks: [0, 1000000, 10000000, 100000000, 1000000000],

  colorRamp: [
    "rgba(255, 255, 255, 0)",
    "rgba(255, 255, 255, 0)",
    "rgba(255, 255, 255, 0)",
    "rgba(255, 255, 255, 0)",
    "rgba(255, 255, 255, 0)",
  ],

  sizeRamp: [5, 10, 15, 20, 25],

  legendScale: 3,
};

const _Green = {
  breaks: [0, 1, 2],

  colorRamp: ["#00871D", "#00871D", "#00871D"],

  sizeRamp: [5, 10, 15],

  legendScale: 3,
};

const _Red = {
  breaks: [0, 1, 2],

  colorRamp: ["#FB1414", "#FB1414", "#FB1414"],

  sizeRamp: [5, 10, 15],

  legendScale: 3,
};

const _Red_10Step_0_1 = {
  breaks: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],

  colorRamp: [
    "#FB1414",
    "#FC471C",
    "#FD7A24",
    "#FEAD2C",
    "#FFE134",
    "#E1E730",
    "#C3ED2C",
    "#A6F328",
    "#88F924",
    "#6BFF21",
  ],

  sizeRamp: [7, 7, 7, 5, 5, 5, 4, 4, 4, 3],

  legendScale: 3,
};

const _Red_10Step = {
  breaks: [0, 1000000, 10000000, 100000000, 1000000000],

  colorRamp: [
    "#FB1414",
    // "#FC471C",
    "#FD7A24",
    // "#FEAD2C",
    "#FFE134",
    // "#E1E730",
    "#C3ED2C",
    // "#A6F328",
    // "#88F924",
    "#6BFF21",
  ],

  sizeRamp: [5, 10, 15, 20, 25],

  legendScale: 3,
};

const _Red_10Step_negative1_positive1 = {
  breaks: [-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5],

  colorRamp: [
    "#FB1414",
    "#FC471C",
    "#FD7A24",
    "#FEAD2C",
    "#FFE134",
    "#FFE134",
    "#E1E730",
    "#C3ED2C",
    "#A6F328",
    "#88F924",
    "#6BFF21",
  ],

  sizeRamp: [7, 7, 7, 5, 5, 5, 5, 5, 7, 7, 7],

  legendScale: 3,
};

export const Red_10Step_0_1 = new DiscreteColorSizeScale(
  _Red_10Step_0_1,
  BasicStrokes,
);
export const Red_10Step_negative1_positive1 = new DiscreteColorSizeScale(
  _Red_10Step_negative1_positive1,
  BasicStrokes,
);
export const Red_10Step = new DiscreteColorSizeScale(_Red_10Step, BasicStrokes);

export const Empty = new DiscreteColorSizeScale(_Empty, BasicStrokes);

export const Blue_5Step_0_1 = new DiscreteColorSizeScale(
  _Blue_5Step_0_1,
  BasicStrokes,
);

export const Blue_5Step = new DiscreteColorSizeScale(_Blue_5Step, BasicStrokes);

export const Blue_5Step_per_ha = new DiscreteColorSizeScale(
  _Blue_5Step_per_ha,
  BasicStrokes,
);

export const SelectedTessela = new SimpleColorScale(SelectedTesselaStrokes);

export const Mangroves = new SimpleColorScale(MangroveStrokes);

export const FloodMaps_Bathy = new DiscreteColorSizeScale(
  _Floodmaps_Bathy,
  BasicStrokes,
);
export const Floodmaps_Bathy2 = new DiscreteColorSizeScale(
  _Floodmaps_Bathy2,
  BasicStrokes,
);

export const Blue_5Step_Pop = new DiscreteColorSizeScale(
  _Blue_5Step_Pop,
  BasicStrokes,
);

export const Green = new DiscreteColorSizeScale(_Green, BasicStrokes);
export const Red = new DiscreteColorSizeScale(_Red, BasicStrokes);
