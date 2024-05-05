import React from "react";
import { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { UserAuth } from '../contents/AuthContext'
import { db } from '../firebase'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import MovieCardDetails from "./MovieCardDetails";

const Movie = ({ item, img }) => {
  const [like, setLike] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = UserAuth();

  const movieId = doc(db, 'users', `${user?.uid}`)

  const likeShow = async (e) => {
    e.stopPropagation();
    if (user?.uid) {
      setLike(!like)
      await updateDoc(movieId, {
        likedShows: arrayUnion({
          id: item.id,
          title: item.title,
          img: item.backdrop_path
        })
      })
    } else {
      alert('Please Log In to Like a Show.')
    }
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <>
      <div onClick={toggleModal} className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2">
        <img
          className="w-full h-auto block"
          src={`https://image.tmdb.org/t/p/w500/${img}`}
          alt={item?.title}
        />
        <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0  hover:opacity-100 text-white">
          <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
            {item?.title}
          </p>
          <p onClick={likeShow}>
            {like ? (
              <FaHeart className="absolute top-4 left-4 text-gray-300" />
            ) : (
              <FaRegHeart className="absolute top-4 left-4 text-gray-300" />
            )}
          </p>
        </div>
      </div>
      {isModalOpen && <MovieCardDetails item={item} onClose={toggleModal} />}
    </>
  );
};

export default Movie;
