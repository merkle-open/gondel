/**
 * The component registry allows to store
 * gondel components by an unique name
 */
import { IGondelComponent } from "./GondelComponent";
export declare class GondelComponentRegistry {
    _components: {
        [componentName: string]: IGondelComponent;
    };
    _activeComponents: {
        [componentName: string]: boolean;
    };
    constructor();
    registerComponent(name: string, gondelComponent: IGondelComponent): void;
    unregisterComponent(name: string): void;
    getComponent(name: string): IGondelComponent;
    /**
     * Set if a component is used
     */
    setActiveState(name: string, isActive: boolean): void;
}
export declare function getComponentRegistry(namespace: string): GondelComponentRegistry;
export declare function registerComponent(componentName: string, component: IGondelComponent): void;
export declare function registerComponent(componentName: string, namespace: string | undefined, component: IGondelComponent): void;
