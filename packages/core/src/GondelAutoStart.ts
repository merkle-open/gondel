import { getComponentRegistry, RegistryBootMode } from "./GondelComponentRegistry";
import { startComponentsFromRegistry } from "./GondelComponentStarter";

/**
 * By default Gondel will run startComponents on DOMContentLoaded
 * To gain more controll over the boot behaviour tihs function can be called
 * to disable the auto start
 */
export function disableAutoStart(namespace: string = "g") {
  getComponentRegistry(namespace).setBootMode(RegistryBootMode.manual);
}

/**
 * Wait for document ready and boot the registry
 */
export function addRegistryToBootloader(namespace: string) {
  // Use new Promise to wait for the next tick
  const boot = () => {
    Promise.resolve().then(() => {
      const gondelComponentRegistry = getComponentRegistry(namespace);
      if (gondelComponentRegistry._bootMode === RegistryBootMode.onDomReady) {
        gondelComponentRegistry.setBootMode(RegistryBootMode.alreadyBooted);
        startComponentsFromRegistry(gondelComponentRegistry, document.documentElement, namespace);
      }
    });
  };
  // Boot if document is complete or once it completes
  if (document.readyState == "complete") {
    boot();
  } else {
    document.addEventListener("DOMContentLoaded", boot, false);
  }
}
