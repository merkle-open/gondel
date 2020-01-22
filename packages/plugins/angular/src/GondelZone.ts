import { NgZone, EventEmitter } from "@angular/core";

export class GondelZone implements NgZone {
  readonly hasPendingMicrotasks: boolean = false;
  readonly hasPendingMacrotasks: boolean = false;
  readonly isStable: boolean = true;
  readonly onUnstable: EventEmitter<any> = new EventEmitter();
  readonly onMicrotaskEmpty: EventEmitter<any> = new EventEmitter();
  readonly onStable: EventEmitter<any> = new EventEmitter();
  readonly onError: EventEmitter<any> = new EventEmitter();
  run(fn: () => any): any {
    return fn();
  }
  runGuarded(fn: () => any): any {
    return fn();
  }
  runOutsideAngular(fn: () => any): any {
    return fn();
  }
  runTask<T>(fn: () => any): any {
    return fn();
  }
}
