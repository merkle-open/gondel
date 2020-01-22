import { Component } from "@angular/core";
import { GondelStateProvider } from "@gondel/plugin-angular/dist/GondelConfigurationProvider";

@Component({
  template: "<p>calculator rendered by angular</p>"
})
export class Calculator {
  constructor(private state: GondelStateProvider<any>) {
    console.log("state", state);
  }
}
