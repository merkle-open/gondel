// Optional hot module reloading:
import { hot } from "@gondel/plugin-hot";
declare const module: any;
hot(module);

// Load components
import "./components/form";
import "./components/button";
import "./components/input";
