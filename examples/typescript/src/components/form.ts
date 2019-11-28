import { Component, EventListener, GondelBaseComponent, findComponents } from "@gondel/core";
import Button from "./button";
import Input from "./input";

@Component("Form")
class Form extends GondelBaseComponent {
  @EventListener("submit")
  _handleSubmit(event: UIEvent) {
    alert("Submitted");
    event.preventDefault();
  }

  @EventListener("gInput")
  _handleChange() {
    const hasEmptyElements = this._getInputs().some(input => !input.getValue());
    this._getSubmitButton().setIsEnabled(!hasEmptyElements);
  }

  _getInputs(): Array<Input> {
    return findComponents<Input>(this._ctx, "Input");
  }

  _getSubmitButton(): Button {
    return findComponents<Button>(this._ctx, "Button")[0];
  }
}

export default Form;
