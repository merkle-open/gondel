import { startComponents, stopComponents } from "@gondel/core";
import React from "react";
import "./button";

interface IButtonProps {
  onClick: (event: MouseEvent) => void;
  children: any;
}

export default class Button extends React.Component<IButtonProps> {
  private ref: HTMLButtonElement;

  componentDidMount() {
    startComponents(this.ref);
  }

  componentWillUnmount() {
    stopComponents(this.ref);
  }

  render() {
    return (
      <button
        onClick={this.props.onClick as any}
        ref={(ref: HTMLButtonElement) => {
          this.ref = ref;
        }}
        data-g-name="Button"
      >
        <span>{this.props.children}</span>
      </button>
    );
  }
}
