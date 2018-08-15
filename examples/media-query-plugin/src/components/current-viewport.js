import {Component, EventListener, GondelBaseComponent} from '@gondel/core';
import {getCurrentViewport, VIEWPORT_ENTERED} from '@gondel/plugin-media-queries';

@Component('CurrentViewport')
export class CurrentViewport extends GondelBaseComponent {

  start() {
    this._ctx.innerHTML = getCurrentViewport();
  }

  @EventListener(VIEWPORT_ENTERED) 
  _handleViewportChanged(event) {
    this._ctx.innerHTML = event.viewport;
  }

};
