import React, { useState, useEffect } from 'react';
import SearchBar from './Searchbar/Searchbar';
import ImageGalleryList from './ImageGallery/ImageGallery';
import { requestPhoto, normalizeImages } from 'components/service/APIService';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';
const listStatus = {
  idle: 'IDLE',
  pending: 'PENDING',
  resolved: 'RESOLVED',
  reject: 'REJECT',
};

export function App() {
  const [userRequest, setUserRequest] = useState('');
  const [userImages, setUserImages] = useState([]);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [status, setStatus] = useState(listStatus.idle);

  const addUserImagesToState = async (name, page) => {
    setStatus(listStatus.pending);
    const dateFromApi = await requestPhoto(name, page);
    const totalPage = Math.ceil(dateFromApi.totalHits / 12);
    let filteredData = normalizeImages(dateFromApi);

    if (filteredData.length === 0) {
      toast.error('No matches for this query.');
      setStatus(listStatus.reject);
      return;
    }

    if (page !== 1) {
      setUserImages(prevState => [...prevState, ...filteredData]);
      setStatus(listStatus.resolved);
    } else {
      setUserImages(filteredData);
      setStatus(listStatus.resolved);
    }

    if (page === totalPage) {
      setStatus(listStatus.reject);
      return;
    }
  };

  useEffect(() => {
    if (!userRequest) return;

    addUserImagesToState(userRequest, page);
  }, [page, userRequest]);

  useEffect(() => {
    setUserImages([]);
    setPage(1);
  }, [userRequest]);

  const userRequestImages = value => {
    setUserRequest(value);
    setPage(1);
  };

  const nextImagesPage = () => {
    setPage(prevState => prevState + 1);
  };

  const openModal = id => {
    const pickedImg = userImages.find(img => img.id === id);
    setModal(pickedImg);
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <div>
      <SearchBar submitForm={userRequestImages} />
      {userImages.length > 0 ? (
        <ImageGalleryList userImage={userImages} userClickModal={openModal} />
      ) : (
        <></>
      )}
      {status === listStatus.resolved && (
        <Button incrementPage={nextImagesPage} />
      )}
      {modal && <Modal currentImg={modal} onCloseModal={closeModal} />}
      {status === listStatus.pending && <Loader />}
      <Toaster position="top-right" reverseOrder={true} />
    </div>
  );
}
