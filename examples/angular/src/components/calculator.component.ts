import { Component, Inject } from "@angular/core";
import { ToolState, ToolStateProvider } from "./tool.const";

@Component({
  template: require("./calculator.component.html").default
})
export class Calculator {
  public title: string = "";

  constructor(@Inject(ToolStateProvider) state: ToolState) {
    this.title = state.title;
  }
}
