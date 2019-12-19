/**
 * This is a plugin which allows a simplified usage of gondel together with react
 */
import {
  getComponentByDomNode,
  GondelBaseComponent,
  GondelComponent,
  hasMountedGondelComponent,
  startComponents,
  stopComponents
} from "@gondel/core";
import React, {
  ComponentClass,
  ComponentLifecycle,
  StatelessComponent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { createRenderableAppWrapper } from "./AppWrapper";

/**
 * Returns true if the given object is promise like
 */
function isPromise<T>(
  obj: {} | Promise<T> | undefined | string | number | null
): obj is Promise<T> {
  return !!obj && typeof (obj as Promise<T>).then === "function";
}

type RenderableReactComponent<State> =
  | StatelessComponent<Readonly<State>>
  | ComponentClass<Readonly<State>, any>;

export class GondelReactComponent<State> extends GondelBaseComponent
  implements ComponentLifecycle<null, State> {
  static readonly AppPromiseMap = new WeakMap<
    Promise<RenderableReactComponent<any>>,
    RenderableReactComponent<any>
  >();

  _setInternalState: (config: State) => void | undefined;
  App?: RenderableReactComponent<State> | Promise<RenderableReactComponent<State>>;

  state: Readonly<State>;
  setState(state: Partial<State>) {
    this.state = Object.assign({}, this.state, state);
    // Handover the state to react
    // if the component was already rendered
    if (this._setInternalState) {
      this._setInternalState(this.state);
    }
  }

  constructor(ctx: HTMLElement, componentName: string) {
    super(ctx, componentName);
    // Overwrite the current start method
    const originalStart = (this as any).start;
    const ReactDOMPromise = import(
      /* webpackPrefetch: true, webpackChunkName: 'ReactDom' */ "react-dom"
    ).then(ReactDOM => ReactDOM.default);
    const configScript = ctx.querySelector("script[type='text/json']");
    this.state = configScript ? JSON.parse(configScript.innerHTML) : {};
    (this as any).start = function(this: GondelReactComponent<State>) {
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
      const renderAppPromise = originalStartPromise
        .then(() => Promise.all([ReactDOMPromise, this.App]))
        .then(([ReactDOM, App]) => {
          // Store unwrapped promise for this.App
          if (App && isPromise(this.App)) {
            GondelReactComponent.AppPromiseMap.set(this.App, App);
          }
          // Render only if the app was not stopped
          this._stopped ||
            ReactDOM.render(
              createRenderableAppWrapper({
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
                componentWillUpdate:
                  this.componentWillUpdate && this.componentWillUpdate.bind(this),
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
    nextState: Readonly<State>,
    nextContext: any
  ): boolean;
  /**
   * Called immediately before rendering when new props or state is received. Not called for the initial render.
   *
   * Note: You cannot call `Component#setState` here.
   */
  componentWillUpdate?(
    nextProps: Readonly<null>,
    nextState: Readonly<State>,
    nextContext: any
  ): void;
  /**
   * Called immediately after updating occurs. Not called for the initial render.
   */
  componentDidUpdate?(
    prevProps: Readonly<null>,
    prevState: Readonly<State>,
    prevContext: any
  ): void;
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

  render(): any {
    // If this App is a promise use the AppPromiseMap to extract the resolved promise value
    const App = isPromise(this.App) ? GondelReactComponent.AppPromiseMap.get(this.App) : this.App;
    if (!App) {
      throw new Error(
        `${this._componentName} could not render ${
          this.App
            ? "ensure that you are returning a React component"
            : "please add a render method"
        }`
      );
    }
    return React.createElement(App, this.state);
  }
}

/** React hook to use Gondel components inside React */
export function useGondelComponent<TComponentType extends GondelComponent>() {
  const [gondelInstance, setGondelInstance] = useState<TComponentType | null>(null);
  const ref = useRef<HTMLElement | undefined>();
  const refFunction = useCallback((element: HTMLElement | null) => {
    if (element) {
      ref.current = element;
      startComponents(element).then(() => {
        setGondelInstance(
          hasMountedGondelComponent(element) ? getComponentByDomNode<TComponentType>(element) : null
        );
      });
    }
  }, []);
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      const element = ref.current;
      if (element) {
        stopComponents(element);
        ref.current = undefined;
      }
    };
  }, []);
  return [refFunction, gondelInstance] as const;
}
