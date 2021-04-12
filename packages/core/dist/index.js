// Export helpers to hook into the gondel frameworks (should only be used by plugins)
export { addGondelPluginEventListener } from './GondelPluginUtils';
// Export helpers to interact with DOM e.g. start a gondel component for a given DOM node
// or get a running gondel component instance for a given DOM node
export { getFirstDomNode, startComponents, stopComponents, hasMountedGondelComponent, getComponentByDomNode, getComponentByDomNodeAsync, findComponents, } from './GondelDomUtils';
// Export https://github.com/tc39/proposal-decorators decorators e.g. @EventListener or @Component
export * from './GondelDecorators';
// Export event helpers to send custom events to React/Angular or foreign gondel components
export * from './GondelEventEmitter';
// Export types of the Gondel Component instance
export * from './GondelComponent';
// Export a helper which allows registring components without using decorators
export { registerComponent } from './GondelComponentRegistry';
// Allow to disable the autobooting feature
export { disableAutoStart } from './GondelAutoStart';
//# sourceMappingURL=index.js.map