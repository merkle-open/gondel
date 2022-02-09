!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("jquery")):"function"==typeof define&&define.amd?define(["exports","jquery"],t):t((n="undefined"!=typeof globalThis?globalThis:n||self).gondelPluginJQuery={},n.$)}(this,(function(n,t){"use strict";function e(n){return n&&"object"==typeof n&&"default"in n?n:{default:n}}var o=e(t),r=function(n,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&(n[e]=t[e])},r(n,t)};
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */function u(n,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function e(){this.constructor=n}r(n,t),n.prototype=null===t?Object.create(t):(e.prototype=t.prototype,new e)}var i=window.__gondelPluginEvents||{pluginMapping:{},pluginEvents:{}};window.__gondelPluginEvents=i,i.pluginEvents,i.pluginMapping;var f=function(n){function t(t,e){var r=n.call(this,t,e)||this;return r.$ctx=o.default(t),r}return u(t,n),t}(function(){function n(n,t){}return n.prototype.stop=function(){},n}());n.GondelJqueryComponent=f,n.gondelJQueryMixin=function(n){return function(n){function t(t,e){var r=n.call(this,t,e)||this;return r.$ctx=o.default(t),r}return u(t,n),t}(n)},Object.defineProperty(n,"__esModule",{value:!0})}));
//# sourceMappingURL=index.es5.js.map
