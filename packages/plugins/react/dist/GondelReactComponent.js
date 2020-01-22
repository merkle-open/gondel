var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { createElement } from "react";
import { GondelBaseComponent } from "@gondel/core";
import { createRenderableAppWrapper } from "./AppWrapper";
import { isPromise } from "./utils";
export function createGondelReactLoader(loader, exportName) {
    var unifiedLoader = function () {
        var loaderResult = loader();
        if (!isPromise(loaderResult)) {
            return loaderResult;
        }
        return loaderResult.then(function (lazyLoadModule) {
            if (exportName) {
                var mod = lazyLoadModule;
                /* istanbul ignore else */
                if (mod[exportName]) {
                    return mod[exportName];
                }
                else {
                    throw new Error("export " + exportName + " not found");
                }
            }
            return lazyLoadModule;
        });
    };
    return /** @class */ (function (_super) {
        __extends(GondelReactWrapperComponent, _super);
        function GondelReactWrapperComponent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.App = unifiedLoader();
            return _this;
        }
        return GondelReactWrapperComponent;
    }(GondelReactComponent));
}
var GondelReactComponent = /** @class */ (function (_super) {
    __extends(GondelReactComponent, _super);
    function GondelReactComponent(ctx, componentName) {
        var _this = _super.call(this, ctx, componentName) || this;
        // Overwrite the current start method
        var originalStart = _this.start;
        var ReactDOMPromise = import(
        /* webpackPrefetch: true, webpackChunkName: 'ReactDom' */ "react-dom").then(function (ReactDOM) { return ReactDOM.default || ReactDOM; });
        var configScript = ctx.querySelector("script[type='text/json']");
        _this.state = configScript ? JSON.parse(configScript.innerHTML) : {};
        var unmountComponentAtNode;
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
            var renderAppPromise = originalStartPromise
                .then(function () { return Promise.all([ReactDOMPromise, _this.App]); })
                .then(function (_a) {
                var ReactDOM = _a[0], App = _a[1];
                // Store unmountComponentAtNode for stopping the app
                unmountComponentAtNode = ReactDOM.unmountComponentAtNode;
                // Store unwrapped promise for this.App
                if (App && isPromise(_this.App)) {
                    GondelReactComponent.AppPromiseMap.set(_this.App, App);
                }
                // Render only if the app was not stopped
                _this._stopped ||
                    ReactDOM.render(createRenderableAppWrapper({
                        children: _this.render.bind(_this),
                        onHasState: function (setInternalState) {
                            _this._setInternalState = setInternalState;
                        },
                        componentWillUnmount: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            delete _this._setInternalState;
                            _this.componentWillUnmount && _this.componentWillUnmount.apply(_this, args);
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
        // Make sure that the stop method will tear down the react app
        var originalStop = _this.stop;
        _this.stop = function () {
            var returnValue = originalStop && originalStop.apply(this, arguments);
            // check if during this components start method unmountComponentAtNode
            // was set - if not we don't need to unmound the app
            if (unmountComponentAtNode) {
                unmountComponentAtNode(this._ctx);
            }
            return returnValue;
        };
        return _this;
    }
    GondelReactComponent.prototype.setState = function (state) {
        this.state = Object.assign({}, this.state, state);
        // Handover the state to react
        // if the component was already rendered
        if (this._setInternalState) {
            this._setInternalState(this.state);
        }
    };
    GondelReactComponent.prototype.render = function () {
        // If this App is a promise use the AppPromiseMap to extract the resolved promise value
        var App = isPromise(this.App) ? GondelReactComponent.AppPromiseMap.get(this.App) : this.App;
        if (!App) {
            throw new Error(this._componentName + " could not render " + ("App" in this
                ? "ensure that you are returning a React component"
                : "please add a render method"));
        }
        return createElement(App, this.state);
    };
    GondelReactComponent.AppPromiseMap = new WeakMap();
    /**
     * Create a GondelReactComponent class which is directly linked with a loader
     */
    GondelReactComponent.create = createGondelReactLoader;
    return GondelReactComponent;
}(GondelBaseComponent));
export { GondelReactComponent };
//# sourceMappingURL=GondelReactComponent.js.map