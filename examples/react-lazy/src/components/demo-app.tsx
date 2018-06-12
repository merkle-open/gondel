import { Component } from "@gondel/core";
import { GondelReactComponent } from "@gondel/plugin-react";
import React from 'react';

@Component()
export class DemoApp extends GondelReactComponent<{ title: string }> {
  static componentName = 'DemoApp';

  App: React.ComponentClass;

  async start() {
    const {App} = await import(/* webpackChunkName: 'DemoApp' */'./DemoApp');
    this.App = App;
  }

  render() {
    const App = this.App;
    return <App {...this.state} />;
  }

  setTitle(newTitle: string) {
    this.setState({title: newTitle});
  }
}
