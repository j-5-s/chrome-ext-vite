import React, { useEffect } from "react";
import logo from "@assets/img/logo.svg";
import "@pages/newtab/Newtab.css";
import "@pages/newtab/Newtab.scss";
import { usePersistedState } from "@src/common/msg/usePersistedState";

const Newtab = () => {
  const { value, actions } = usePersistedState("test", "default value");
  useEffect(() => {
    setTimeout(() => {
      actions.setState("foobar");
    }, 1000);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/newtab/Newtab.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!{value}
        </a>
        <h6>The color of this paragraph is defined using SASS.</h6>
      </header>
    </div>
  );
};

export default Newtab;
