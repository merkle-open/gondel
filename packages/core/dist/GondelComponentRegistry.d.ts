/**
 * The component registry allows to store
 * gondel components by an unique name
 */
import { IGondelComponent, GondelComponent, IGondelComponentWithIdentification } from "./GondelComponent";
export declare class GondelComponentRegistry {
    _components: {
        [componentName: string]: IGondelComponent & IGondelComponentWithIdentification;
    };
    _activeComponents: {
        [componentName: string]: boolean;
    };
    constructor();
    registerComponent(name: string, gondelComponent: IGondelComponent & IGondelComponentWithIdentification): void;
    unregisterComponent(name: string): void;
    getComponent(name: string): IGondelComponent<GondelComponent> & IGondelComponentWithIdentification;
    /**
     * Set if a component is used
     */
    setActiveState(name: string, isActive: boolean): void;
}
export declare const componentRegistries: {
    [key: string]: GondelComponentRegistry;
};
export declare function registerComponent(componentName: string, component: IGondelComponent, namespace?: string): void;
