import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

@Component('ButtonUi')
class ButtonUi extends GondelBaseComponent {

  @EventListener('mouseover')
  _handleMouseOver(event) {
    this._ctx.style.border = '1px solid orange';
  }

  @EventListener('mouseout')
  _handleMouseOut(event) {
    this._ctx.style.border = '';
  }

}

export default ButtonUi;
