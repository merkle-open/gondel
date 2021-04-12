/**
 * Add hot module replacement
 */
import { findComponents, addGondelPluginEventListener } from '@gondel/core';
var hotModeActivated = false;
/**
 * Make Gondel Components inside this module and all its children hot replaceable
 */
export function hot(module) {
    if (module.hot) {
        module.hot.accept();
        if (hotModeActivated) {
            return;
        }
        hotModeActivated = true;
        addGondelPluginEventListener('Hot', 'register', function (registerComponent, _a, next) {
            var componentName = _a.componentName, namespace = _a.namespace;
            findComponents(document.documentElement, undefined, namespace)
                .filter(function (oldComponent) { return oldComponent._componentName === componentName; })
                .forEach(function (oldComponent) {
                oldComponent.__proto__ = registerComponent.prototype;
            });
            next(registerComponent);
        });
    }
}
//# sourceMappingURL=index.js.map