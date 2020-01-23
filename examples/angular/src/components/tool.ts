import { Component } from "@gondel/core";
import { GondelAngularComponent } from "@gondel/plugin-angular";
import { ToolState, ToolStateProvider } from "./tool.const";

@Component("Tool")
export class Tool extends GondelAngularComponent<ToolState> {
  AppModule = import("./calculator.module").then(mod => mod.CalculatorModule);
  StateProvider = ToolStateProvider;
}
