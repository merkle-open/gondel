import {
  Component,
  EventListener,
  getComponentByDomNode,
  GondelBaseComponent,
  hasMountedGondelComponent
} from '@gondel/core';

@Component('Controller')
class Controller extends GondelBaseComponent {
  counter = 0;

  sync() {
    const listElement = document.querySelector('.js-list');

    if (hasMountedGondelComponent(listElement)) {
      this.list = getComponentByDomNode(listElement);
    } else {
      console.warn(`Component list has not been found`);

      return false;
    }
  }

  @EventListener('click', '.js-button')
  _handleButtonClick() {
    this.counter++;
    this.list.addItem(`List item ${this.counter}`);
  }
}

export default Controller;
