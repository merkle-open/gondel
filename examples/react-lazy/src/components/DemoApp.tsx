import * as React from 'react';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import 'react-awesome-button/dist/themes/theme-blue.css';

type Props = {
  title: string
}

export class App extends React.Component<Props, {}> {
  onClickButtonNative() {
    console.log('events can also be attached on the node itself');
  }

  render() {
    return (
      <React.Fragment>
        <AwesomeButton type="primary">{this.props.title}</AwesomeButton>
      </React.Fragment>
    )
  }

}
