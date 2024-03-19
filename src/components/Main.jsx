import React from 'react'
import { useState, useEffect } from 'react'
import requests from '../Keys'
import axios from 'axios'
import MovieCardDetails from './MovieCardDetails'
import WatchlistButton from './WatchlistButton'

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    axios.get(requests.requestTopRated).then((response) => {
      const movieList = response.data.results;
      if (!selectedMovie) {
        const randomMovie = movieList[Math.floor(Math.random() * movieList.length)];
        setSelectedMovie(randomMovie);
      }
    })
  }, [selectedMovie])

  const newDesc = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div className='w-full h-[550px] text-white'>
      <div className='w-full h-full'>
        <div className='absolute w-full h-[550px] bg-gradient-to-r from-black'></div>
        <img
          className='w-full h-full object-cover'
          src={`https://image.tmdb.org/t/p/original/${selectedMovie?.backdrop_path}`}
          alt={selectedMovie?.title}
        />
        <div className='absolute w-full top-[20%] p-4 md:p-8'>
          <h1 className='text-3xl md:text-5xl font-bold'>{selectedMovie?.title}</h1>
          <div className='my-4'>
            <button onClick={toggleModal} className='border text-black bg-gray-300 border-gray-300 px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-base'>
              More Info
            </button>
            <WatchlistButton item={selectedMovie} />
          </div>
          <p className='text-gray-400 text-sm'>Release Date: {selectedMovie?.release_date}</p>
          <p className='w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200'>{newDesc(selectedMovie?.overview, 150)}</p>
          {isModalOpen && <MovieCardDetails item={selectedMovie} onClose={toggleModal} />}
        </div>
      </div>
    </div>
  );
}

export default Main