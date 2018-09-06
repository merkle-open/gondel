import * as tslib_1 from "tslib";
/**
 * This plugin provides utils for Gondel jQuery integrations
 */
import { GondelBaseComponent } from "@gondel/core";
import $ from "jquery";
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
        tslib_1.__extends(WithJquery, _super);
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
class MyComponent extends GondelJqueyComponent {
  start() {
    console.log(this.$ctx);
  }
}
   ```
 */
export var GondelJqueyComponent = gondelJQueryMixin(GondelBaseComponent);
//# sourceMappingURL=index.js.map