export default class SimpleOutlineProto {
  constructor({
    id, //Unique ID
    source_layer,
    source, //Source to Load
    legend, //Symbology
    layer_title,
    display_legend = false,
    filter = [],
    minzoom = 0,
    maxzoom = 16,
  }) {
    this.id = id;
    this.source = source;
    this.source_layer = source_layer;
    this.legend = legend;
    this.strokes = legend.strokes;
    this.layer_title = layer_title;
    this.display_legend = display_legend;
    this.filter = filter;
    this.minzoom = minzoom;
    this.maxzoom = maxzoom;
  }

  get MBLayer() {
    const layer_proto = {
      id: this.id,
      key: this.id,
      type: "line",
      "source-layer": this.source_layer,
      source: this.source,
      paint: {
        // Color
        "line-color": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          this.strokes.selected.color,
          this.strokes.color,
        ],
        // Size
        "line-width": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          this.strokes.selected.width,
          this.strokes.width,
        ],
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          this.strokes.selected.opacity,
          this.strokes.opacity,
        ],
      },
      minzoom: this.minzoom,
      maxzoom: this.maxzoom,
      filter: this.filter,
    };

    return layer_proto;
  }

  get Legend() {
    return Object.assign(this.legend, { layer_title: this.layer_title });
  }
}
