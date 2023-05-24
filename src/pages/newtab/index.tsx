import React from "react";
import { createRoot } from "react-dom/client";
import { MsgProvider, getConnection } from "@src/common/msg/MsgProvider";
import Newtab from "@pages/newtab/Newtab";
import "@pages/newtab/index.css";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/newtab");

const connection = getConnection("newtab");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  root.render(
    <MsgProvider connection={connection}>
      <Newtab />
    </MsgProvider>
  );
}

document.addEventListener("DOMContentLoaded", init);
