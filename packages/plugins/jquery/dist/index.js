import { __extends } from "tslib";
/**
 * This plugin provides utils for Gondel jQuery integrations
 */
import { GondelBaseComponent } from '@gondel/core';
import $ from 'jquery';
/**
 * Class mixin https://basarat.gitbooks.io/typescript/docs/types/mixins.html
 * Usage:
   ```
class MyComponent extends gondelJQueryMixin(GondelBaseComponent) {
  start() {
    console.log(this.$ctx);
  }
}
   ```
 */
export function gondelJQueryMixin(BaseClass) {
    var WithJquery = /** @class */ (function (_super) {
        __extends(WithJquery, _super);
        function WithJquery(ctx, componentName) {
            var _this = _super.call(this, ctx, componentName) || this;
            _this.$ctx = $(ctx);
            return _this;
        }
        return WithJquery;
    }(BaseClass));
    return WithJquery;
}
/**
 * BaseComponent with JqueryMixin
  * Usage:
   ```
class MyComponent extends GondelJqueryComponent {
  start() {
    console.log(this.$ctx);
  }
}
   ```
 */
var GondelJqueryComponent = /** @class */ (function (_super) {
    __extends(GondelJqueryComponent, _super);
    function GondelJqueryComponent(ctx, componentName) {
        var _this = _super.call(this, ctx, componentName) || this;
        _this.$ctx = $(ctx);
        return _this;
    }
    return GondelJqueryComponent;
}(GondelBaseComponent));
export { GondelJqueryComponent };
//# sourceMappingURL=index.js.map