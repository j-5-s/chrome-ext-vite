import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { Logger } from "@src/common/logger/logger";
import { ChromeStorageLocal } from "./store";
const foo = import.meta.env;
console.log(foo);
const konsole = Logger.getInstance();
reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

const ports = new Map();
const store = new ChromeStorageLocal("state");
console.log("background loadedddd");

const publish = (msg) => {
  konsole.log("publish", msg);
  ports.forEach((port) => {
    port.postMessage(msg);
  });
};

chrome.runtime.onConnect.addListener(function (port) {
  konsole.log("onConnect", port);
  if (port.sender?.tab?.id) {
    ports.set(port.sender?.tab?.id, port);
  } else {
    ports.set(port.name, port);
  }

  port.onDisconnect.addListener(function (port) {
    konsole.log("onDisconnect", port);
    if (port.sender?.tab?.id) {
      ports.delete(port.sender?.tab?.id);
    } else {
      ports.delete(port.name);
    }
  });

  port.onMessage.addListener(function (msg) {
    konsole.log("onMessage", msg);
    if (msg.type === "initialState") {
      store.getState().then((state: any) => {
        konsole.log("initialState", msg.initialState, state);
        publish({
          type: msg.type,
          value: {
            [msg.key]:
              typeof msg.initialState === "object"
                ? { ...msg.initialState }
                : msg.initialState,
            ...state,
          },
          key: msg.key,
          ack: true,
        });
      });
    }
    if (msg.type === "updateState") {
      store
        .updateState(msg.key, msg.value[msg.key])
        .then(({ state }: { state: any }) => {
          publish({
            type: msg.type,
            value: {
              ...state,
            },
            key: msg.key,
            ack: true,
          });
        });
    }
    if (msg.type === "setState") {
      store
        .updateState(msg.key, msg.value)
        .then(({ state }: { state: any }) => {
          publish({
            type: msg.type,
            value: {
              ...state,
            },
            key: msg.key,
            ack: true,
          });
        });
    }
  });
});
