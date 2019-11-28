import {Component, EventListener, GondelBaseComponent} from '@gondel/core';
import { WINDOW_RESIZED_EVENT } from '@gondel/plugin-resize';

@Component('WindowResize')
class WindowResize extends GondelBaseComponent {

  @EventListener(WINDOW_RESIZED_EVENT)
  _handleWindowResizeEvent() {
    this._ctx.innerHTML = `window has been resized to ${document.body.clientWidth} px`;
  }
}

 export default WindowResize;
