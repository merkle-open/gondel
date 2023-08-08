import { useState, useRef, useCallback, useEffect } from 'react';
import {
	GondelComponent,
	startComponents,
	hasMountedGondelComponent,
	getComponentByDomNode,
	stopComponents,
} from '@gondel/core';

/**
 * React hook to use a Gondel components inside React
 * @description
 * The `useGondelComponent` hook allows us to use a Gondel UI component like an accordion or button inside a React app.
 * This can be really handy if you want to interop with your existing component markup inside of React.
 * @example
 * const Button = (props) => {
 *    const [ref, gondelButtonInstance] = useGondelComponent();
 *    return (
 *      <button
 *          ref={ref}
 *          data-g-name="Button"
 *          onClick={() => {
 *              // Ensure that the gondelInstance is already initialized
 *              if (gondelButtonInstance) {
 *                  // Execute a class method from the Gondel component
 *                  gondelButtonInstance.setIsEnabled(false);
 *              }
 *          }}>
 *          Button text
 *      </button>
 *    );
 * };
 */
export function useGondelComponent<TComponentType extends GondelComponent>() {
	const [gondelInstance, setGondelInstance] = useState<TComponentType | null>(null);
	const ref = useRef<HTMLElement | undefined>();
	const refFunction = useCallback((element: HTMLElement | null) => {
		if (element) {
			ref.current = element;
			startComponents(element).then(() => {
				setGondelInstance(
					hasMountedGondelComponent(element) ? getComponentByDomNode<TComponentType>(element) : null,
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
