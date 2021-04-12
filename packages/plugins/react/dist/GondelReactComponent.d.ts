import React, { StatelessComponent, ComponentClass, ComponentLifecycle } from 'react';
import { GondelBaseComponent } from '@gondel/core';
import { KeysMatching, UnwrapPromise } from './utils';
declare type RenderableReactComponent<State> = StatelessComponent<State> | ComponentClass<State, any>;
declare type StateOfComponent<T> = T extends RenderableReactComponent<infer V> ? V : never;
export interface ConstructableGondelReactComponent<State> {
    new (...args: any[]): GondelReactComponent<State>;
}
/**
 * Create a GondelReactComponent class which is directly linked with a loader
 * for default exports
 *
 *  @example
 *  const loader = () => import('./App');
 *  class MyComponent extends GondelReactComponent.create(loader) {
 *  }
 *
 */
export declare function createGondelReactLoader<State extends {}>(loader: () => Promise<RenderableReactComponent<State>>): ConstructableGondelReactComponent<State>;
/**
 * Create a GondelReactComponent class which is directly linked with a loader
 *
 *  @example
 *  const loader = () => <span>Hello world</span>;
 *  class MyComponent extends GondelReactComponent.create(loader) {
 *  }
 *
 */
export declare function createGondelReactLoader<State extends {}>(loader: () => RenderableReactComponent<State>): ConstructableGondelReactComponent<State>;
/**
 * Create a GondelReactComponent class which is directly linked with a loader
 * for named exports like `export const App = () => <span>Hello world</span>`
 *
 *  @example
 *  const loader = () => import('./App');
 *  class MyComponent extends GondelReactComponent.create(loader, "App") {
 *  }
 *
 */
export declare function createGondelReactLoader<State extends StateOfComponent<UnwrapPromise<Module>[ExportName]>, Module extends Promise<{
    [key: string]: unknown;
}>, ExportName extends KeysMatching<UnwrapPromise<Module>, RenderableReactComponent<any>>>(loader: () => Module, exportName: ExportName): ConstructableGondelReactComponent<State>;
export declare class GondelReactComponent<State extends {} = {}, TElement extends HTMLElement = HTMLDivElement> extends GondelBaseComponent<TElement> implements ComponentLifecycle<null, State> {
    static readonly AppPromiseMap: WeakMap<Promise<RenderableReactComponent<any>>, RenderableReactComponent<any>>;
    /**
     * Create a GondelReactComponent class which is directly linked with a loader
     */
    static create: typeof createGondelReactLoader;
    _setInternalState?: (config: State) => void | undefined;
    App?: RenderableReactComponent<State> | Promise<RenderableReactComponent<State>>;
    state: Readonly<State>;
    constructor(ctx: TElement, componentName: string);
    setState(state: Partial<State>): void;
    /**
     * Called immediately before mounting occurs, and before `Component#render`.
     * Avoid introducing any side-effects or subscriptions in this method.
     */
    componentWillMount?(): void;
    /**
     * Called immediately after a compoment is mounted. Setting state here will trigger re-rendering.
     */
    componentDidMount?(): void;
    /**
     * Called when the component may be receiving new props.
     * React may call this even if props have not changed, so be sure to compare new and existing
     * props if you only want to handle changes.
     *
     * Calling `Component#setState` generally does not trigger this method.
     */
    componentWillReceiveProps?(nextProps: Readonly<null>, nextContext: any): void;
    /**
     * Called to determine whether the change in props and state should trigger a re-render.
     *
     * `Component` always returns true.
     * `PureComponent` implements a shallow comparison on props and state and returns true if any
     * props or states have changed.
     *
     * If false is returned, `Component#render`, `componentWillUpdate`
     * and `componentDidUpdate` will not be called.
     */
    shouldComponentUpdate?(nextProps: Readonly<null>, nextState: Readonly<State>, nextContext: any): boolean;
    /**
     * Called immediately before rendering when new props or state is received. Not called for the initial render.
     *
     * Note: You cannot call `Component#setState` here.
     */
    componentWillUpdate?(nextProps: Readonly<null>, nextState: Readonly<State>, nextContext: any): void;
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     */
    componentDidUpdate?(prevProps: Readonly<null>, prevState: Readonly<State>, prevContext: any): void;
    /**
     * Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
     * cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.
     */
    componentWillUnmount?(): void;
    /**
     * Catches exceptions generated in descendant components. Unhandled exceptions will cause
     * the entire component tree to unmount.
     */
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    render(): any;
}
export {};
