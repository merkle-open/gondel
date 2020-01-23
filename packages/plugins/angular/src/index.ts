// main component angular connection implementation
export { GondelAngularComponent } from "./GondelAngularComponent";

// required to be able to inject initial state and component ref
export { createStateProvider, createGondelComponentProvider } from "./providers";

// could be used to preload the angular dependencies
export { loadAngularInternals } from "./angularInternalsLoader";
