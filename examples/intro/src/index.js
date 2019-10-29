import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

@Component('Example')
class Example extends GondelBaseComponent {
  start() {
    this._ctx.innerHTML = 'Hello from Gondel!';
  }
}

export default Example;
