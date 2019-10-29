import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

@Component('Button')
class Button extends GondelBaseComponent {

  @EventListener('mouseover')
  _handleMouseOver(event) {
    this._ctx.style.border = '1px solid orange';
  }

  @EventListener('mouseout')
  _handleMouseOut(event) {
    this._ctx.style.border = '';
  }

};

export default Button;
