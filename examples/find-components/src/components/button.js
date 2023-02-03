import { Component, GondelBaseComponent } from '@gondel/core';

@Component('Button')
class Button extends GondelBaseComponent {
  setIsEnabled(isEnabled) {
    if (isEnabled) {
      this._ctx.removeAttribute('disabled');
    } else {
      this._ctx.setAttribute('disabled', '');
    }
  }
}

export default Button;
