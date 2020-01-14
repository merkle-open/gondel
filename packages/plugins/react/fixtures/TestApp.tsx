import React, { StatelessComponent } from 'react';

export const TestApp: StatelessComponent<Readonly<{ text: string }>> = ({ text }) => <p>Hello, {text}!</p>;
