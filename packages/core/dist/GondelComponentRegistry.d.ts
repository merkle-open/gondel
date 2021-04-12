/**
 * The component registry allows to store
 * gondel components by an unique name
 */
import { IGondelComponent } from './GondelComponent';
export declare const enum RegistryBootMode {
    /**
     * The Registry was already booted
     */
    alreadyBooted = 0,
    /**
     * The registry has to be booted by explicitly calling startComponents()
     */
    manual = 1,
    /**
     * The registry will start once the dom was load
     */
    onDomReady = 2
}
export declare class GondelComponentRegistry {
    _components: {
        [componentName: string]: IGondelComponent;
    };
    _activeComponents: {
        [componentName: string]: boolean;
    };
    _bootMode: RegistryBootMode;
    constructor();
    registerComponent(name: string, gondelComponent: IGondelComponent): void;
    unregisterComponent(name: string): void;
    getComponent(name: string): IGondelComponent;
    /**
     * Set if a component is used
     */
    setActiveState(name: string, isActive: boolean): void;
    setBootMode(bootMode: RegistryBootMode): void;
}
export declare function getComponentRegistry(namespace: string): GondelComponentRegistry;
export declare function registerComponent(componentName: string, component: IGondelComponent): void;
export declare function registerComponent(componentName: string, namespace: string | undefined, component: IGondelComponent): void;
