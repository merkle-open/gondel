import { startComponents } from "@gondel/core";
import { hot } from "@gondel/plugin-hot";

import "./components/gondel-react";
import "./components/App";

declare const module: any;
hot(module);

startComponents();
