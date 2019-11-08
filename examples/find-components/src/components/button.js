import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

@Component('Button')
class Button extends GondelBaseComponent {
  fnCallbacks = [];

  registerCallback(fnCallback) {
    this.fnCallbacks.push(fnCallback);
  }

  removeCallback(fnCallback) {
    const index = this.fnCallbacks.indexOf(fnCallback);

    if (index >= 0) {
      this.fnCallbacks.splice(index, 1);
    }
  }

  @EventListener('click')
  _handleButtonClick(ev) {
    for (const fnCallback of this.fnCallbacks) {
      fnCallback();
    }
  }
}

export default Button;
