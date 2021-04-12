import { getComponentRegistry } from './GondelComponentRegistry';
import { startComponentsFromRegistry } from './GondelComponentStarter';
/**
 * By default Gondel will run startComponents on DOMContentLoaded
 * To gain more controll over the boot behaviour tihs function can be called
 * to disable the auto start
 */
export function disableAutoStart(namespace) {
    if (namespace === void 0) { namespace = 'g'; }
    getComponentRegistry(namespace).setBootMode(1 /* manual */);
}
/**
 * Wait for document ready and boot the registry
 */
export function addRegistryToBootloader(namespace) {
    // Use new Promise to wait for the next tick
    var boot = function () {
        Promise.resolve().then(function () {
            var gondelComponentRegistry = getComponentRegistry(namespace);
            if (gondelComponentRegistry._bootMode === 2 /* onDomReady */) {
                gondelComponentRegistry.setBootMode(0 /* alreadyBooted */);
                startComponentsFromRegistry(gondelComponentRegistry, document.documentElement, namespace);
            }
        });
    };
    // Boot if document is complete or once it completes
    if (document.readyState == 'complete') {
        boot();
    }
    else {
        document.addEventListener('DOMContentLoaded', boot, false);
    }
}
//# sourceMappingURL=GondelAutoStart.js.map