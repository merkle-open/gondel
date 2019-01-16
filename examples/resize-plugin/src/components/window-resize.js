import {Component, EventListener, GondelBaseComponent} from '@gondel/core';
import { WINDOW_RESIZED_EVENT } from '@gondel/plugin-resize';

@Component('Resize')
export class WindowResize extends GondelBaseComponent {

  @EventListener(WINDOW_RESIZED_EVENT)
  _handleWindowResizeEvent(e, dimension) {
    this._ctx.style.height = `${dimension.width}px`;
    this._ctx.innerHTML = `height resized to ${dimension.width}px`;
  }
}
