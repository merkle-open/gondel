import {Component, EventListener, GondelBaseComponent} from '@gondel/core';
import { WINDOW_RESIZED } from '@gondel/plugin-resize';

@Component('Resize')
export class Resize extends GondelBaseComponent {

  @EventListener(WINDOW_RESIZED)
  _handleWindowResizeEvent(e, dimension) {
    this._ctx.style.height = `${dimension.width}px`;
    this._ctx.innerHTML = `height resized to ${dimension.width}px`;
  }

};
