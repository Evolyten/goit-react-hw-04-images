import React from 'react';
import { Btn } from './ButtonStyled';
export default function Button({ incrementPage }) {
  return <Btn onClick={incrementPage}>Load more</Btn>;
}
