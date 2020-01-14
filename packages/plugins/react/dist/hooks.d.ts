import { GondelComponent } from "@gondel/core";
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
export declare function useGondelComponent<TComponentType extends GondelComponent>(): readonly [(element: HTMLElement | null) => void, TComponentType | null];
