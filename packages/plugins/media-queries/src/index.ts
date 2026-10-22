/**
 * This is a plugin to initialize enquire.js and fire a viewportChange event when triggering a breakpoint
 */
import { addGondelPluginEventListener, getComponentByDomNode, GondelComponent } from '@gondel/core';
import { INamespacedEventHandlerRegistry } from '@gondel/core/dist/GondelEventRegistry';

/**
 * The VIEWPORT_ENTERED will be fired if a new viewport is entered
 */
export const VIEWPORT_ENTERED = '@gondel/plugin-media-queries--viewport-entered';

let currentViewport: string;

/**
 * This function returns all components for the given eventRegistry which can be found in the dom.
 */
function getComponentsInEventRegistry(
	eventRegistry: INamespacedEventHandlerRegistry,
	namespace: string,
): GondelComponent[] {
	const selector = Object.keys(eventRegistry)
		.map((componentName) => `[data-${namespace}-name="${componentName}"]`)
		.join(',');
	if (!selector) {
		return [];
	}
	const componentElements = document.documentElement.querySelectorAll(selector);
	const components: GondelComponent[] = [];
	for (let i = 0; i < componentElements.length; i++) {
		const component = getComponentByDomNode(componentElements[i], namespace);
		if (component) {
			components.push(component);
		}
	}
	return components;
}

/**
 * This function fire's a custom gondel event to all registered components
 */
function fireViewportChangeEvent(viewport: string, eventRegistry: INamespacedEventHandlerRegistry, namespace: string) {
	const components = getComponentsInEventRegistry(eventRegistry, namespace);
	const handlerResults: Array<() => void | undefined> = [];
	components.forEach((component) => {
		Object.keys(eventRegistry[component._componentName]).forEach((selector) => {
			if (selector === '' || viewport === selector) {
				eventRegistry[component._componentName][selector].forEach((handlerOption) => {
					handlerResults.push((component as any)[handlerOption.handlerName].call(component, { viewport }));
				});
			}
		});
	});
	handlerResults.forEach((handlerResults) => () => {
		if (typeof handlerResults === 'function') {
			handlerResults();
		}
	});
}

/**
 * This function returns the current viewport
 */
export function getCurrentViewport() {
	return currentViewport;
}

/**
 * Converts the given pixel breakpoint object into a em breakpoint object
 */
function convertBreakpointsToEm<T extends { [key: string]: number }>(breakpointsInPx: T): T {
	const breakpointsInEm: { [key: string]: number } = {};
	const breakpointNames = Object.keys(breakpointsInPx);
	breakpointNames.forEach((breakpointName) => {
		breakpointsInEm[breakpointName] = px2em(breakpointsInPx[breakpointName]);
	});
	return breakpointsInEm as T;
}

/**
 * Convert pixel to em
 */
function px2em(pixelValue: number) {
	return Math.round((pixelValue / 16) * 100) / 1000;
}

type ViewportMediaQuery = { name: string; query: string; excludeQuery?: string };

/**
 * This function generate mediaQueries from breakPoints
 */
function generateMediaQueries(breakPoints: { [key: string]: number }, unit: 'em' | 'px'): ViewportMediaQuery[] {
	// Sort breakpoints by size
	const breakpointNames = Object.keys(breakPoints).sort((breakpointNameA, breakpointNameB) => {
		if (breakPoints[breakpointNameA] > breakPoints[breakpointNameB]) {
			return 1;
		}
		if (breakPoints[breakpointNameA] < breakPoints[breakpointNameB]) {
			return -1;
		}
		return 0;
	});
	return breakpointNames.map((breakpointName, i) => {
		const max = breakPoints[breakpointName];
		const excludeQuery = i === 0 ? undefined : `(max-width: ${breakPoints[breakpointNames[i - 1]]}${unit})`;
		if (max === Infinity) {
			if (excludeQuery === undefined) {
				throw new Error('The smallest provided viewport must not be set to Infinity');
			}
			return { name: breakpointName, query: `not all and ${excludeQuery}` };
		}
		return { name: breakpointName, query: `(max-width: ${max}${unit})`, excludeQuery };
	});
}

function observeViewport(viewport: ViewportMediaQuery, onEnter: () => void): boolean {
	const upperBoundary = matchMedia(viewport.query);
	const lowerBoundary = viewport.excludeQuery === undefined ? undefined : matchMedia(viewport.excludeQuery);
	// Exclude the previous inclusive range rather than adding an offset to its boundary.
	const matches = () => upperBoundary.matches && !(lowerBoundary && lowerBoundary.matches);
	let matched = matches();
	const handleChange = () => {
		const nextMatched = matches();
		if (nextMatched === matched) {
			return;
		}
		matched = nextMatched;
		if (matched) {
			onEnter();
		}
	};
	upperBoundary.addListener(handleChange);
	if (lowerBoundary) {
		lowerBoundary.addListener(handleChange);
	}
	return matched;
}

/**
 * Use enquire.js to listen for viewport changes
 * Once a viewport changed call all gondel plugins which are listening
 */
function setupViewportChangeEvent(
	mediaQueries: ViewportMediaQuery[],
	eventRegistry: INamespacedEventHandlerRegistry,
	namespace: string,
) {
	for (const viewport of mediaQueries) {
		observeViewport(viewport, () => {
			currentViewport = viewport.name;
			fireViewportChangeEvent(viewport.name, eventRegistry, namespace);
		});
	}
}

/**
 * Use enquire.js to listen for viewport changes
 * for the getCurrentViewport helper method
 */
function setupCurrentViewportHelper(mediaQueries: ViewportMediaQuery[]) {
	for (const viewport of mediaQueries) {
		const matched = observeViewport(viewport, () => {
			currentViewport = viewport.name;
		});
		if (matched) {
			currentViewport = viewport.name;
		}
	}
}

export type MediaQueryPluginOptions = {
	/**
	 * List all breakpoints as a key value pair.
	 * The value will represent the max size of the breakpoint.
	 * The last breakpoint should always be set to Infinity:
	 *
	 * {
	 *   xxsmall: 480,     // for screen width 0-480
	 *   xsmall: 768,      // for screen width >480 and <=768
	 *   small: 992,       // for screen width >768 and <=992
	 *   medium: 1240,     // for screen width >992 and <=1240
	 *   large: 1440,      // for screen width >1240 and <=1440
	 *   xlarge: Infinity, // for screen width >1440
	 * }
	 */
	breakPoints: {
		[breakPointName: string]: number;
	};
	/**
	 * The unit which is used - default: 'px'
	 */
	unit?: 'px' | 'em';
	/**
	 * Activates a conversion from px - default: false
	 */
	convertToEm?: boolean;
};

/**
 * This function creates a custom gondel event
 */
export function initMediaQueriesPlugin(options: MediaQueryPluginOptions) {
	// Get the converted breakpoint values
	const breakPoints = options.convertToEm ? convertBreakpointsToEm(options.breakPoints) : options.breakPoints;
	// Get the unit
	const unit = options.unit || (options.convertToEm ? 'em' : 'px');
	const mediaQueries = generateMediaQueries(breakPoints, unit);
	// Setup the viewport helper independently so it will
	// also be avialiable if no component is listening to events:
	setupCurrentViewportHelper(mediaQueries);

	addGondelPluginEventListener(
		'MediaQueries',
		'registerEvent',
		function addViewportChangeEvent(isNativeEvent, { eventName, namespace, eventRegistry }, resolve) {
			// Ignore all events but the viewportChange event
			if (eventName !== VIEWPORT_ENTERED) {
				resolve(isNativeEvent);
				return;
			}

			setupViewportChangeEvent(mediaQueries, eventRegistry, namespace);

			// Tell the event system that it should not listen for the event:
			resolve(false);
		},
	);
}
