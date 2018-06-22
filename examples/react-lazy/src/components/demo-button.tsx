import { Component, GondelBaseComponent, EventListener } from "@gondel/core";
import React from 'react';

@Component("DemoButton")
export class DemoButton extends GondelBaseComponent {
  someDemoValue = 'Hey there!';

  @EventListener('click')
  _handleClick(ev) {
    alert('Hello from the DemoButton Gondel Component');
  }
}
