import { Component, GondelBaseComponent, EventListener } from "@gondel/core";
import React from 'react';

@Component()
export class DemoButton extends GondelBaseComponent {
  public static componentName = "DemoButton";

  someDemoValue = 'Hey there!';

  @EventListener('click')
  _handleClick(ev) {
    alert('Hello from the DemoButton Gondel Component');
  }

  _handleClickFromReact() {
    alert('Hello from the DemoButton Component triggered by React');
  }
}
