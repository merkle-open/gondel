import { Component } from "@gondel/core";
import { GondelReactComponent } from "@gondel/plugin-react";
import React from "react";
import { App } from "./App";

@Component("DemoApp")
class DemoApp extends GondelReactComponent<{ title: string }> {
  render() {
    return <App {...this.state} />;
  }

  setTitle(newTitle: string) {
    this.setState({ title: newTitle });
  }
}

export { DemoApp };
