/**
 * This is a plugin which allows a simplified usage of gondel together with react
 */
import { GondelBaseComponent } from "@gondel/core";
import { ComponentLifecycle } from "react";
import { createRenderAbleAppWrapper } from "./AppWrapper";

/**
 * Returns true if the given object is promise like
 */
function isPromise<T>(obj: {} | Promise<T>): obj is Promise<T> {
  return (<Promise<T>>obj).then !== undefined;
}

/**
 * If the given value is a promise wait for it otherwise execute the callback synchronously
 */
function unwrapPromiseApp<T, U>(app: T | Promise<T>, callback: (app: T) => Promise<U>): Promise<U> {
  if (isPromise(app)) {
    return app.then(callback);
  } else {
    return Promise.resolve(callback(app));
  }
}

export class GondelReactComponent<S> extends GondelBaseComponent
  implements ComponentLifecycle<null, S> {
  _setInternalState: (config: S) => void | undefined;

  state: S;
  __identification = {};
  protected setState(state: S) {
    this.state = Object.assign({}, this.state, state);
    if (this._setInternalState) {
      this._setInternalState(this.state);
    }
  }

  constructor(ctx: HTMLElement) {
    super();
    // Overwrite the current start method
    const originalStart = (this as any).start;
    const ReactDOMPromise = import(/* webpackPrefetch: true, webpackChunkName: 'ReactDom' */ "react-dom").then(
      ReactDOM => ReactDOM.default
    );
    const configScript = ctx.querySelector("script[type='text/json']");
    this.state = configScript ? JSON.parse(configScript.innerHTML) : {};
    (this as any).start = function(this: GondelReactComponent<S>) {
      // Wait for the original start promise to allow lazy loading
      const originalStartPromise = new Promise((resolve, reject) => {
        if (!originalStart) {
          return resolve();
        }
        if (originalStart.length) {
          return originalStart.call(this, resolve, reject);
        }
        const result = originalStart.call(this);
        return isPromise(result) ? result.then(resolve, reject) : resolve(result);
      });

      // Render the app
      const renderAppPromise = originalStartPromise.then(() => ReactDOMPromise).then(ReactDOM => {
        ReactDOM.render(
          createRenderAbleAppWrapper({
            children: this.render.bind(this),
            onHasState: setInternalState => {
              this._setInternalState = setInternalState;
            },
            componentWillUnmount: () => {
              delete this._setInternalState;
              this.componentWillUnmount && this.componentWillUnmount();
            },
            componentDidMount: this.componentDidMount && this.componentDidMount.bind(this),
            componentWillReceiveProps:
              this.componentWillReceiveProps && this.componentWillReceiveProps.bind(this),
            shouldComponentUpdate:
              this.shouldComponentUpdate && this.shouldComponentUpdate.bind(this),
            componentWillUpdate: this.componentWillUpdate && this.componentWillUpdate.bind(this),
            componentDidUpdate: this.componentDidUpdate && this.componentDidUpdate.bind(this),
            componentDidCatch: this.componentDidCatch && this.componentDidCatch.bind(this),
            config: this.state
          }),
          this._ctx
        );
      });
      return renderAppPromise;
    };
  }

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
  shouldComponentUpdate?(
    nextProps: Readonly<null>,
    nextState: Readonly<S>,
    nextContext: any
  ): boolean;
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

  protected render(): any {
    throw new Error(`${this._componentName}'s render method is missing (https://git.io/f4DKo)`);
  }
}
