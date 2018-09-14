import { GondelComponent } from "./GondelComponent";
import { GondelComponentRegistry } from "./GondelComponentRegistry";
/**
 * Start all components of the gondel component registry
 * for the given dom context
 */
export declare function startComponentsFromRegistry(gondelComponentRegistry: GondelComponentRegistry, domContext: HTMLElement, namespace: string): Promise<Array<GondelComponent>>;
/**
 * Returns true if the given domNode is neither booting nor booted
 */
export declare function isPristineGondelDomNode(domNode: HTMLElement, namespace: string): boolean;
/**
 * Mark the given dom node as controlled by gondel
 */
export declare function attachGondelBootingFlag(domNode: HTMLElement, bootingFlag: Promise<any>, namespace: string): void;
/**
 * Constructs a new component
 */
export declare function constructComponent(domNode: HTMLElement, gondelComponentRegistry: GondelComponentRegistry, namespace: string): GondelComponent;
/**
 * Start a component after it was constructed
 */
export declare function startConstructedComponent(component: GondelComponent): Promise<any> | void;
/**
 * Stops a started component
 */
export declare function stopStartedComponent(component: GondelComponent, internalStopMethod: () => void, namespace: string): void;
