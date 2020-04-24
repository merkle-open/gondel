import { GondelComponent } from "./GondelComponent";
import { getComponentRegistry } from "./GondelComponentRegistry";
import { startComponentsFromRegistry } from "./GondelComponentStarter";
export type ArrayLikeHtmlElement = Element | Element[] | NodeListOf<Element> | ArrayLike<Element>;

export const internalGondelRefAttribute = "_gondel_";
export const internalGondelAsyncRefAttribute = "_gondelA_";

/**
 * Returns true if the given object is a single Element
 */
function isElement(domNode: ArrayLikeHtmlElement): domNode is Element {
  return (domNode as Element).nodeType !== undefined;
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
 * Start all nodes in the given context
 */
export function startComponents(
  domContext?: ArrayLikeHtmlElement,
  namespace: string = "g"
): Promise<Array<GondelComponent>> {
  const registry = getComponentRegistry(namespace);
  return startComponentsFromRegistry(
    registry,
    domContext ? getFirstDomNode(domContext) : document.documentElement!,
    namespace
  );
}

/**
 * Stop all nodes in the given context
 */
export function stopComponents(domContext?: ArrayLikeHtmlElement, namespace: string = "g") {
  const components = findComponents(domContext, undefined, namespace);
  if (domContext && hasMountedGondelComponent(domContext)) {
    components.unshift(getComponentByDomNode(domContext));
  }
  components.forEach((component) => component.stop!());
}

/**
 * Checks if a component is mounted on a certain DOM node
 */
export function hasMountedGondelComponent(
  domNode: ArrayLikeHtmlElement,
  namespace: string = "g"
): boolean {
  const firstNode = getFirstDomNode(domNode);
  const gondelComponent = (firstNode as any)[internalGondelRefAttribute + namespace];

  if (!gondelComponent || !gondelComponent._ctx) {
    // no anchor prop found or ctx missing. function is needed
    // that we can type the `getComponentByDomNode` without possible
    // returnal of undefined.
    return false;
  }

  return true;
}

/**
 * Returns the gondel instance for the given HtmlELement
 */
export function getComponentByDomNode<T extends GondelComponent>(
  domNode: ArrayLikeHtmlElement,
  namespace: string = "g"
): T {
  const gondelComponent = extractComponent<T>(getFirstDomNode(domNode), namespace);
  if (!gondelComponent) {
    throw new Error(
      `Could not find a started gondel component in namespace "${namespace}",
please check if your component is mounted via 'hasMountedGondelComponent'`
    );
  }
  return gondelComponent;
}

/**
 * Internal helper function of getComponentByDomNode
 *
 * Returns the gondel instance from a known HtmlElement
 * This function is an internal helper with a possible undefined
 * return value.
 */
export function extractComponent<T extends GondelComponent>(
  element: HTMLElement,
  namespace: string
): T | void {
  const gondelComponent = (element as any)[internalGondelRefAttribute + namespace];
  // Stop if this dom node is not known to gondel
  if (gondelComponent && gondelComponent._ctx) {
    return gondelComponent as T;
  }
}

/**
 * Returns the gondel instance for the given HtmlELement once it is booted
 */
export function getComponentByDomNodeAsync<T extends GondelComponent>(
  domNode: ArrayLikeHtmlElement,
  namespace: string = "g"
): Promise<T> {
  const firstNode = getFirstDomNode(domNode);
  const gondelComponent = (firstNode as any)[internalGondelAsyncRefAttribute + namespace];
  // Stop if this dom node is not known to gondel
  if (!gondelComponent) {
    return Promise.reject(undefined);
  }
  // or the component is already booted up return it
  if (gondelComponent._ctx) {
    return Promise.resolve(gondelComponent as T);
  }
  // Wait the component to boot up and return it
  return gondelComponent.then(() => (firstNode as any)[internalGondelRefAttribute + namespace]);
}

/**
 * Returns all components inside the given node
 */
export function findComponents<T extends GondelComponent>(
  domNode: ArrayLikeHtmlElement = document.documentElement!,
  componentName?: string,
  namespace: string = "g"
): Array<T> {
  const firstNode = getFirstDomNode(domNode);
  const components: Array<T> = [];
  const attribute = `_gondel_${namespace}`;
  const nodes = firstNode.querySelectorAll(
    `[data-${namespace}-name${componentName ? `="${componentName}"` : ""}]`
  );
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const gondelComponentInstance = (node as any)[attribute] as T;
    // Verify that the component is fully booted
    if (gondelComponentInstance && gondelComponentInstance._ctx === node) {
      components.push(gondelComponentInstance);
    }
  }
  return components;
}
