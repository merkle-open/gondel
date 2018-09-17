import { Component } from "@gondel/core";
import { GondelReactComponent } from "@gondel/plugin-react";
import React from 'react';
import {App}from './DemoApp';


@Component("DemoApp")
export class DemoApp extends GondelReactComponent<{ title: string }> {

  render() {
    return <App {...this.state} />;
  }

  setTitle(newTitle: string) {
    this.setState({title: newTitle});
  }
}
