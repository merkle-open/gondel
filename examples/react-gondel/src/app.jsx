import * as React from 'react';
import {Component} from 'react';
import ButtonReact from './components/button-react';
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { counter: 0 }
  }

  handleClick = () => {
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    return <div>
      <ButtonReact onClick={this.handleClick}>Button 1</ButtonReact>
      {this.state.counter % 2 ? <ButtonReact>Button 2</ButtonReact> : null}
    </div>
  }
}
