import {Component, EventListener, GondelBaseComponent} from '@gondel/core';
import { COMPONENT_RESIZED_EVENT } from '@gondel/plugin-resize';

@Component('ComponentResize')
class ComponentResize extends GondelBaseComponent {
  componentWidth;

  sync () {
    this.componentWidth = this._ctx.clientWidth;
  }

  @EventListener(COMPONENT_RESIZED_EVENT)
  _handleComponentResizeEvent(e, dimension) {
    this._ctx.style.height = `${dimension.width}px`;
    this._ctx.innerHTML = `height resized to component width of ${dimension.width}px`;
  }
}

export default ComponentResize;
