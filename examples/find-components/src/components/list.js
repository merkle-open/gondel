import {Component, GondelBaseComponent, findComponents} from '@gondel/core';

@Component('List')
class List extends GondelBaseComponent {

  addItem = (text) => {
    const paragraph = document.createElement("li");
    const content = document.createTextNode(text);
    paragraph.appendChild(content);

    this._ctx.appendChild(paragraph);
  }
}

export default List
