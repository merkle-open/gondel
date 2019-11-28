import * as React from 'react';
import {Component} from 'react';
import Button from './components/button';
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
      <Button onClick={this.handleClick}>Button 1</Button>
      {this.state.counter % 2 ? <Button>Button 2</Button> : null}
    </div>
  }
}
