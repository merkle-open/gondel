var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * This is a plugin which allows a simplified usage of gondel together with react
 */
import { GondelBaseComponent } from "@gondel/core";
import { createRenderAbleAppWrapper } from "./AppWrapper";
/**
 * Returns true if the given object is promise like
 */
function isPromise(obj) {
    return obj.then !== undefined;
}
/**
 * If the given value is a promise wait for it otherwise execute the callback synchronously
 */
function unwrapPromiseApp(app, callback) {
    if (isPromise(app)) {
        return app.then(callback);
    }
    else {
        return Promise.resolve(callback(app));
    }
}
var GondelReactComponent = /** @class */ (function (_super) {
    __extends(GondelReactComponent, _super);
    function GondelReactComponent(ctx) {
        var _this = _super.call(this) || this;
        _this.__identification = {};
        // Overwrite the current start method
        var originalStart = _this.start;
        var ReactDOMPromise = import(/* webpackPrefetch: true, webpackChunkName: 'ReactDom' */ "react-dom").then(function (ReactDOM) { return ReactDOM.default; });
        var configScript = ctx.querySelector("script[type='text/json']");
        _this.state = configScript ? JSON.parse(configScript.innerHTML) : {};
        _this.start = function () {
            var _this = this;
            // Wait for the original start promise to allow lazy loading
            var originalStartPromise = new Promise(function (resolve, reject) {
                if (!originalStart) {
                    return resolve();
                }
                if (originalStart.length) {
                    return originalStart.call(_this, resolve, reject);
                }
                var result = originalStart.call(_this);
                return isPromise(result) ? result.then(resolve, reject) : resolve(result);
            });
            // Render the app
            var renderAppPromise = originalStartPromise.then(function () { return ReactDOMPromise; }).then(function (ReactDOM) {
                ReactDOM.render(createRenderAbleAppWrapper({
                    children: _this.render.bind(_this),
                    onHasState: function (setInternalState) {
                        _this._setInternalState = setInternalState;
                    },
                    componentWillUnmount: function () {
                        delete _this._setInternalState;
                        _this.componentWillUnmount && _this.componentWillUnmount();
                    },
                    componentDidMount: _this.componentDidMount && _this.componentDidMount.bind(_this),
                    componentWillReceiveProps: _this.componentWillReceiveProps && _this.componentWillReceiveProps.bind(_this),
                    shouldComponentUpdate: _this.shouldComponentUpdate && _this.shouldComponentUpdate.bind(_this),
                    componentWillUpdate: _this.componentWillUpdate && _this.componentWillUpdate.bind(_this),
                    componentDidUpdate: _this.componentDidUpdate && _this.componentDidUpdate.bind(_this),
                    componentDidCatch: _this.componentDidCatch && _this.componentDidCatch.bind(_this),
                    config: _this.state
                }), _this._ctx);
            });
            return renderAppPromise;
        };
        return _this;
    }
    GondelReactComponent.prototype.setState = function (state) {
        this.state = Object.assign({}, this.state, state);
        if (this._setInternalState) {
            this._setInternalState(this.state);
        }
    };
    GondelReactComponent.prototype.render = function () {
        throw new Error(this._componentName + " is missing an initialRender method");
    };
    return GondelReactComponent;
}(GondelBaseComponent));
export { GondelReactComponent };
//# sourceMappingURL=index.js.map