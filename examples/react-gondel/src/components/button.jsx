import { useGondelComponent } from '@gondel/plugin-react';
import React from 'react';
import './button-ui';

const ButtonReact = (props) => {
  const [ref] = useGondelComponent();
  return (
    <button onClick={props.onClick} ref={ref} data-g-name="ButtonUi">
      <span>{props.children}</span>
    </button>
  );
};

export default ButtonReact;
