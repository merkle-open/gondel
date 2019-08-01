import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

@Component('Example')
export class Example extends GondelBaseComponent {
  start() {
    this._ctx.innerHTML = 'Hello from Gondel!';
  }
}
