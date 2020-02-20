var Selector = /** @class */ (function () {
    function Selector(gondelComponent, binding) {
        this.gondelComponent = gondelComponent;
        var propertyKey = binding[0], selector = binding[1], options = binding[2];
        this.boundPropertyKey = propertyKey;
        this.selector = selector;
        this.options = options;
    }
    Object.defineProperty(Selector.prototype, "all", {
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
        get: function () {
            return this.all[0];
        },
        enumerable: true,
        configurable: true
    });
    Selector.prototype.getInContext = function (context) {
        var nodes = context.querySelectorAll(this.selector);
        if (!nodes) {
            throw new Error("No components found in " + this.gondelComponent._componentName + " for " + this.selector);
        }
        return Array.prototype.slice.call(nodes);
    };
    Selector.prototype.toString = function () {
        return "Selector(" + this.gondelComponent._componentName + "." + this.boundPropertyKey + ") " + this.selector;
    };
    return Selector;
}());
export { Selector };
//# sourceMappingURL=Selector.js.map