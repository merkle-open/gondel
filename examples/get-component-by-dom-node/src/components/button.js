import {Component, GondelBaseComponent, EventListener, getComponentByDomNode, hasMountedGondelComponent} from '@gondel/core';

@Component('Button')
class Button extends GondelBaseComponent {
  @EventListener('click')
  _handleButtonClick(ev) {
    const node = document.getElementsByClassName('js-list');

    if (hasMountedGondelComponent(node)) {
      const list = getComponentByDomNode(document.getElementsByClassName('js-list'));

      list.appendContent();
    } else {
      return console.warn(`Component list has not been found`);
    }
  }
}

export default Button;
