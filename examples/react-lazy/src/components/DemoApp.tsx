import React, { Fragment, Component } from 'react';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import 'react-awesome-button/dist/themes/theme-blue.css';
import { getComponentByDomNode, startComponents } from '@gondel/core';
import { DemoButton } from './demo-button';

type Props = {
  title: string
}

export class App extends React.Component<Props, {}> {
  private buttonRef: Element;
  private buttonComponent: DemoButton;

  componentDidMount() {
    startComponents(this.buttonRef);
    this.buttonComponent = getComponentByDomNode<DemoButton>(this.buttonRef)!;
    this.buttonComponent._ctx.addEventListener('click', this.onClickButtonNative);
  }

  onClickButtonNative() {
    console.log('events can also be attached on the node itself');
  }

  onClickButton() {
    this.buttonComponent._handleClickFromReact();
  }

  render() {
    return (
      <Fragment>
        <AwesomeButton type="primary">{this.props.title}</AwesomeButton>
        {/* FIXME: update ref with React.createRef() in newer version! */}
        <button
          data-g-name="DemoButton"
          onClick={this.onClickButton.bind(this)}
          ref={(node: HTMLButtonElement) => this.buttonRef = node}>
          Press me! <small>{this.props.title}</small>
        </button>
      </Fragment>
    )
  }

}
