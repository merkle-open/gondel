// @ts-nocheck
import { Component, Input, AfterViewInit } from '@angular/core';
import { GondelStateProvider } from '../src/GondelConfigurationProvider';

@Component({
  selector: 'app-example',
  template: '<h1>Hello {{title}}!</h1>'
})
export class ExampleComponent implements AfterViewInit {
  @Input() title = 'World';

  // constructor(private state: GondelStateProvider<any>) {}

  ngAfterViewInit() {
    this.title += '(after view init)';
  }
}
