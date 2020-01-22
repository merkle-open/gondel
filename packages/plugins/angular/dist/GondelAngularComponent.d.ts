import { GondelBaseComponent } from "@gondel/core";
import { NgModuleRef, NgZone } from '@angular/core';
declare type GondelAngularModule = any;
export declare class GondelAngularComponent<State = {}, NGModule extends GondelAngularModule = any, TElement extends HTMLElement = HTMLDivElement> extends GondelBaseComponent<TElement> {
    static readonly AppPromiseMap: WeakMap<Promise<any>, any>;
    /**
     * Saving all NgModule references here, important
     * for updating or destroying apps
     */
    static readonly ModuleRefMap: WeakMap<any, NgModuleRef<any>>;
    /**
     * The module ref zones, will be set after
     * each successful bootstrap process.
     */
    static readonly ZoneMap: Map<string, NgZone>;
    /**
     * Dynamic import of the root NgModule class
     */
    AppModule?: Promise<NGModule>;
    /**
     * Initial loaded state from DOM
     */
    state: Readonly<State>;
    /**
     * Public zone reference
     */
    zone: NgZone;
    constructor(ctx: TElement, componentName: string);
    private ensureComponentTagInContext;
}
export {};
