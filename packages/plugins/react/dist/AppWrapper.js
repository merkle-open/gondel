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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import React, { Component } from 'react';
var AppWrapper = /** @class */ (function (_super) {
    __extends(AppWrapper, _super);
    function AppWrapper(props) {
        var _this = _super.call(this, props) || this;
        _this.updateConfig = function (config) {
            _this.setState(config);
        };
        _this.state = props.config;
        // Forward react life cycle hooks
        [
            'componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'componentDidUpdate',
            'componentWillUnmount',
            'componentDidCatch',
        ].forEach(function (reactHook) {
            if (!_this.props[reactHook]) {
                return;
            }
            _this[reactHook] = function () {
                this.props[reactHook].apply(this, arguments);
            };
        });
        // Notify the Gondel component that the state can be set
        props.onHasState && props.onHasState(_this.updateConfig.bind(_this));
        return _this;
    }
    AppWrapper.prototype.render = function () {
        if (!this.props.children) {
            return null;
        }
        return this.props.children(this.state);
    };
    return AppWrapper;
}(Component));
export { AppWrapper };
export function createRenderAbleAppWrapper(props) {
    return React.createElement(AppWrapper, __assign({}, props));
}
//# sourceMappingURL=AppWrapper.js.map