import {Component, GondelBaseComponent, findComponents} from '@gondel/core';

@Component('List')
class List extends GondelBaseComponent {

  start() {
    this.list = document.createElement("ul");
    this.list.classList.add('js-list');
    this._ctx.appendChild(this.list);

    const buttonComponents = findComponents(this._ctx, 'Button');

    if (buttonComponents.length > 0) {
      this.button = buttonComponents[0];
      this.button.registerCallback(this.buttonClickCallback);
    }
  }

  stop() {
    this.button.removeCallback(this.buttonClickCallback);
  }

  buttonClickCallback = () => {
    const paragraph = document.createElement("li");
    const content = document.createTextNode("New element appended");
    paragraph.appendChild(content);

    this.list.appendChild(paragraph);
  }
}

export default List
