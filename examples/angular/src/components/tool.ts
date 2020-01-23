import { Component } from "@gondel/core";
import {
  GondelAngularComponent,
  createGondelComponentProvider,
  createStateProvider
} from "@gondel/plugin-angular";

export interface ToolState {
  title: string;
}

export const ToolStateProvider = createStateProvider<ToolState>("toolState");
export const ToolComponentRef = createGondelComponentProvider<Tool>();

@Component("Tool")
export class Tool extends GondelAngularComponent<ToolState> {
  AppModule = import("./calculator.module").then(mod => mod.CalculatorModule);
  StateProvider = ToolStateProvider;
  GondelComponentProvider = ToolComponentRef;

  // will be triggered by angular directly
  public sendMessage(message: string) {
    alert(`Gondel: ${message}`);
  }
}
