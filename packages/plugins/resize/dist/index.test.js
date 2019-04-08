var _this = this;
import * as tslib_1 from "tslib";
import { GondelBaseComponent, startComponents, stopComponents, getComponentByDomNode, Component, EventListener, disableAutoStart } from "@gondel/core";
import { initResizePlugin, WINDOW_RESIZED_EVENT, COMPONENT_RESIZED_EVENT } from "./index";
// mock clientWidth and clientHeight, see https://github.com/jsdom/jsdom/issues/2342
Object.defineProperty(window.HTMLElement.prototype, "clientWidth", {
    get: function () {
        return this._jsdomMockClientWidth || 0;
    }
});
Object.defineProperty(window.HTMLElement.prototype, "clientHeight", {
    get: function () {
        return this._jsdomMockClientHeight || 0;
    }
});
function setMockClientWidthAndHeight(component, width, height) {
    component._jsdomMockClientWidth = width;
    component._jsdomMockClientHeight = height;
}
function resize(width, height) {
    // Simulate window resize event
    var resizeEvent = document.createEvent("Event");
    resizeEvent.initEvent("resize", true, true);
    window.innerWidth = width || window.innerWidth;
    window.innerHeight = height || window.innerHeight;
    window.dispatchEvent(resizeEvent);
}
var ResizeComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ResizeComponent, _super);
    function ResizeComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._windowResizedEventReceived = 0;
        _this._componentResizedEventReceived = 0;
        return _this;
    }
    ResizeComponent.prototype.getWindowResizeEventReceived = function () {
        return this._windowResizedEventReceived;
    };
    ResizeComponent.prototype.getComponentResizeEventReceived = function () {
        return this._componentResizedEventReceived;
    };
    ResizeComponent.prototype._handleWindowResizeEvent = function () {
        this._windowResizedEventReceived++;
    };
    ResizeComponent.prototype._handleComponentResizeEvent = function () {
        this._componentResizedEventReceived++;
    };
    tslib_1.__decorate([
        EventListener(WINDOW_RESIZED_EVENT),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], ResizeComponent.prototype, "_handleWindowResizeEvent", null);
    tslib_1.__decorate([
        EventListener(COMPONENT_RESIZED_EVENT),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], ResizeComponent.prototype, "_handleComponentResizeEvent", null);
    ResizeComponent = tslib_1.__decorate([
        Component("ResizeComponent")
    ], ResizeComponent);
    return ResizeComponent;
}(GondelBaseComponent));
var gondelDivElement;
var gondelInstance;
describe("GondelResizePlugin", function () {
    beforeEach(function () {
        disableAutoStart();
        var mockElementWrapper = document.createElement("div");
        mockElementWrapper.innerHTML = "<div data-g-name=\"ResizeComponent\"><p>This is a container being resized</p></div>";
        gondelDivElement = mockElementWrapper.firstElementChild;
        document.body.appendChild(gondelDivElement);
        initResizePlugin();
        startComponents(gondelDivElement);
        gondelInstance = getComponentByDomNode(gondelDivElement);
    });
    afterEach(function () {
        stopComponents();
        document.body.innerHTML = "";
    });
    it("should have registered a gondel resize window event", function () {
        expect(window["__🚡DomEvents"].g).toHaveProperty(WINDOW_RESIZED_EVENT);
    });
    it("should have registered a gondel resize component event", function () {
        expect(window["__🚡DomEvents"].g).toHaveProperty(COMPONENT_RESIZED_EVENT);
    });
    it("should receive no window resized event without resize", function () {
        expect(gondelInstance.getWindowResizeEventReceived()).toBe(0);
    });
    it("should receive no component resized event without resize", function () {
        expect(gondelInstance.getComponentResizeEventReceived()).toBe(0);
    });
    it("should receive an window resized event upon resize", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resize(1200, 600);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 1:
                    _a.sent();
                    expect(gondelInstance.getWindowResizeEventReceived()).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should receive no component resized event when component dimensions did not change", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resize(1200, 400);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 1:
                    _a.sent();
                    expect(gondelInstance.getComponentResizeEventReceived()).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should receive a component resized event when component dimensions did change", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setMockClientWidthAndHeight(gondelDivElement, 1400, 600);
                    resize(1400, 600);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 1:
                    _a.sent();
                    expect(gondelInstance.getComponentResizeEventReceived()).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should receive two component resize events when firing resize two times", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // we need to set the initial dimensions as they are 0 when the resize plugin get's initialized
                    setMockClientWidthAndHeight(gondelDivElement, 1400, 600);
                    // first resize event get's executed right away
                    resize(1400, 600);
                    setMockClientWidthAndHeight(gondelDivElement, 1300, 500);
                    resize(1300, 500);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 1:
                    _a.sent();
                    expect(gondelInstance.getComponentResizeEventReceived()).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should should throttle more than 2 resize events being fired", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // we need to set the initial dimensions as they are 0 when the resize plugin get's initialized
                    setMockClientWidthAndHeight(gondelDivElement, 1400, 600);
                    // first resize event get's executed right away
                    resize(1400, 600);
                    setMockClientWidthAndHeight(gondelDivElement, 1300, 500);
                    // second resize get's stored for requestAnimationFrame
                    resize(1300, 500);
                    // further resize events get neglected
                    setMockClientWidthAndHeight(gondelDivElement, 1200, 400);
                    resize(1200, 400);
                    setMockClientWidthAndHeight(gondelDivElement, 1100, 300);
                    resize(1100, 300);
                    setMockClientWidthAndHeight(gondelDivElement, 1000, 200);
                    resize(1000, 200);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 1:
                    _a.sent();
                    expect(gondelInstance.getComponentResizeEventReceived()).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should should reset throttling after requestAnimationFrame time duration", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // we need to set the initial dimensions as they are 0 when the resize plugin get's initialized
                    setMockClientWidthAndHeight(gondelDivElement, 1400, 600);
                    // first resize event get's executed right away
                    resize(1400, 600);
                    setMockClientWidthAndHeight(gondelDivElement, 1300, 500);
                    resize(1300, 500);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 20); })];
                case 1:
                    _a.sent();
                    setMockClientWidthAndHeight(gondelDivElement, 1200, 400);
                    resize(1200, 400);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 20); })];
                case 2:
                    _a.sent();
                    setMockClientWidthAndHeight(gondelDivElement, 1100, 300);
                    resize(1100, 300);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 20); })];
                case 3:
                    _a.sent();
                    setMockClientWidthAndHeight(gondelDivElement, 1000, 200);
                    resize(1000, 200);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 4:
                    _a.sent();
                    expect(gondelInstance.getComponentResizeEventReceived()).toBe(5);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should should reset component information after 250ms time duration", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // we need to set the initial dimensions as they are 0 when the resize plugin get's initialized
                    setMockClientWidthAndHeight(gondelDivElement, 1400, 600);
                    // first resize event get's executed right away
                    resize(1400, 600);
                    setMockClientWidthAndHeight(gondelDivElement, 1300, 500);
                    resize(1300, 500);
                    // after 250ms, the resize event is being considered completed and component information get reset
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    // after 250ms, the resize event is being considered completed and component information get reset
                    _a.sent();
                    // resetting __resizeSize forces to set width / height to 0 during startResizeWatching and
                    // therefore being different than previous dimensions
                    gondelInstance.__resizeSize = undefined;
                    // next resize event get's treated as fresh resize and therefor also triggers component resize event
                    resize(1200, 400);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 2:
                    _a.sent();
                    expect(gondelInstance.getComponentResizeEventReceived()).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=index.test.js.map