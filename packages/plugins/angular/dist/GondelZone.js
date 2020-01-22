import { EventEmitter } from '@angular/core';
var GondelZone = /** @class */ (function () {
    function GondelZone() {
        this.hasPendingMicrotasks = false;
        this.hasPendingMacrotasks = false;
        this.isStable = true;
        this.onUnstable = new EventEmitter();
        this.onMicrotaskEmpty = new EventEmitter();
        this.onStable = new EventEmitter();
        this.onError = new EventEmitter();
    }
    GondelZone.prototype.run = function (fn) { return fn(); };
    GondelZone.prototype.runGuarded = function (fn) { return fn(); };
    GondelZone.prototype.runOutsideAngular = function (fn) { return fn(); };
    GondelZone.prototype.runTask = function (fn) { return fn(); };
    return GondelZone;
}());
export { GondelZone };
//# sourceMappingURL=GondelZone.js.map