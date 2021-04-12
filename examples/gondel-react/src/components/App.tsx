import React from 'react';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import 'react-awesome-button/dist/themes/theme-blue.css';

type Props = {
	title: string;
};

export const ReactApp = (props: Props) => {
	return <AwesomeButton type="primary">{props.title}</AwesomeButton>;
};
