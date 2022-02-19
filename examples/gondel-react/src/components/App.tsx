import React from 'react';
// @ts-ignore
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

type Props = {
	title: string;
};

export const ReactApp = (props: Props) => {
	return <AwesomeButton type="primary">{props.title}</AwesomeButton>;
};
