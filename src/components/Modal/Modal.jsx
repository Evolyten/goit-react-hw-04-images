import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Wrap, BackDrop, Img } from './ModalStyled';

export default function Modal({ currentImg, onCloseModal }) {
  useEffect(() => {
    const handleEsc = e => {
      if (e.code === 'Escape') {
        onCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onCloseModal]);

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
