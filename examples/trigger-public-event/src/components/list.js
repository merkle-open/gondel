import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

@Component('List')
class List extends GondelBaseComponent {

  setBackground(backgroundColor) {
    this._ctx.style.backgroundColor = backgroundColor;
  }

  @EventListener('gButtonClick')
  _buttonClickCallback(event) {
    this.setBackground(event.data.eventData.backgroundColor);
  }
}

export default List
