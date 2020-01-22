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
import { GondelBaseComponent } from "@gondel/core";
import { NgZone, getPlatform } from '@angular/core';
import { isPromise } from "./utils";
import { loadAngularInternals } from './GondelAngularComponent.ng-loader';
import { GondelStateProvider } from './GondelConfigurationProvider';
var GondelAngularComponent = /** @class */ (function (_super) {
    __extends(GondelAngularComponent, _super);
    function GondelAngularComponent(ctx, componentName) {
        var _this = _super.call(this, ctx, componentName) || this;
        // Overwrite the current start method
        var originalStart = _this.start;
        var _a = loadAngularInternals(), Zone = _a.Zone, Compiler = _a.Compiler, PlatformBrowser = _a.PlatformBrowser, PlatformBrowserDynamic = _a.PlatformBrowserDynamic;
        var configScript = ctx.querySelector("script[type='text/json']");
        _this.state = configScript ? JSON.parse(configScript.innerHTML) : {};
        _this.stop = function () {
            if (!this.AppModule) {
                return;
            }
            var appModule = this.AppModule;
            var ngModuleRef = GondelAngularComponent.ModuleRefMap.get(appModule);
            if (ngModuleRef) {
                ngModuleRef.destroy();
                GondelAngularComponent.ModuleRefMap.delete(appModule);
            }
        };
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
                .then(function () { return Promise.all([
                _this.AppModule,
                // main JIT compileable platform
                PlatformBrowserDynamic,
                // required dependencies of dynamic platform
                PlatformBrowser,
                Compiler,
                Zone
            ]); })
                .then(function (_a) {
                var AppModule = _a[0], DynamicBoot = _a[1], Browser = _a[2];
                // Store unwrapped promise for this.App
                if (AppModule && isPromise(_this.AppModule)) {
                    GondelAngularComponent.AppPromiseMap.set(_this.AppModule, AppModule);
                }
                if (_this._stopped) {
                    return;
                }
                if (!AppModule) {
                    throw new Error("No valid application module available, found \"" + AppModule + "\"");
                }
                var zone = NgZone;
                var zoneIdentifier = "gondel:" + _this._componentName;
                /**
                 * This is a hack, since NgZone doesn't allow you to configure the property that identifies your zone.
                 * @see https://github.com/PlaceMe-SAS/single-spa-angular-cli/issues/33
                 * @see https://github.com/CanopyTax/single-spa-angular/issues/47
                 * @see https://github.com/CanopyTax/single-spa-angular/issues/47
                 * @see https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L144
                 * @see https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L257
                 */
                zone.isInAngularZone = function () {
                    // @ts-ignore
                    return window.Zone.current._properties[zoneIdentifier] === true;
                };
                // we need to ensure that we have at least one
                // <ng-component> tag inside our context so that
                // the AppModule can be bootstrapped correctly
                _this.ensureComponentTagInContext();
                DynamicBoot
                    .platformBrowserDynamic([{
                        provide: GondelStateProvider,
                        useValue: {
                            state: _this.state
                        }
                    }])
                    .bootstrapModule(AppModule)
                    .then(function (ref) {
                    console.log('Platform after boot', getPlatform());
                    var bootstrappedNgZone = ref.injector.get(NgZone);
                    _this.zone = bootstrappedNgZone;
                    bootstrappedNgZone._inner._properties[zoneIdentifier] = true;
                    GondelAngularComponent.ZoneMap.set(zoneIdentifier, bootstrappedNgZone);
                    GondelAngularComponent.ModuleRefMap.set(AppModule, ref);
                }).catch(function (err) {
                    console.error(err);
                    console.info('Platform:', getPlatform());
                });
            });
            return renderAppPromise;
        };
        return _this;
    }
    GondelAngularComponent.prototype.ensureComponentTagInContext = function () {
        if (this._ctx && this._ctx.innerHTML.indexOf('<ng-component') > -1) {
            return;
        }
        this._ctx.innerHTML += "<ng-component><ng-component>";
    };
    GondelAngularComponent.AppPromiseMap = new WeakMap();
    /**
     * Saving all NgModule references here, important
     * for updating or destroying apps
     */
    GondelAngularComponent.ModuleRefMap = new WeakMap();
    /**
     * The module ref zones, will be set after
     * each successful bootstrap process.
     */
    GondelAngularComponent.ZoneMap = new Map();
    return GondelAngularComponent;
}(GondelBaseComponent));
export { GondelAngularComponent };
//# sourceMappingURL=GondelAngularComponent.js.map