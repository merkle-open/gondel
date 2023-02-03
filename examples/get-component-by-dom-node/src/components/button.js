import {Component, GondelBaseComponent, EventListener, getComponentByDomNode, hasMountedGondelComponent} from '@gondel/core';

@Component('Button')
class Button extends GondelBaseComponent {
  @EventListener('click')
  _handleButtonClick(ev) {
    const listElement = document.querySelector('[data-g-name="List"]');

    if (hasMountedGondelComponent(listElement)) {
      const list = getComponentByDomNode(listElement);

      list.appendContent();
    } else {
      console.warn('Component list has not been found');

      return false;
    }
  }
}

export default Button;
