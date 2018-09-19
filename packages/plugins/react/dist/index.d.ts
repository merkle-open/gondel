/**
 * This is a plugin which allows a simplified usage of gondel together with react
 */
import { GondelBaseComponent } from "@gondel/core";
import { ComponentLifecycle } from "react";
export declare class GondelReactComponent<S> extends GondelBaseComponent implements ComponentLifecycle<null, S> {
    _setInternalState: (config: S) => void | undefined;
    state: S;
    protected setState(state: S): void;
    constructor(ctx: HTMLElement, componentName: string);
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
    shouldComponentUpdate?(nextProps: Readonly<null>, nextState: Readonly<S>, nextContext: any): boolean;
    /**
     * Called immediately before rendering when new props or state is received. Not called for the initial render.
     *
     * Note: You cannot call `Component#setState` here.
     */
    componentWillUpdate?(nextProps: Readonly<null>, nextState: Readonly<S>, nextContext: any): void;
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     */
    componentDidUpdate?(prevProps: Readonly<null>, prevState: Readonly<S>, prevContext: any): void;
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
    protected render(): any;
}
