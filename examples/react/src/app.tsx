import * as React from "react";
import Button from "./button-react";
import GondelButton from "./button";
import {
  isComponentMounted,
  findComponents,
  getComponentByDomNode,
  startComponents
} from "@gondel/core";

interface IAppProps {}

interface IAppState {
  counter: number;
}

export default class App extends React.Component<IAppProps, IAppState> {
  private ref: HTMLButtonElement;
  private button: GondelButton;

  state: IAppState = { counter: 0 };

  componentDidMount() {
    // start button component
    startComponents(this.ref);

    // Get all Buttons by the class itself (inside the current namespace)
    const buttons = findComponents(document.documentElement, GondelButton);
    buttons.map((button: GondelButton, index: number) => {
      console.log(`Found Button ${index + 1}/${buttons.length} =>`, button._ctx);
    });

    // this can be inverted to check the method
    if (!isComponentMounted(this.ref)) {
      return console.warn("Oops, button not found in the DOM >.<");
    }

    // Gets the button gondel component instance by a node
    this.button = getComponentByDomNode<GondelButton>(this.ref);

    // Methods in a gondel component can be triggered like this
    this.button._ctx.addEventListener("click", () =>
      this.button._handleClickFromReact(this.state.counter)
    );
  }

  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1
    });
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleClick}>Button 1</Button>
        <button data-g-name="Button" ref={(ref: HTMLButtonElement) => (this.ref = ref)}>
          Button 2
        </button>
        {this.state.counter % 2 ? <Button onClick={() => {}}>Button 3</Button> : null}
      </div>
    );
  }
}
