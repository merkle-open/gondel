import React from "react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import "react-awesome-button/dist/themes/theme-blue.css";

type Props = {
  title: string;
};

export class ReactApp extends React.Component<Props, {}> {
  render() {
    return <AwesomeButton type="primary">{this.props.title}</AwesomeButton>;
  }
}
