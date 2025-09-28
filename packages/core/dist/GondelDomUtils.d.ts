import { GondelComponent } from './GondelComponent';
export type ArrayLikeHtmlElement = Element | Element[] | NodeListOf<Element> | ArrayLike<Element>;
export declare const internalGondelRefAttribute = "_gondel_";
export declare const internalGondelAsyncRefAttribute = "_gondelA_";
/**
 * This function normalizes takes one of the following:
 *  + document query result
 *  + dom node array
 *  + jquery object
 *  + a single dom node
 * and turns it into a single dom node
 */
export declare function getFirstDomNode(domNode: ArrayLikeHtmlElement): HTMLElement;
/**
 * Start all nodes in the given context
 */
export declare function startComponents(domContext?: ArrayLikeHtmlElement, namespace?: string): Promise<Array<GondelComponent>>;
/**
 * Stop all nodes in the given context
 */
export declare function stopComponents(domContext?: ArrayLikeHtmlElement, namespace?: string): void;
/**
 * Checks if a component is mounted on a certain DOM node
 */
export declare function hasMountedGondelComponent(domNode: ArrayLikeHtmlElement, namespace?: string): boolean;
/**
 * Returns the gondel instance for the given HtmlELement
 */
export declare function getComponentByDomNode<T extends GondelComponent>(domNode: ArrayLikeHtmlElement, namespace?: string): T;
/**
 * Internal helper function of getComponentByDomNode
 *
 * Returns the gondel instance from a known HtmlElement
 * This function is an internal helper with a possible undefined
 * return value.
 */
export declare function extractComponent<T extends GondelComponent>(element: HTMLElement, namespace: string): T | void;
/**
 * Returns the gondel instance for the given HtmlELement once it is booted
 */
export declare function getComponentByDomNodeAsync<T extends GondelComponent>(domNode: ArrayLikeHtmlElement, namespace?: string): Promise<T>;
/**
 * Returns all components inside the given node
 */
export declare function findComponents<T extends GondelComponent>(domNode?: ArrayLikeHtmlElement, componentName?: string, namespace?: string): Array<T>;
