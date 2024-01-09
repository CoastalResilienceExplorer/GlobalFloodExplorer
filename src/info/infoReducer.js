export default function reducer(state, action) {
  switch (action.type) {
    case "FIRST_3D":
      return {
        ...state,
        FIRST_3D: {
          active: action.active,
          payload: action.payload,
        },
      };
    case "FIRST_SELECT":
      return {
        ...state,
        FIRST_SELECT: {
          active: action.active,
          payload: action.payload,
        },
      };
    case "FIRST_FLOODING":
      return {
        ...state,
        FIRST_FLOODING: {
          active: action.active,
          payload: action.payload,
        },
      };
    case "FIRST_FLOODING_ZOOM_IN":
      return {
        ...state,
        FIRST_FLOODING_ZOOM_IN: {
          active: action.active,
          payload: action.payload,
        },
      };
    case "FIRST_HEX":
      return {
        ...state,
        FIRST_HEX: {
          active: action.active,
          payload: action.payload,
        },
      };
    case "FIRST_HOVER":
      return {
        ...state,
        FIRST_HOVER: {
          active: action.active,
          payload: action.payload,
        },
      };
    default:
      return state;
  }
}
