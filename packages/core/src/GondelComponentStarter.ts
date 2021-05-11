/*
 * @file
 *
 * The component starter is responsible for booting up
 * all components found in the DOM
 */
import { GondelComponent } from './GondelComponent';
import { GondelComponentRegistry } from './GondelComponentRegistry';
import { internalGondelAsyncRefAttribute, internalGondelRefAttribute } from './GondelDomUtils';
import { triggerPublicEvent } from './GondelEventEmitter';
import { fireGondelPluginEvent } from './GondelPluginUtils';
const noop = () => {};
const Deferred = function () {
	this.promise = new Promise((resolve) => {
		this.resolve = resolve;
	});
} as any as { new (): { promise: Promise<any>; resolve: () => void } };

/**
 * Start all components of the gondel component registry
 * for the given dom context
 */
export function startComponentsFromRegistry(
	gondelComponentRegistry: GondelComponentRegistry,
	domContext: HTMLElement,
	namespace: string
): Promise<Array<GondelComponent>> {
	// Get an array of all nodes which match the namespace
	const gondelDomNodeList: Array<HTMLElement> = Array.prototype.slice.call(
		domContext.querySelectorAll(`[data-${namespace}-name]`)
	);
	if (domContext.hasAttribute(`data-${namespace}-name`)) {
		gondelDomNodeList.push(domContext);
	}
	// Remove already booted nodes
	const pristineGondelDomNodes: Array<HTMLElement> = gondelDomNodeList.filter((gondelDomNode) =>
		isPristineGondelDomNode(gondelDomNode, namespace)
	);
	const bootingDeferred = new Deferred();
	// Mark all nodes as booting
	pristineGondelDomNodes.forEach((gondelDomNode) => {
		attachGondelBootingFlag(gondelDomNode, bootingDeferred.promise, namespace);
	});

	// Create instances
	const gondelComponents = fireGondelPluginEvent(
		'boot',
		pristineGondelDomNodes,
		{ namespace },
		(pristineGondelDomNodes) => {
			return pristineGondelDomNodes.map((gondelDomNode) =>
				constructComponent(gondelDomNode, gondelComponentRegistry, namespace)
			);
		}
	);
	// Get all component names
	const newComponentNames = getNewComponents(gondelComponents, gondelComponentRegistry);
	newComponentNames.forEach((componentName) => gondelComponentRegistry.setActiveState(componentName, true));
	// Start all components
	const gondelComponentStartPromise = fireGondelPluginEvent(
		'start',
		gondelComponents,
		{ newComponentNames, namespace, gondelComponentRegistry },
		(gondelComponents) => {
			// Wait for async started components
			return Promise.all(gondelComponents.map(startConstructedComponent));
		}
	)
		// Let all plugins know that the components are now all ready to use
		.then(() => {
			gondelComponents.forEach((gondelComponent) => {
				if (gondelComponent.sync) {
					gondelComponent.sync();
				}
			});
			return fireGondelPluginEvent('sync', gondelComponents, { namespace });
		});
	// Resolve the booting deferred
	gondelComponentStartPromise
		.then(bootingDeferred.resolve, bootingDeferred.resolve)
		// Rethrow errors (if any)
		// otherwise the browser dev tools won't show
		// important bootstrap errors
		.then(() => gondelComponentStartPromise);

	// Return a promise of all started components
	return gondelComponentStartPromise;
}

/**
 * Returns true if the given domNode is neither booting nor booted
 */
export function isPristineGondelDomNode(domNode: HTMLElement, namespace: string) {
	return !domNode.hasOwnProperty(internalGondelAsyncRefAttribute + namespace);
}

/**
 * Mark the given dom node as controlled by gondel
 */
export function attachGondelBootingFlag(domNode: HTMLElement, bootingFlag: Promise<any>, namespace: string) {
	// The name `A` mean async
	// to allow waiting for asyncronous booted components
	(domNode as any)[internalGondelAsyncRefAttribute + namespace] = bootingFlag;
}

/**
 * Constructs a new component
 */
export function constructComponent(
	domNode: HTMLElement,
	gondelComponentRegistry: GondelComponentRegistry,
	namespace: string
) {
	const componentName = domNode.getAttribute(`data-${namespace}-name`)!;
	const GondelComponent = gondelComponentRegistry.getComponent(componentName);
	if (GondelComponent === undefined) {
		throw new Error(`Failed to boot component - ${componentName} is not registred`);
	}
	const componentInstance = new GondelComponent(domNode, componentName);
	componentInstance._ctx = domNode;
	componentInstance._namespace = namespace;
	componentInstance._componentName = componentName;
	// Add stop method
	componentInstance.stop = stopStartedComponent.bind(
		null,
		componentInstance,
		componentInstance.stop || noop,
		namespace
	);
	// Create a circular reference which will allow access to the componentInstance from ctx
	(domNode as any)['_gondel_' + namespace] = componentInstance;
	return componentInstance;
}

/**
 * Start a component after it was constructed
 */
export function startConstructedComponent(component: GondelComponent): Promise<any> | void {
	// Skip if the start method is missing
	if (!component.start) {
		return;
	}
	const expectsNoArguments = component.start.length === 0;
	// Start the component and expect a promise or a syncronous return value
	// if the function expects no arguments
	if (expectsNoArguments) {
		return (component.start as () => Promise<any> | void)();
	}
	// Otherwise start the component by passing a resolve function
	type AsyncStartMethod = (resolve: () => void, reject: () => void) => void;
	return new Promise<void>((resolve, reject) => (component.start as AsyncStartMethod)(resolve, reject));
}

/**
 * Stops a started component
 */
export function stopStartedComponent(component: GondelComponent, internalStopMethod: () => void, namespace: string) {
	triggerPublicEvent(`${namespace}Stop`, component, component._ctx);
	// Remove the component instance from the html element
	delete (component._ctx as any)[internalGondelRefAttribute + namespace];
	delete (component._ctx as any)[internalGondelAsyncRefAttribute + namespace];
	component._stopped = true;
	fireGondelPluginEvent('stop', component, { namespace }, internalStopMethod.bind(component));
}

/**
 * Filters the given component list and returns the names of those components which have never been started before
 */
function getNewComponents(components: Array<GondelComponent>, registry: GondelComponentRegistry) {
	const componentNameHelper: { [key: string]: boolean } = {};
	components.forEach((component) => (componentNameHelper[component._componentName] = true));
	const componentNames = Object.keys(componentNameHelper);
	return componentNames.filter((componentName) => !registry._activeComponents[componentName]);
}
