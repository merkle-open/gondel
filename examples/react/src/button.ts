import { Component, EventListener, GondelBaseComponent } from "@gondel/core";

@Component("Button")
export default class Button extends GondelBaseComponent {
  @EventListener("mouseover")
  _handleMouseOver() {
    this._ctx.style.border = "1px solid orange";
  }

  @EventListener("mouseout")
  _handleMouseOut() {
    this._ctx.style.border = "";
  }

  _handleClickFromReact(count: number = 0) {
    this._ctx.style.color = count % 2 === 0 ? "green" : "black";
    this._ctx.style.border = "1px solid green";
  }
}
