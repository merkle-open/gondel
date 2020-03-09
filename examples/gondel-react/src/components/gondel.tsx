import { Component, EventListener, GondelBaseComponent, findComponents } from "@gondel/core";
import { GondelReact } from "./gondel-react";

@Component("Gondel")
class Gondel extends GondelBaseComponent {
  @EventListener("click", ".js-button")
  _handleInput() {
    const inputField = document.getElementsByClassName("js-input")[0] as HTMLInputElement;

    const gondelReactComponent = findComponents<GondelReact>(this._ctx)[0];

    gondelReactComponent.setTitle(inputField.value);
  }
}

export { Gondel };
