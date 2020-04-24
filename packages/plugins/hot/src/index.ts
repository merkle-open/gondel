/**
 * Add hot module replacement
 */

import {
  GondelComponent,
  IGondelComponent,
  findComponents,
  addGondelPluginEventListener,
} from "@gondel/core";

let hotModeActivated = false;

export function hot(module: __WebpackModuleApi.Module) {
  if (module.hot) {
    module.hot.accept();
    if (hotModeActivated) {
      return;
    }
    hotModeActivated = true;
    addGondelPluginEventListener("Hot", "register", function (
      registerComponent,
      { componentName, namespace },
      next
    ) {
      findComponents(document.documentElement, undefined, namespace)
        .filter((oldComponent) => oldComponent._componentName === componentName)
        .forEach((oldComponent) => {
          (oldComponent as any).__proto__ = registerComponent.prototype;
        });
      next(registerComponent);
    });
  }
}
