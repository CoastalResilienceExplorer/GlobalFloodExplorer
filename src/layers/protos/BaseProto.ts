import { BaseMapboxLayerProps, LegendProps } from "types/mapboxLayerModel";

export default class BaseProto {
  constructor(props: BaseMapboxLayerProps) {
    Object.assign(this, props);
  }
}

export class ExtendedProto extends BaseProto {
  constructor(BaseProps: BaseMapboxLayerProps, StateProps: LegendProps) {
    super(BaseProps);
    // Object.assign(this, props);
  }
}
