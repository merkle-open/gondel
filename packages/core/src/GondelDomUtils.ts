import { startComponentsFromRegistry } from "./GondelComponentStarter";
import { GondelComponent } from "./GondelComponent";
import { componentRegistries } from "./GondelComponentRegistry";
export type ArrayLikeHtmlElement = Element | Element[] | NodeListOf<Element> | ArrayLike<Element>;

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
    components.unshift(rootComponent);
  }
  components.forEach(component => component.stop!());
}

/**
 * Returns the gondel instance for the given HtmlELement
 */
export function getComponentByDomNode(
  domNode: ArrayLikeHtmlElement,
  namespace: string = "g"
): GondelComponent | undefined {
  const firstNode = getFirstDomNode(domNode);
  const gondelComponent = (firstNode as any)[`_gondel_${namespace}`];
  // Stop if this dom node is not known to gondel
  if (gondelComponent && gondelComponent._ctx) {
    return gondelComponent as GondelComponent;
  }
  return;
}

/**
 * Returns the gondel instance for the given HtmlELement once it is booted
 */
export function getComponentByDomNodeAsync(
  domNode: ArrayLikeHtmlElement,
  namespace: string = "g"
): Promise<GondelComponent> {
  const firstNode = getFirstDomNode(domNode);
  const gondelComponent = (firstNode as any)[`_gondelA_${namespace}`];
  // Stop if this dom node is not known to gondel
  if (!gondelComponent) {
    return Promise.reject(undefined);
  }
  // or the component is already booted up return it
  if (gondelComponent._ctx) {
    return Promise.resolve(gondelComponent as GondelComponent);
  }
  // Wait the component to boot up and return it
  return gondelComponent.then(() => (firstNode as any)[`_gondel_${namespace}`]);
}

/**
 * Returns all components inside the given node
 */
export function findComponents(
  domNode: ArrayLikeHtmlElement = document.documentElement,
  componentName?: string,
  namespace: string = "g"
): Array<GondelComponent> {
  const firstNode = getFirstDomNode(domNode);
  const components: Array<GondelComponent> = [];
  const attribute = `_gondel_${namespace}`;
  const nodes = firstNode.querySelectorAll(
    `[data-${namespace}-name${componentName ? `="${componentName}"` : ""}]`
  );
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const gondelComponentInstance = (node as any)[attribute] as GondelComponent;
    // Verify that the component is fully booted
    if (gondelComponentInstance && gondelComponentInstance._ctx === node) {
      components.push(gondelComponentInstance);
    }
  }
  return components;
}
