export default function reducer(state, action) {
  switch (action.type) {
    case "FIRST_3D":
      return {
        ...state,
        FIRST_3D: action.payload,
      };
    case "FIRST_SELECT":
      return {
        ...state,
        FIRST_SELECT: action.payload,
      };
    case "FIRST_FLOODING":
      return {
        ...state,
        FIRST_FLOODING: action.payload,
      };
    case "FIRST_FLOODING_ZOOM_IN":
      return {
        ...state,
        FIRST_FLOODING_ZOOM_IN: action.payload,
      };
    case "FIRST_HEX":
      return {
        ...state,
        FIRST_HEX: action.payload,
      };
    default:
      return state;
  }
}
