import { startComponentsFromRegistry } from "./GondelComponentStarter";
import {
  IGondelComponent,
  GondelComponent,
  IGondelComponentWithIdentification
} from "./GondelComponent";
import { componentRegistries } from "./GondelComponentRegistry";

export type ArrayLikeHtmlElement = Element | Element[] | NodeListOf<Element> | ArrayLike<Element>;

/**
 * Returns true if the given object is a single Element
 */
function isElement(domNode: ArrayLikeHtmlElement): domNode is Element {
  return (domNode as Element).nodeType !== undefined;
}

/**
 * Inspired by the RXJS anchor approach by using symbols (if supported) or strings
 * for internal fixtures.
 *
 * @param {string=g} namespace
 * @param {string?} addition
 * @see https://github.com/ReactiveX/rxjs/blob/master/src/internal/symbol/rxSubscriber.ts
 */
export function getGondelAttribute(namespace: string = "g", addition?: string): string {
  const id = `__gondel_${addition ? addition + "_" : ""}${namespace}__`;

  if (Symbol && typeof Symbol.for === "function") {
    return (<any>Symbol.for(id)) as string;
  }

  return id;
}

/**
 * This function normalizes takes one of the following:
 *  + document query result
 *  + dom node array
 *  + jquery object
 *  + a single dom node
 * and turns it into a single dom node
 */
export function getFirstDomNode(domNode: ArrayLikeHtmlElement): HTMLElement {
  if (isElement(domNode)) {
    return domNode as HTMLElement;
  }
  return domNode[0] as HTMLElement;
}

/**
 *
 * @param gondelComponent
 * @param namespace
 */
function getComponentName(gondelComponent: IGondelComponent, namespace: string): string {
  if (!(gondelComponent as any).__identifier) {
    throw new Error("Unregistered component has no identifier (https://git.io/f4DKv)");
  }

  const identification = (gondelComponent as IGondelComponent & IGondelComponentWithIdentification)
    .__identification;

  if (!identification[namespace]) {
    throw new Error(`No component for '${namespace}' (https://git.io/f4DKf)`);
  }

  return identification[namespace];
}

/**
 * Start all nodes in the given context
 */
export function startComponents(
  domContext?: ArrayLikeHtmlElement,
  namespace: string = "g"
): Promise<Array<GondelComponent>> {
  if (!componentRegistries[namespace]) {
    return Promise.resolve([]);
  }
  const registry = componentRegistries[namespace];
  return startComponentsFromRegistry(
    registry,
    domContext ? getFirstDomNode(domContext) : document.documentElement,
    namespace
  );
}

/**
 * Stop all nodes in the given context
 */
export function stopComponents(domContext?: ArrayLikeHtmlElement, namespace: string = "g") {
  const components = findComponents(domContext, undefined, namespace);
  const rootComponent = domContext && getComponentByDomNode(domContext);
  if (rootComponent) {
    components.unshift(rootComponent as any);
  }
  components.forEach(component => component.stop!());
}

export function isComponentMounted(
  domNode: ArrayLikeHtmlElement,
  namespace: string = "g"
): boolean {
  const firstNode = getFirstDomNode(domNode);
  const gondelComponent = (firstNode as any)[getGondelAttribute(namespace)];

  return gondelComponent && gondelComponent._ctx;
}

/**
 * Returns the gondel instance for the given HtmlELement
 */
export function getComponentByDomNode<T extends GondelComponent>(
  domNode: ArrayLikeHtmlElement,
  namespace: string = "g"
): T {
  const firstNode = getFirstDomNode(domNode);
  const gondelComponent = (firstNode as any)[getGondelAttribute(namespace)];
  // Stop if this dom node is not known to gondel
  if (gondelComponent && gondelComponent._ctx) {
    return gondelComponent as T;
  }

  throw new Error(`Component not found in DOM (https://git.io/f4D44).`);
}

/**
 * Returns the gondel instance for the given HtmlELement once it is booted
 */
export function getComponentByDomNodeAsync<T extends GondelComponent>(
  domNode: ArrayLikeHtmlElement,
  namespace: string = "g"
): Promise<T> {
  const firstNode = getFirstDomNode(domNode);
  const gondelComponent = (firstNode as any)[getGondelAttribute(namespace, "async")];
  // Stop if this dom node is not known to gondel
  if (!gondelComponent) {
    return Promise.reject(undefined);
  }
  // or the component is already booted up return it
  if (gondelComponent._ctx) {
    return Promise.resolve(gondelComponent as T);
  }
  // Wait the component to boot up and return it
  return gondelComponent.then(() => (firstNode as any)[getGondelAttribute(namespace)]);
}

/**
 * Returns all components inside the given node
 */

export function findComponents(
  domNode?: ArrayLikeHtmlElement,
  component?: string,
  namespace?: string
): Array<GondelComponent>;
export function findComponents<T extends GondelComponent>(
  domNode?: ArrayLikeHtmlElement,
  component?: { new (): T },
  namespace?: string
): Array<T>;
export function findComponents<T extends GondelComponent>(
  domNode: ArrayLikeHtmlElement = document.documentElement,
  component?: { new (): T } | string,
  namespace: string = "g"
): Array<T | GondelComponent> {
  const firstNode = getFirstDomNode(domNode);
  const components: Array<T | GondelComponent> = [];
  const attribute = getGondelAttribute(namespace);
  const nodes = firstNode.querySelectorAll(
    `[data-${namespace}-name${
      component
        ? `="${
            typeof component === "string"
              ? component
              : getComponentName(component as IGondelComponent<T>, namespace)
          }"`
        : ""
    }]`
  );
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const gondelComponentInstance = (node as any)[attribute] as T & GondelComponent;
    // Verify that the component is fully booted
    if (gondelComponentInstance && gondelComponentInstance._ctx === node) {
      components.push(gondelComponentInstance);
    }
  }

  if (typeof component === "string") {
    return components as Array<GondelComponent>;
  }

  return components as Array<T & GondelComponent>;
}
