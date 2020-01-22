import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GondelStateProvider } from "./GondelConfigurationProvider";

@NgModule({
  imports: [CommonModule],
  declarations: [GondelStateProvider]
})
export class GondelModule {}
