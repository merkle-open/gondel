import { Component, EventListener, findComponents, GondelBaseComponent } from "@gondel/core";

@Component("Form")
class Form extends GondelBaseComponent {
  @EventListener("submit")
  _handleSubmit(event) {
    alert("Submitted");
    event.preventDefault();
  }

  @EventListener("gInput")
  _handleChange() {
    const hasEmptyElements = this._getInputs().some(input => !input.getValue());
    this._getSubmitButton().setIsEnabled(!hasEmptyElements);
  }

  _getInputs() {
    return findComponents(this._ctx, "Input");
  }

  _getSubmitButton() {
    return findComponents(this._ctx, "Button")[0];
  }
}

export default Form;
