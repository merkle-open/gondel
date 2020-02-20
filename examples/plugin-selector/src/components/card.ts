import { Component, GondelBaseComponent, EventListener } from "@gondel/core";
import { selector, ISelector } from "@gondel/plugin-selector";

export enum Selectors {
  ACTION = ".m-card__action",
  ACT_LABEL = ".m-card__action-text",
  COUNTER = ".m-card__text > span"
}

@Component("Card")
export class Card extends GondelBaseComponent {
  @selector(".m-card__action") actionButton: ISelector<HTMLButtonElement>;
  @selector(".m-card__action-text") actionLabel: ISelector<HTMLSpanElement>;
  @selector(".m-card__text > span") counter: ISelector<HTMLSpanElement>;

  @EventListener("click", ".m-card__action")
  public _handleActionClick(ev: any) {
    console.log("click -> button -> options", this.actionButton.options);
    console.log("click -> button -> selector", this.actionButton.selector);
    console.log("click -> counter -> first", this.counter.first);
    console.log("counter -> getInContext -> event target", this.counter.getInContext(ev.target));
    console.log(`counter to string -> ${this.counter}`);
  }
}
