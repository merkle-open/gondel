import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { Calculator } from "./calculator.component";

@NgModule({
  imports: [CommonModule, BrowserModule],
  declarations: [Calculator],
  bootstrap: [Calculator]
})
export class CalculatorModule {}
