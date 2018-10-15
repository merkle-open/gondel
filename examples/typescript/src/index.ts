// Optional hot module reloading:
import { hot } from "@gondel/plugin-hot";
declare const module: any;
hot(module);

// Load components
import "./components/button";
import "./components/form";
import "./components/input";
