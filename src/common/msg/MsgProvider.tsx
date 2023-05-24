import React from "react";
import { MsgContext } from "./MsgContext";

type IMessageProvider = {
  connection: chrome.runtime.Port;
  children: React.ReactNode;
};
export const getConnection = (
  portName: string
  // tabId: number
): chrome.runtime.Port => {
  const connection = chrome.runtime.connect({ name: `${portName}` });
  // connection.postMessage({ type: 'tabInit', tabId });

  return connection;
};

export const MsgProvider = (props: IMessageProvider) => {
  const { children, connection } = props;

  const context = {
    connection,
  };

  return <MsgContext.Provider value={context}>{children}</MsgContext.Provider>;
};
