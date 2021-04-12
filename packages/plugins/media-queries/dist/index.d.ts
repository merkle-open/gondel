/**
 * The VIEWPORT_ENTERED will be fired if a new viewport is entered
 */
export declare const VIEWPORT_ENTERED = "@gondel/plugin-media-queries--viewport-entered";
/**
 * This function returns the current viewport
 */
export declare function getCurrentViewport(): string;
export declare type MediaQueryPluginOptions = {
    /**
     * List all breakpoints as a key value pair.
     * The value will represent the max size of the breakpoint.
     * The last breakpoint should always be set to Infinity:
     *
     * {
     *   xxsmall: 480,     // for screen width 0-480
     *   xsmall: 768,      // for screen width 481-768
     *   small: 992,       // for screen width 769-992
     *   medium: 1240,     // for screen width 993-1240
     *   large: 1440,      // for screen width 1241-1441
     *   xlarge: Infinity, // for screen width 1441-Infinity
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
export declare function initMediaQueriesPlugin(options: MediaQueryPluginOptions): void;
