import { createContext, useContext, useReducer, useState, useRef } from "react";

export const InfoContext = createContext({});

export const useInfoContext = () => useContext(InfoContext);

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});

export function useInfo(initial_state, reducer) {
  const [state, dispatch] = useReducer(reducer, initial_state);
  const selectRef = useRef();
  const floodingRef = useRef();
  const compassRef = useRef();
  const centerRef = useRef();
  const lowerMiddleRef = useRef();

  const refs = {
    COMPASS: compassRef,
    SELECT: selectRef,
    FLOOD: floodingRef,
    FLOOD_ZOOM: centerRef,
    CENTER: centerRef,
    LOWER_MIDDLE: lowerMiddleRef,
  };

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

  function useEvery(confirmIf, event, skipIf, text, timeout = 1000) {
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
        timeout,
      );
    }
  }

  function useWhile_On(f, event, skipIf, text, timeout = 3000) {
    if (
      f() &&
      (skipIf === undefined || !skipIf()) &&
      state[event].active === null
    ) {
      console.log("on if");
      dispatch({
        type: event,
        active: true,
        payload: {
          text: text,
        },
      });
      if (timeout > 0) {
        console.log(timeout);
        setTimeout(
          () =>
            dispatch({
              type: event,
              active: null,
              payload: {
                text: text,
              },
            }),
          timeout,
        );
      }
    }
  }

  function useWhile_Off(f, event, skipIf, delay) {
    if (
      f() &&
      (skipIf === undefined || !skipIf()) &&
      state[event].active === true
    ) {
      console.log("off if");
      console.log(delay);
      setTimeout(
        () =>
          dispatch({
            type: event,
            active: null,
            payload: {
              text: null,
            },
          }),
        delay,
      );
    }
  }

  return {
    useFirst,
    useEvery,
    useWhile: {
      on: useWhile_On,
      off: useWhile_Off,
    },
    activeInfo: Object.keys(state).filter((k) => state[k] && state[k].active),
    allTheThings: Object.filter(state, (s) => s.active === true),
    infoRefs: refs,
  };
}
