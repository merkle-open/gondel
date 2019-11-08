import { Component } from "@gondel/core";
import { GondelReactComponent } from "@gondel/plugin-react";
import React from "react";
import { ReactComponent } from "./App";

@Component("GondelReact")
class GondelReact extends GondelReactComponent<{ title: string }> {
  render() {
    return <ReactComponent {...this.state} />;
  }

  setTitle(newTitle: string) {
    this.setState({ title: newTitle });
  }
}

export { GondelReact };
