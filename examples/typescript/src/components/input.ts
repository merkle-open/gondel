import { Component, EventListener, GondelBaseComponent, triggerPublicEvent } from "@gondel/core";

@Component("Input")
export class Input extends GondelBaseComponent {
  _ctx: HTMLInputElement;

  @EventListener("input")
  _handleInput() {
    triggerPublicEvent("gInput", this);
  }

  setValue(newValue: string) {
    this._ctx.value = newValue;
  }

  getValue() {
    return this._ctx.value;
  }
}
