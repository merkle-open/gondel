import { Component } from "@gondel/core";
import { GondelAngularComponent } from "@gondel/plugin-angular";

@Component("Tool")
export class Tool extends GondelAngularComponent<any> {
  AppModule = import("./calculator.module").then(mod => mod.CalculatorModule);
}
