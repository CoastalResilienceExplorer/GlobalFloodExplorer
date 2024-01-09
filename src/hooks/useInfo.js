import { createContext, useContext, useReducer, useState } from "react";

export const InfoContext = createContext({});

export const useInfoContext = () => useContext(InfoContext);

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});

export function useInfo(initial_state, reducer) {
  const [state, dispatch] = useReducer(reducer, initial_state);

  function useFirst(confirmIf, event, skipIf) {
    if (
      confirmIf() &&
      (skipIf === undefined || !skipIf()) &&
      state[event].active === null
    ) {
      dispatch({
        type: event,
        active: true,
      });

      setTimeout(
        () =>
          dispatch({
            type: event,
            active: false,
          }),
        4500,
      );
    }
  }

  function useEvery(confirmIf, event, skipIf, text) {
    if (
      confirmIf() &&
      (skipIf === undefined || !skipIf()) &&
      state[event].active === null
    ) {
      dispatch({
        type: event,
        active: true,
        payload: {
          text: text,
        },
      });

      setTimeout(
        () =>
          dispatch({
            type: event,
            active: null,
            payload: {},
          }),
        4500,
      );
    }
  }

  console.log(state);

  return {
    useFirst,
    useEvery,
    activeInfo: Object.keys(state).filter((k) => state[k] && state[k].active),
    allTheThings: Object.filter(state, (s) => s.active === true),
  };
}
