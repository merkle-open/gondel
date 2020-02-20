var Selector = /** @class */ (function () {
    function Selector(gondelComponent, binding) {
        this.gondelComponent = gondelComponent;
        var propertyKey = binding[0], selector = binding[1], options = binding[2];
        this.boundPropertyKey = propertyKey;
        this.selector = selector;
        this.options = options;
    }
    Object.defineProperty(Selector.prototype, "all", {
        /**
         * Returns a list of matching DOM components found in the current component context
         * @returns {T[]} List of DOM elements
         */
        get: function () {
            var nodes = this.gondelComponent._ctx.querySelectorAll(this.selector);
            if (!nodes) {
                throw new Error("No components found in " + this.gondelComponent._componentName + " for " + this.selector);
            }
            return Array.prototype.slice.call(nodes);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selector.prototype, "first", {
        /**
         * Returns the first matching element of matching DOM nodes in the current component context
         * @returns {T} The DOM element
         */
        get: function () {
            if (this.all.length === 0) {
                throw new Error("No first component for " + this.selector + " found in " + this.gondelComponent._componentName);
            }
            return this.all[0];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Executes a lookup for different context with the current selector options
     * @param {C} context
     */
    Selector.prototype.getInContext = function (context) {
        var nodes = context.querySelectorAll(this.selector);
        if (!nodes) {
            throw new Error("No components found in context " + context + " for " + this.selector);
        }
        return Array.prototype.slice.call(nodes);
    };
    /**
     * Returns a readable string for debugging
     * @example
     * 'Selector(Component.property) .a-heading > h2'
     */
    Selector.prototype.toString = function () {
        return "Selector(" + this.gondelComponent._componentName + "." + this.boundPropertyKey + ") " + this.selector;
    };
    return Selector;
}());
export { Selector };
//# sourceMappingURL=Selector.js.map