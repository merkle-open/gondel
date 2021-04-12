import React, { createElement, StatelessComponent, ComponentClass, ComponentLifecycle } from 'react';
import { GondelBaseComponent } from '@gondel/core';
import { createRenderableAppWrapper } from './AppWrapper';
import { isPromise, KeysMatching, UnwrapPromise } from './utils';

type RenderableReactComponent<State> = StatelessComponent<State> | ComponentClass<State, any>;
type StateOfComponent<T> = T extends RenderableReactComponent<infer V> ? V : never;

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
export function createGondelReactLoader<State extends {}>(
	loader: () => Promise<RenderableReactComponent<State>>
): ConstructableGondelReactComponent<State>;
/**
 * Create a GondelReactComponent class which is directly linked with a loader
 *
 *  @example
 *  const loader = () => <span>Hello world</span>;
 *  class MyComponent extends GondelReactComponent.create(loader) {
 *  }
 *
 */
export function createGondelReactLoader<State extends {}>(
	loader: () => RenderableReactComponent<State>
): ConstructableGondelReactComponent<State>;
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
export function createGondelReactLoader<
	State extends StateOfComponent<UnwrapPromise<Module>[ExportName]>,
	Module extends Promise<{ [key: string]: unknown }>,
	ExportName extends KeysMatching<UnwrapPromise<Module>, RenderableReactComponent<any>>
>(loader: () => Module, exportName: ExportName): ConstructableGondelReactComponent<State>;
export function createGondelReactLoader<State extends {}, Module extends { [key: string]: unknown }>(
	loader: () => // Synchronous loader
	| RenderableReactComponent<State>
		// Asynchronous loader
		| Promise<RenderableReactComponent<State> | Module>,
	exportName?: KeysMatching<Module, RenderableReactComponent<State>>
): ConstructableGondelReactComponent<State> {
	const unifiedLoader = () => {
		const loaderResult = loader();
		if (!isPromise(loaderResult)) {
			return loaderResult;
		}

		return loaderResult.then((lazyLoadModule) => {
			if (exportName) {
				const mod = lazyLoadModule as {
					[key in typeof exportName]: RenderableReactComponent<State>;
				};

				/* istanbul ignore else */
				if (mod[exportName]) {
					return mod[exportName] as RenderableReactComponent<State>;
				} else {
					throw new Error(`export ${exportName} not found`);
				}
			}

			return lazyLoadModule as RenderableReactComponent<State>;
		});
	};

	return class GondelReactWrapperComponent extends GondelReactComponent<State> {
		App = unifiedLoader();
	};
}

export class GondelReactComponent<State extends {} = {}, TElement extends HTMLElement = HTMLDivElement>
	extends GondelBaseComponent<TElement>
	implements ComponentLifecycle<null, State> {
	static readonly AppPromiseMap = new WeakMap<
		Promise<RenderableReactComponent<any>>,
		RenderableReactComponent<any>
	>();

	/**
	 * Create a GondelReactComponent class which is directly linked with a loader
	 */
	static create = createGondelReactLoader;

	_setInternalState?: (config: State) => void | undefined;
	App?: RenderableReactComponent<State> | Promise<RenderableReactComponent<State>>;
	state: Readonly<State>;

	constructor(ctx: TElement, componentName: string) {
		super(ctx, componentName);

		// Overwrite the current start method
		const originalStart = (this as any).start;
		const ReactDOMPromise = import(/* webpackPrefetch: true, webpackChunkName: 'ReactDom' */ 'react-dom').then(
			(ReactDOM) => ReactDOM.default || ReactDOM
		);

		const configScript = ctx.querySelector("script[type='text/json']");
		this.state = configScript ? JSON.parse(configScript.innerHTML) : {};

		let unmountComponentAtNode: typeof import('react-dom')['unmountComponentAtNode'] | undefined;

		(this as any).start = function (this: GondelReactComponent<State>) {
			// Wait for the original start promise to allow lazy loading
			const originalStartPromise = new Promise<void>((resolve, reject) => {
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
					// Store unmountComponentAtNode for stopping the app
					unmountComponentAtNode = ReactDOM.unmountComponentAtNode;
					// Store unwrapped promise for this.App
					if (App && isPromise(this.App)) {
						GondelReactComponent.AppPromiseMap.set(this.App, App);
					}

					// Render only if the app was not stopped
					this._stopped ||
						ReactDOM.render(
							createRenderableAppWrapper({
								children: this.render.bind(this),
								onHasState: (setInternalState) => {
									this._setInternalState = setInternalState;
								},
								componentWillUnmount: (...args) => {
									delete this._setInternalState;
									this.componentWillUnmount && this.componentWillUnmount.apply(this, args);
								},
								componentDidMount: this.componentDidMount && this.componentDidMount.bind(this),
								componentWillReceiveProps:
									this.componentWillReceiveProps && this.componentWillReceiveProps.bind(this),
								shouldComponentUpdate:
									this.shouldComponentUpdate && this.shouldComponentUpdate.bind(this),
								componentWillUpdate: this.componentWillUpdate && this.componentWillUpdate.bind(this),
								componentDidUpdate: this.componentDidUpdate && this.componentDidUpdate.bind(this),
								componentDidCatch: this.componentDidCatch && this.componentDidCatch.bind(this),
								config: this.state,
							}),
							this._ctx
						);
				});

			return renderAppPromise;
		};

		// Make sure that the stop method will tear down the react app
		const originalStop = (this as any).stop as undefined | (() => {});
		(this as any).stop = function (this: GondelReactComponent<State>) {
			const returnValue = originalStop && originalStop.apply(this, arguments);
			// check if during this components start method unmountComponentAtNode
			// was set - if not we don't need to unmound the app
			if (unmountComponentAtNode) {
				unmountComponentAtNode(this._ctx);
			}

			return returnValue;
		};
	}

	setState(state: Partial<State>) {
		this.state = Object.assign({}, this.state, state);
		// Handover the state to react
		// if the component was already rendered
		if (this._setInternalState) {
			this._setInternalState(this.state);
		}
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

	render(): any {
		// If this App is a promise use the AppPromiseMap to extract the resolved promise value
		const App = isPromise(this.App) ? GondelReactComponent.AppPromiseMap.get(this.App) : this.App;

		if (!App) {
			throw new Error(
				`${this._componentName} could not render ${
					'App' in this ? 'ensure that you are returning a React component' : 'please add a render method'
				}`
			);
		}

		return createElement(App, this.state);
	}
}
