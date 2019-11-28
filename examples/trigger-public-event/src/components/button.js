import {Component, EventListener, GondelBaseComponent, triggerPublicEvent} from '@gondel/core';

@Component('ColorPicker')
class ColorPicker extends GondelBaseComponent {

  @EventListener('click', '.js-button')
  _handleButtonClick() {
    const inputField = document.querySelector('.js-input');
    const eventData = { color: inputField.value };

    triggerPublicEvent('gButtonClick', this, document.getElementsByClassName('js-list'), eventData);
  }
}

export default ColorPicker;
