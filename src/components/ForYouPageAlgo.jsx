import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Movie from "./Movie";
import requests from '../Keys'
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { UserAuth } from '../contents/AuthContext';
import { db } from '../firebase'
import { getDoc, doc, onSnapshot } from 'firebase/firestore'

const ForYouPageAlgo = ({ rowID }) => {
  const [fypMovieList, setFypMovieList] = useState([])
  const [trendingList, setTrendingList] = useState([]);
  const { user } = UserAuth();

  const fetchLikedMovies = async (userId) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const likedMovies = docSnap.data()?.likedShows;
      return likedMovies.slice(-10);
    } else {
      return [];
    }
  };

  function filterMovies(movies) {
    return movies.filter(movie => 
      movie.original_language === 'en' && 
      movie.backdrop_path !== null && 
      !movie.backdrop_path.includes('null') &&
      movie.vote_average > 7);
  }


  const fetchSimilarMovies = async (movieId) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${import.meta.env.VITE_TMDB_KEY}`, {
      params: {
        language: 'en-US',
        page: 1
      }
    });
    const movieList = filterMovies(response.data.results)
    return movieList;
  };

  const randomForYouMovies = (moviesArrays) => {
    const allMovies = moviesArrays.flat();
    for (let i = allMovies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allMovies[i], allMovies[j]] = [allMovies[j], allMovies[i]];
    }

    const uniqueMovies = Array.from(new Set(allMovies.map(movie => movie.id)))
      .map(id => {
        return allMovies.find(movie => movie.id === id);
      });

    if (uniqueMovies.length < 20) {
      const combinedMovieList = uniqueMovies.concat(trendingList)
      return combinedMovieList.slice(0, 20);
    } else {
      return uniqueMovies.slice(0, 20);
    }

  };

  useEffect(() => {
    const fetchForYouMovies = async () => {
      if (user?.uid) {
        const likedMovies = await fetchLikedMovies(user.uid);
        const promises = likedMovies.map(item => fetchSimilarMovies(item.id));
        const similarMoviesArrays = await Promise.all(promises);
        const forYouMovies = randomForYouMovies(similarMoviesArrays);
        setFypMovieList(forYouMovies);
      } else {

      }
    };

    fetchForYouMovies();
  }, [user?.uid]);


  useEffect(() => {
    axios.get(requests.requestTrending).then((response) => {
      const trendingValidMovies = filterMovies(response.data.results)
      setTrendingList(trendingValidMovies);
    });
    
  }, [requests.requestTrending]);

  useEffect(() => {
    onSnapshot(doc(db, 'users', `${user?.uid}`), (doc) => {
      const likedMovies = doc.data()?.likedShows;
      if (!likedMovies || likedMovies.length === 0) {
        setFypMovieList(trendingList);
      }
    });
  }, [user?.uid, trendingList]);

  const slideLeft = () => {
    var slider = document.getElementById("slider" + rowID);
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const slideRight = () => {
    var slider = document.getElementById("slider" + rowID);
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  return (
    <>
      <h2 className="text-white font-bold md:text-xl p-4">For You</h2>
      <div className="relative flex items-center group z-40">
        <MdChevronLeft
          onClick={slideLeft}
          className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
        <div
          id={"slider" + rowID}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide"
        >
          {fypMovieList.map((item, id) => (
            <Movie key={id} item={item} img={item?.backdrop_path} />
          ))}
        </div>
        <MdChevronRight
          onClick={slideRight}
          className="bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
      </div>
    </>
  );
}

export default ForYouPageAlgo