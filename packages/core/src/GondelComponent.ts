export type IGondelComponent = new (context: HTMLElement, componentName: string) => GondelComponent;

export type StartMethod =
	// Async boot
	| ((resolve: Function, reject?: Function) => void)
	// Async with promise
	| (() => Promise<any>)
	// Sync boot
	| (() => void);

export interface GondelComponent<TElement = HTMLElement> {
	// The component context
	_ctx: TElement;
	// The namespace e.g. 'g'
	_namespace: string;
	// The componentname e.g. 'Input'
	_componentName: string;
	// Stopped
	_stopped: boolean;
	// Async with resolve function
	start?: StartMethod;
	// Tear down
	stop?(): void;
	// Sync
	sync?(): void;
}

export class GondelBaseComponent<TElement = HTMLElement> implements GondelComponent<TElement> {
	constructor(domNode: TElement, componentName: string) {}
	/**
	 * The component context
	 */
	_ctx: TElement;
	/**
	 * The namespace e.g. 'g'
	 */
	_namespace: string;
	/**
	 * The componentname e.g. 'Input'
	 */
	_componentName: string;
	/**
	 * Stopped
	 */
	_stopped: boolean;
	/**
	 * Stop method
	 */
	stop() {}
}
