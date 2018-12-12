import {Component, EventListener, GondelBaseComponent} from '@gondel/core';
import { ResizeEvents } from '@gondel/plugin-resize';

@Component('Resize')
export class WindowResize extends GondelBaseComponent {

  @EventListener(ResizeEvents.Window)
  _handleWindowResizeEvent(e, dimension) {
    this._ctx.style.height = `${dimension.width}px`;
    this._ctx.innerHTML = `height resized to ${dimension.width}px`;
  }

};
