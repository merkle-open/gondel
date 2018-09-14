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

let _componentRegistries: {
  [key: string]: GondelComponentRegistry;
};
export function getComponentRegistry(namespace: string) {
  if (!_componentRegistries) {
    _componentRegistries = (window as any)["__\ud83d\udea1Registries"] || {};
    (window as any)["__\ud83d\udea1Registries"] = _componentRegistries;
  }
  if (!_componentRegistries[namespace]) {
    _componentRegistries[namespace] = new GondelComponentRegistry();
  }
  return _componentRegistries[namespace];
}

export function registerComponent(componentName: string, component: IGondelComponent): void;
export function registerComponent(
  componentName: string,
  namespace: string | undefined,
  component: IGondelComponent
): void;
export function registerComponent() {
  const args = arguments;
  // The componentName is always the first argument
  const componentName = args[0] as string;
  // Use namespace from the second argument or fallback to the default "g" if it is missing
  const namespace: string = typeof args[1] === "string" ? args[1] : "g";
  // The last argument is always the component class
  let component = args[args.length - 1] as IGondelComponent;
  const gondelComponentRegistry = getComponentRegistry(namespace);
  // If this component was already registered we remove the previous one
  // and notify all plugins - this is especially usefull for hot component replacement
  if (gondelComponentRegistry.getComponent(componentName)) {
    fireGondelPluginEvent("unregister", component, { componentName, namespace });
  }
  // Let plugins know about the new component
  fireGondelPluginEvent(
    "register",
    component,
    {
      componentName,
      namespace,
      gondelComponentRegistry
    },
    function(component) {
      gondelComponentRegistry.registerComponent(componentName, component);
    }
  );
}
