import React, { useState, Component, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Wrap, BackDrop, Img } from './ModalStyled';

export function Modal(currentImg, closeModal) {
  const addKeyListener = e => {
    if (e.code === 'Escape') {
      this.props.closeModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', addKeyListener);

    return window.removeEventListener('keydown', addKeyListener);
  }, []);
  // componentDidMount() {

  // }

  // componentWillUnmount() {

  // }

  return (
    <BackDrop onClick={closeModal}>
      <Wrap>
        <Img src={currentImg.largeImageURL} alt="" />
      </Wrap>
    </BackDrop>
  );
}

Modal.propTypes = {
  currentImg: PropTypes.object,
};
