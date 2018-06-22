/**
 * The component registry allows to store
 * gondel components by an unique name
 */
import {
  IGondelComponent,
  GondelComponent,
  IGondelComponentWithIdentification
} from "./GondelComponent";
import { fireGondelPluginEvent } from "./GondelPluginUtils";

export class GondelComponentRegistry {
  _components: { [componentName: string]: IGondelComponent & IGondelComponentWithIdentification };
  _activeComponents: { [componentName: string]: boolean };

  constructor() {
    this._components = {};
    this._activeComponents = {};
  }

  registerComponent(
    name: string,
    gondelComponent: IGondelComponent & IGondelComponentWithIdentification
  ) {
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

export function registerComponent(
  componentName: string,
  component: IGondelComponent,
  namespace: string = "g"
) {
  // Add an identifier to the constructor
  // for mapping the class to a dom query selector
  const identifiedComponent = component as IGondelComponent & IGondelComponentWithIdentification;
  if (!identifiedComponent.hasOwnProperty("__identification")) {
    identifiedComponent.__identification = {};
  }
  identifiedComponent.__identification[namespace] = componentName;

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
      componentRegistries[namespace].registerComponent(componentName, identifiedComponent);
    }
  );
}
