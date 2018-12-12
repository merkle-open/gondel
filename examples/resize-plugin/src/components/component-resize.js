import {Component, EventListener, GondelBaseComponent} from '@gondel/core';
import { ResizeEvents } from '@gondel/plugin-resize';

@Component('Resize')
export class ComponentResize extends GondelBaseComponent {

  @EventListener(ResizeEvents.Component)
  _handleComponentResizeEvent(e, dimension) {
    this._ctx.style.height = `${dimension.width}px`;
    this._ctx.innerHTML = `height resized to ${dimension.width}px`;
  }

};
