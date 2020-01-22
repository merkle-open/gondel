var resolveDefaultOrModule = function (mod) { return (mod.default || mod); };
/**
 * Loading the angular required dependencies async
 */
export var loadAngularInternals = function () {
    var Zone = import(
    // @ts-ignore
    /* webpackPrefetch: true, webpackChunkName: 'zone' */ 'zone.js/dist/zone.js');
    var Compiler = import(
    /* webpackPrefetch: true, webpackChunkName: 'ng-compiler' */ '@angular/compiler').then(resolveDefaultOrModule);
    var PlatformBrowser = import(
    /* webpackPrefetch: true, webpackChunkName: 'ng-platform-browser' */ "@angular/platform-browser").then(resolveDefaultOrModule);
    var PlatformBrowserDynamic = import(
    /* webpackPrefetch: true, webpackChunkName: 'ng-platform-browser-dynamic' */ "@angular/platform-browser-dynamic").then(resolveDefaultOrModule);
    return {
        Compiler: Compiler,
        PlatformBrowser: PlatformBrowser,
        PlatformBrowserDynamic: PlatformBrowserDynamic,
        Zone: Zone
    };
};
//# sourceMappingURL=GondelAngularComponent.ng-loader.js.map