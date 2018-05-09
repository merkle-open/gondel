import { startComponents, stopComponents } from '@gondel/core';
import React from 'react';
import './button';

export default class Button extends React.Component {

  componentDidMount() {
    startComponents(this.gondelComponent);
  }

  componentWillUnmount() {
    stopComponents(this.gondelComponent);
  }

  render() {
    return (
      <button onClick={this.props.onClick} ref={(element) => { this.gondelComponent = element; }} data-g-name="Button">
        <span>{this.props.children}</span>
      </button>
    );
  }
}