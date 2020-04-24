import { GondelComponent, IGondelComponent } from "./GondelComponent";
import { GondelComponentRegistry } from "./GondelComponentRegistry";
import { addRootEventListener, removeRootEventListernerForComponent } from "./GondelEventRegistry";
// Because of how decorators work @EventListeners is executed before the class is registred
// so we need to provide a hrm compatible approch initialize and reinitialize the events
import { addGondelPluginEventListener } from "./GondelPluginUtils";
import { registerComponent } from "./index";

export function Component(componentName: string, namespace?: string) {
  return function (constructor: IGondelComponent) {
    registerComponent(componentName, namespace, constructor);
  };
}

type EventOption = [
  // EventName:
  string,
  // Handler
  string,
  // optional Selector or advanced event informations
  string | object | undefined
];

function hookEventDecoratorInCore() {
  addGondelPluginEventListener("GondelDecorators", "register", function (
    component,
    { componentName, namespace, gondelComponentRegistry },
    next
  ) {
    // Only apply in case the component is already active in the DOM
    // this will only happen during hot module replacement
    if (!gondelComponentRegistry._activeComponents[componentName]) {
      return next(component);
    }
    // The decorator will store the event information in two different places.
    // For ES6 classes it is using __events
    // For ES5 prototype classes and transpiled ES6 classes it is using prototype.__events
    const componentEventOptions: Array<EventOption> =
      (component.prototype && component.prototype.__events) || component.__events;
    if (componentEventOptions) {
      componentEventOptions.forEach((eventOptions) => {
        addRootEventListener(
          namespace,
          /* event name: */ eventOptions[0],
          componentName,
          /* handler: */ eventOptions[1],
          /* selector: */ eventOptions[2]
        );
      });
    }
    next(component);
  });
  addGondelPluginEventListener("GondelDecorators", "unregister", function (
    component,
    { componentName, namespace },
    next
  ) {
    removeRootEventListernerForComponent(namespace, componentName);
    next(component);
  });
  addGondelPluginEventListener("GondelDecorators", "start", function (
    gondelComponents,
    {
      newComponentNames,
      gondelComponentRegistry,
      namespace,
    }: {
      newComponentNames: Array<string>;
      gondelComponentRegistry: GondelComponentRegistry;
      namespace: string;
    },
    next
  ) {
    newComponentNames.forEach((componentName) => {
      const gondelComponent = gondelComponentRegistry.getComponent(componentName);
      // The decorator will store the event information in two different places.
      // For ES6 classes it is using __events
      // For ES5 prototype classes and transpiled ES6 classes it is using prototype.__events
      const componentEventOptions =
        ((gondelComponent as any).prototype && (gondelComponent as any).prototype.__events) ||
        (gondelComponent as any).__events;
      if (componentEventOptions) {
        componentEventOptions.forEach((eventOptions: EventOption) => {
          addRootEventListener(
            namespace,
            /* event name: */ eventOptions[0],
            componentName,
            /* handler: */ eventOptions[1],
            /* selector: */ eventOptions[2]
          );
        });
      }
    });
    next(gondelComponents);
  });
}

/**
 * The @EventListener decorator will add all event names to a static variable
 */
export function EventListener(eventName: string, selector?: string | object) {
  return function <T extends { __events?: Array<EventOption> } & GondelComponent>(
    target: T,
    handler: string
  ) {
    hookEventDecoratorInCore();

    if (handler.substr(0, 1) !== "_") {
      throw new Error(`Invalid handler name '${handler}' use '_${handler}' instead.`);
    }
    if (!target.__events) {
      target.__events = [];
    }
    target.__events.push([eventName, handler, selector]);
  };
}
