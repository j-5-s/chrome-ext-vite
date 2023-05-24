import { useState, useEffect, useContext, useCallback } from "react";
import { MsgContext } from "./MsgContext";

export function usePersistedState<T>(key: string, initialValue?: T) {
  const [initialState] = useState(initialValue);

  const [state, setState] = useState({
    loading: true,
    key,
    initialValue,
    value: initialValue,
  });
  const msgContext = useContext(MsgContext);

  const listener = useCallback(
    (msg: any) => {
      if (msg.type !== "setState" && key !== msg.key) return;

      setState((existing) => ({
        ...existing,
        loading: false,
        value: msg.value,
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
    setState: (value: any) => {
      setState((existing) => ({ ...existing, loading: true }));
      msgContext.connection.postMessage({ type: "setState", key, value });
    },
    updateState: <T>(stateKey: string, value: T) => {
      setState((existing) => ({ ...existing, loading: true }));
      const valueState = {
        ...state.value,
        [stateKey]: value,
      };
      msgContext.connection.postMessage({
        type: "setState",
        key,
        value: valueState,
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
    value: state.value as T,
  };
}
