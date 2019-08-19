/**
 * The COMPONENT_RESIZED_EVENT event will be fired if a component size was changed because of a browser window resize
 */
export declare const COMPONENT_RESIZED_EVENT = "@gondel/plugin-resize--component-resized";
/**
 * The WINDOW_RESIZED_EVENT event will be fired if the browser window was resized
 */
export declare const WINDOW_RESIZED_EVENT = "@gondel/plugin-resize--window-resized";
/**
 * The second parameter of the COMPONENT_RESIZED_EVENT event listener
 */
export interface IComponentDimension {
    width: number;
    height: number;
}
/**
 * This function creates a custom gondel event
 */
export declare function initResizePlugin(): void;
