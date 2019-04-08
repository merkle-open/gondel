import {Component, EventListener, GondelBaseComponent} from '@gondel/core';
import { COMPONENT_RESIZED_EVENT } from '@gondel/plugin-resize';

@Component('Resize')
export class ComponentResize extends GondelBaseComponent {

  @EventListener(COMPONENT_RESIZED_EVENT)
  _handleComponentResizeEvent(e, dimension) {
    this._ctx.style.height = `${dimension.width}px`;
    this._ctx.innerHTML = `height resized to ${dimension.width}px`;
  }
}
