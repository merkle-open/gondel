import { useState, useRef, useCallback, useEffect } from 'react';
import { startComponents, hasMountedGondelComponent, getComponentByDomNode, stopComponents, } from '@gondel/core';
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
export function useGondelComponent() {
    var _a = useState(null), gondelInstance = _a[0], setGondelInstance = _a[1];
    var ref = useRef();
    var refFunction = useCallback(function (element) {
        if (element) {
            ref.current = element;
            startComponents(element).then(function () {
                setGondelInstance(hasMountedGondelComponent(element) ? getComponentByDomNode(element) : null);
            });
        }
    }, []);
    useEffect(function () {
        // Cleanup on unmount
        return function () {
            var element = ref.current;
            if (element) {
                stopComponents(element);
                ref.current = undefined;
            }
        };
    }, []);
    return [refFunction, gondelInstance];
}
//# sourceMappingURL=hooks.js.map