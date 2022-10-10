import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Wrap, BackDrop, Img } from './ModalStyled';

export function Modal({ currentImg, onCloseModal }) {
  const addKeyListener = e => {
    if (e.code === 'Escape') {
      this.props.closeModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', addKeyListener);

    return window.removeEventListener('keydown', addKeyListener);
  }, []);

  return (
    <BackDrop onClick={onCloseModal}>
      <Wrap>
        <Img src={currentImg.largeImageURL} alt="" />
      </Wrap>
    </BackDrop>
  );
}

Modal.propTypes = {
  currentImg: PropTypes.object,
};
