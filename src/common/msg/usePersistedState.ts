import { useState, useEffect, useContext, useCallback } from "react";
import { MsgContext } from "./MsgContext";

export function usePersistedState<T>(key: string, initialValue?: T) {
  const [initialState] = useState(initialValue);

  const [state, setState] = useState({
    loading: true,
    value: {
      [key]: initialState,
    },
  });
  const msgContext = useContext(MsgContext);

  const listener = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (msg: any) => {
      setState((existing) => ({
        loading: false,
        value: {
          ...existing.value,
          [key]: msg.value[key],
        },
      }));
    },
    [key]
  );

  useEffect(() => {
    msgContext.connection.onMessage.addListener(listener);
    return () => {
      msgContext.connection.onMessage.removeListener(listener);
    };
  }, [msgContext.connection.onMessage, listener]);

  const actions = {
    // @deprecated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setState: (value: any) => {
      setState((existing) => ({ ...existing, loading: true }));
      msgContext.connection.postMessage({ type: "setState", key, value });
    },
    updateState: <T>(stateKey: string, value: T) => {
      setState((existing) => ({ ...existing, loading: true }));

      msgContext.connection.postMessage({
        type: "updateState",
        key,
        value: {
          [key]: {
            ...state.value[key],
            [stateKey]: value,
          },
        },
      });
    },
  };
  const onMount = () => {
    msgContext.connection.postMessage({
      type: "initialState",
      key,
      initialState,
    });
  };
  useEffect(onMount, [key, initialState, msgContext.connection]);

  return {
    actions,
    loading: state.loading,
    value: state.value[key] as T,
  };
}
