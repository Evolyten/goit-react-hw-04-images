import React, { useState, useEffect } from 'react';
import { SearchBar } from './Searchbar/Searchbar';
import { ImageGalleryList } from './ImageGallery/ImageGallery';
import { requestPhoto } from 'components/service/APIService';
import { Modal } from './Modal/Modal';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
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

  // state = {
  //   name: '',
  //   images: [],
  //   page: 1,
  //   modal: null,
  //   status: listStatus.idle,
  // };

  const pushDataToState = async (name, page) => {
    setStatus(listStatus.pending);
    const dateFromApi = await requestPhoto(name, page);
    const totalPage = Math.ceil(dateFromApi.totalHits / 12);
    let filteredData = dateFromApi.hits.map(n => {
      const neededData = {
        id: n.id,
        webformatURL: n.webformatURL,
        largeImageURL: n.largeImageURL,
      };
      return neededData;
    });
    if (filteredData.length === 0) {
      toast.error('No matches for this query.');
      setStatus(listStatus.reject);
    } else {
      if (page !== 1) {
        setUserImages(prevState => [...prevState, ...filteredData]);
        setStatus(listStatus.resolved);
      } else {
        setUserImages(filteredData);

        setStatus(listStatus.resolved);
      }
    }
    if (page === totalPage) {
      toast.error('This is last page.');
      setStatus(listStatus.reject);
    }
  };

  useEffect(() => {
    if (userRequest === '') {
      return;
    } else {
      pushDataToState(userRequest, page);
    }
  }, [page, userRequest]);

  useEffect(() => {
    setUserImages([]);
    setPage(1);
  }, [userRequest]);

  // componentDidUpdate(_, prevState) {
  //   const prevName = prevState.name;
  //   const nextName = this.state.name;
  //   const prevPage = prevState.page;
  //   const nextPage = this.state.page;
  //   if (prevName !== nextName) {
  //     this.setState({ images: [], page: 1 });
  //     this.pushDataToState(nextName, 1);
  //   }
  //   if (prevPage !== nextPage && prevPage < nextPage) {
  //     this.pushDataToState(nextName, nextPage);
  //   }
  // }

  const userName = value => {
    setUserRequest(value);
  };
  const takeMorePage = async () => {
    setPage(prevState => prevState + 1);
  };
  const userClick = id => {
    const pickedImg = userImages.find(img => img.id === id);
    setModal(pickedImg);
  };
  const closeModal = () => {
    setModal(null);
  };

  return (
    <div>
      <SearchBar submitForm={userName} />
      {userImages.length > 0 ? (
        <ImageGalleryList userImage={userImages} userClickModal={userClick} />
      ) : (
        <></>
      )}
      {status === listStatus.resolved && (
        <Button incrementPage={takeMorePage} />
      )}
      {modal && <Modal currentImg={modal} closeModal={closeModal} />}
      {status === listStatus.pending && <Loader />}
      <Toaster position="top-right" reverseOrder={true} />
    </div>
  );
}
