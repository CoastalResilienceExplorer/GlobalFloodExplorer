import {
  createContext,
  useContext,
  useReducer,
  useState,
  useRef,
  useMemo,
} from "react";

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

  function useEventWithFunction(confirmIf, event, skipIf, f) {
    /*
      This can theoretically work with an EVERY hook,
      but is difficult to implement due to race conditions in the dispatch.

      For now, just implementing as a FIRST event.
    */
    if (
      confirmIf() &&
      (skipIf === undefined || !skipIf()) &&
      state[event].active === null
    ) {
      f() &&
        dispatch({
          type: event,
          active: false,
        });
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

  function useWhile_On(f, deps, event, skipIf, text, timeout = 3000) {
    useMemo(() => {
      if (
        f() &&
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
        if (timeout > 0) {
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
    }, deps);
  }

  function useWhile_Off(f, deps, event, skipIf, delay = 0) {
    useMemo(() => {
      if (
        f() &&
        (skipIf === undefined || !skipIf()) &&
        state[event].active === true
      ) {
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
    }, deps);
  }

  return {
    useFirst,
    useEventWithFunction,
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
