export default class RasterProto {
    constructor({
      id, //Unique ID
      layer,
      legend, //Symbology
      layer_title,
      floodGroup,
      layer_type,
      legend_suffix,
      display_legend = true,
    }) {
      console.log(
        id, //Unique ID
      layer,
      legend, //Symbology
      layer_title,
      floodGroup,
      layer_type,
      legend_suffix,
      )
      this.id = id;
      this.layer = layer;
      this.legend = legend;
      this.layer_title = layer_title;
      this.legend_suffix = legend_suffix;
      this.layer_type = layer_type;
      this.display_legend = display_legend && this.layer.id.includes(floodGroup)
      this.visible = this.layer.id.includes(floodGroup) ? "visible" : "none";
    }
  
    get MBLayer() {
      return Object.assign(this.layer, {
        layout: {
          visibility: this.visible,
        },
      });
    }
  
    get Legend() {
      return Object.assign(this.legend, {
        layer_title: this.layer_title,
        layer_type: this.layer_type,
        suffix: this.legend_suffix,
      });
    }
  }
  