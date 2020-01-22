import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { Calculator } from "./calculator.component";
import { GondelStateProvider } from "@gondel/plugin-angular/dist/GondelConfigurationProvider";

@NgModule({
  imports: [CommonModule, BrowserModule],
  declarations: [Calculator],
  providers: [GondelStateProvider],
  bootstrap: [Calculator]
})
export class CalculatorModule {}
