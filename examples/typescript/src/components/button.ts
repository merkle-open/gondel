import { Component, GondelBaseComponent } from "@gondel/core";

@Component("Button")
export class Button extends GondelBaseComponent {
  start() {
    console.log("started");
  }
  setIsEnabled(isEnabled) {
    if (isEnabled) {
      this._ctx.removeAttribute("disabled");
    } else {
      this._ctx.setAttribute("disabled", "");
    }
  }
}
