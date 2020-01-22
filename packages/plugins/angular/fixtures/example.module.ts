// @ts-nocheck
import { NgModule } from '@angular/core';
import { ExampleComponent } from './example.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [BrowserModule],
  declarations: [ExampleComponent],
  bootstrap: [ExampleComponent]
})
export class ExampleModule { }
