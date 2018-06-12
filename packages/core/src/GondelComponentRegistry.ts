/**
 * The component registry allows to store
 * gondel components by an unique name
 */
import { IGondelComponent, GondelComponent } from "./GondelComponent";
import { fireGondelPluginEvent } from "./GondelPluginUtils";

export class GondelComponentRegistry {
  _components: { [componentName: string]: IGondelComponent };
  _activeComponents: { [componentName: string]: boolean };

  constructor() {
    this._components = {};
    this._activeComponents = {};
  }

  registerComponent(name: string, gondelComponent: IGondelComponent) {
    this._components[name] = gondelComponent;
  }

  unregisterComponent(name: string) {
    delete this._components[name];
  }

  getComponent(name: string) {
    return this._components[name];
  }

  /**
   * Set if a component is used
   */
  setActiveState(name: string, isActive: boolean) {
    this._activeComponents[name] = isActive;
  }
}

export const componentRegistries: {
  [key: string]: GondelComponentRegistry;
} = ((window as any).__gondelRegistries = (window as any).__gondelRegistries || {});

export function registerComponent(component: IGondelComponent, namespace: string = "g") {
  const componentName = component.componentName;

  if (!componentRegistries[namespace]) {
    componentRegistries[namespace] = new GondelComponentRegistry();
  }

  // If this component was already registered we remove the previous one
  // and notify all plugins - this is especially usefull for hot component replacement
  if (componentRegistries[namespace].getComponent(componentName)) {
    fireGondelPluginEvent("unregister", component, { componentName, namespace });
  }

  // Let plugins know about the new component
  fireGondelPluginEvent(
    "register",
    component,
    {
      componentName,
      namespace,
      gondelComponentRegistry: componentRegistries[namespace]
    },
    function(component) {
      componentRegistries[namespace].registerComponent(componentName, component);
    }
  );
}
