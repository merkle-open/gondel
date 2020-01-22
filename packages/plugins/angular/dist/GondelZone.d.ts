import { NgZone, EventEmitter } from '@angular/core';
export declare class GondelZone implements NgZone {
    readonly hasPendingMicrotasks: boolean;
    readonly hasPendingMacrotasks: boolean;
    readonly isStable: boolean;
    readonly onUnstable: EventEmitter<any>;
    readonly onMicrotaskEmpty: EventEmitter<any>;
    readonly onStable: EventEmitter<any>;
    readonly onError: EventEmitter<any>;
    run(fn: () => any): any;
    runGuarded(fn: () => any): any;
    runOutsideAngular(fn: () => any): any;
    runTask<T>(fn: () => any): any;
}
