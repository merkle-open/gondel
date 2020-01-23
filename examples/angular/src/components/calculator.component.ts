import { Component, Inject, AfterViewInit } from "@angular/core";
import { Tool, ToolComponentRef, ToolStateProvider, ToolState } from "./tool";

@Component({
  template: require("./calculator.component.html").default
})
export class Calculator implements AfterViewInit {
  public title: string = "";

  constructor(
    @Inject(ToolStateProvider) state: ToolState,
    @Inject(ToolComponentRef) private ref: Tool
  ) {
    this.title = state.title;
  }

  ngAfterViewInit() {
    console.log("> ngAfterViewInit: Angular is ready!");
  }

  handleButtonClick() {
    this.ref.sendMessage("Angular button clicked!");
  }
}
