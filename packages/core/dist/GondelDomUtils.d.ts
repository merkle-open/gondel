import { GondelComponent } from "./GondelComponent";
export declare type ArrayLikeHtmlElement = Element | Element[] | NodeListOf<Element> | ArrayLike<Element>;
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
 * Returns the gondel instance for the given HtmlELement
 */
export declare function getComponentByDomNode<T extends GondelComponent>(domNode: ArrayLikeHtmlElement, namespace?: string): T | undefined;
/**
 * Returns the gondel instance for the given HtmlELement once it is booted
 */
export declare function getComponentByDomNodeAsync<T extends GondelComponent>(domNode: ArrayLikeHtmlElement, namespace?: string): Promise<T>;
/**
 * Returns all components inside the given node
 */
export declare function findComponents<T extends GondelComponent>(domNode?: ArrayLikeHtmlElement, componentName?: string, namespace?: string): Array<T>;
