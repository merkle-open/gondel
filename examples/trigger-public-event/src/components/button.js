import {Component, EventListener, GondelBaseComponent, triggerPublicEvent} from '@gondel/core';

@Component('Button')
class Button extends GondelBaseComponent {

  @EventListener('click')
  _handleButtonClick(ev) {
    const eventData = { backgroundColor: 'lightblue' };
    triggerPublicEvent('gButtonClick', this, document.getElementsByClassName('js-list'), eventData);
  }
}

export default Button;
