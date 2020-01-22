import React from 'react';

export interface ITestAppProps { text: string }

export const TestApp = ({ text }: ITestAppProps) => <p>Hello, {text}!</p>;
