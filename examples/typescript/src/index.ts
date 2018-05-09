import { startComponents } from "@gondel/core";
import { initEventPlugin } from "@gondel/plugin-events";
import { hot } from "@gondel/plugin-hot";
declare const module: any;
hot(module);
initEventPlugin();

// Load all components
const componentsContext = (require as any).context("./components", true, /\.ts$/);
componentsContext.keys().forEach(componentsContext);

startComponents();
