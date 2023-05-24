import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import { MsgProvider, getConnection } from "@src/common/msg/MsgProvider";
import Popup from "@pages/popup/Popup";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/popup");

const connection = getConnection("newtab");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  root.render(
    <MsgProvider connection={connection}>
      <Popup />
    </MsgProvider>
  );
}

init();
