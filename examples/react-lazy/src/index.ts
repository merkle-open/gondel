import { startComponents } from "@gondel/core";
import { hot } from "@gondel/plugin-hot";
declare const module: any;
hot(module);

// Load all components
const componentsContext = (require as any).context(
  "./components",
  true,
  /[\\\/][a-z][^\\\/]+\.tsx?$/
);
componentsContext.keys().forEach(componentsContext);

startComponents();
