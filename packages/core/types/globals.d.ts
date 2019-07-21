import { IGondelPluginEventsGlobal } from "../src/GondelPluginUtils";
import { GondelComponentRegistry } from "../src/GondelComponentRegistry";
import { IEventHandlerRegistry } from "../src/GondelEventRegistry";

declare global {
  interface Window {
    "__\ud83d\udea1PluginEvents": IGondelPluginEventsGlobal,
    "__\ud83d\udea1Registries": {
      [key: string]: GondelComponentRegistry;
    },
    "__\ud83d\udea1DomEvents": {
      [eventName: string]: IEventHandlerRegistry;
    }
  }
}
