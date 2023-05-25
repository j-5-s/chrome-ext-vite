import { createContext } from "react";

export type IMsgContext = {
  connection: chrome.runtime.Port;
};

export const MsgContext = createContext<IMsgContext>({} as IMsgContext);
