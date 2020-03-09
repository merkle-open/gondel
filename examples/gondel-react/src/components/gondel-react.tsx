import { Component } from "@gondel/core";
import { GondelReactComponent } from "@gondel/plugin-react";
import React from "react";

const loader = async () => import("./App");

@Component("GondelReact")
class GondelReact extends GondelReactComponent.create(loader, "ReactApp") {
  setTitle(newTitle: string) {
    this.setState({ title: newTitle });
  }
}

export { GondelReact };
