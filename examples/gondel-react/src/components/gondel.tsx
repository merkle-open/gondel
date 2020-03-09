import { Component, EventListener, GondelBaseComponent, findComponents } from "@gondel/core";
import { GondelReactWidget } from "./gondel-react";

@Component("Gondel")
class Gondel extends GondelBaseComponent {

  @EventListener("click", ".js-button")
  _handleInput() {
    const gondelReactComponent = findComponents<GondelReactWidget>(
      this._ctx,
      "GondelReactWidget"
    )[0];
    gondelReactComponent.setTitle(this.getInputValue());
  }

  getInputValue() {
    const input = this._ctx.querySelector<HTMLInputElement>(".js-input")!;
    return input.value;
  }
}

export { Gondel };
