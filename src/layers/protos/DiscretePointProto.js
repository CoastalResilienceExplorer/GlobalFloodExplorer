import { FILTER_VALUE } from "layers/layers";

export default class DiscretePointProto {
  constructor({
    id, //Unique ID
    source_layer,
    source, //Source to Load
    colorValue, //Field used to drive symbology
    legend, //Symbology
    format,
    layer_title,
    layer_type,
    display_legend = true,
    filter = null,
    legend_prefix = null,
    legend_suffix = null,
    minzoom = 0,
  }) {
    this.id = id;
    this.source = source;
    this.source_layer = source_layer;
    this.colorValue = colorValue;
    this.legend = legend;
    this.legend_prefix = legend_prefix;
    this.legend_suffix = legend_suffix;
    this.strokes = legend.strokes;
    this.layer_title = layer_title;
    this.layer_type = layer_type;
    this.color_header = legend.colorHeader(colorValue);
    this.display_legend = display_legend;
    this.filter = filter;
    this.format = format;
    this.minzoom = minzoom;
  }

  get MBLayer() {
    const filter_header = ["case", ["<", this.colorValue, FILTER_VALUE], 0.0];
    const layer_proto = {
      id: this.id,
      key: this.id,
      type: "circle",
      "source-layer": this.source_layer,
      source: this.source,
      paint: {
        // Color
        "circle-color": [].concat(this.color_header, ...this.legend.ColorRamp),
        // Size
        "circle-radius": [
          ...filter_header,
          [].concat(this.color_header, ...this.legend.SizeRamp),
        ],
        // Strokes
        "circle-stroke-color": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          this.strokes.selected.color,
          ["boolean", ["feature-state", "hovered"], false],
          this.strokes.hovered.color,
          this.strokes.color,
        ],
        "circle-stroke-width": [
          ...filter_header,
          [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            this.strokes.selected.width,
            ["boolean", ["feature-state", "hovered"], false],
            this.strokes.hovered.opacity,
            this.strokes.opacity,          
          ],
        ],
        "circle-stroke-opacity": [
          ...filter_header,
          [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            this.strokes.selected.opacity,
            ["boolean", ["feature-state", "hovered"], false],
            this.strokes.hovered.opacity,
            this.strokes.opacity,
          ],
        ],
      },
      layout: {
        "circle-sort-key": ["*", -1, this.colorValue],
      },
      minzoom: this.minzoom,
      maxzoom: 16,
    };

    if (this.filter !== null) {
      layer_proto.filter = this.filter;
    }

    return layer_proto;
  }

  get Legend() {
    return Object.assign(this.legend, {
      layer_title: this.layer_title,
      prefix: this.legend_prefix,
      suffix: this.legend_suffix,
      format: this.format,
      layer_type: this.layer_type,
    });
  }
}
