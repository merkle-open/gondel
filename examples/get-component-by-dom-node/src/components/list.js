import {Component, EventListener, GondelBaseComponent, findComponents} from '@gondel/core';

@Component('List')
class List extends GondelBaseComponent {

  sync() {
    this.list = document.createElement("ul");
    this._ctx.appendChild(this.list);
  }

  appendContent() {
    const paragraph = document.createElement("li");
    const content = document.createTextNode("New element appended");
    paragraph.appendChild(content);

    this.list.appendChild(paragraph);
  }
}

export default List;
