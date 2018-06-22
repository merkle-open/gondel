import * as ReactDOM from "react-dom";
import * as React from "react";
import { startComponents } from "@gondel/core";
import { hot } from "@gondel/plugin-hot";
import { initEventPlugin } from "@gondel/plugin-events";
import App from "./app";

hot(module);
initEventPlugin();

startComponents();
ReactDOM.render(<App />, document.getElementById("root"));
