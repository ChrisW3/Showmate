import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Movie from "./Movie";
import requests from '../Keys'
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { UserAuth } from '../contents/AuthContext';
import { db } from '../firebase'
import { getDoc, doc, onSnapshot } from 'firebase/firestore'
import { GENRE_LIST } from '../genreList'

const ChatMovieRecs = ({ moviePreferences }) => {
    const [fypMovieList, setFypMovieList] = useState([])
    const [trendingList, setTrendingList] = useState([]);
    const { user } = UserAuth();

    const searchGenreByName = (genreName) => {
        return GENRE_LIST.genres.find(genre => genre.name.toLowerCase() === genreName.toLowerCase());
    };

    const getMoviePreferencesList = async (moviePreferences) => {
        const genres = moviePreferences.genres;
        const movies = moviePreferences.movies;
        const actors = moviePreferences.actors;

        if (genres[0] != '') {
            const genre = searchGenreByName(genres[0]);
            const genreResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}`, {
                params: {
                    with_genres: genre.id,
                    language: 'en-US',
                    page: 1
                }
            });
        }

        if(movies[0] != '') {
            const movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}`, {
                params: {
                    query: movies[0],
                    language: 'en-US',
                    page: 1
                }
            });
            const simMovies = fetchSimilarMovies(movieResponse.data.results[0].id)
        }

        if (actors[0] != '') {
            const actor = actors[0];
            const actorResponse = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${import.meta.env.VITE_TMDB_KEY}`, {
                params: {
                    query: actor,
                    language: 'en-US',
                    page: 1
                }
            });
            const actorId = actorResponse.data.results[0].id;
            const actorIdResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}`, {
                params: {
                    with_cast: actorId,
                    language: 'en-US',
                    page: 1
                }
            });
        }
    }

    const fetchLikedMovies = async (userEmail) => {
        const docRef = doc(db, 'users', userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const likedMovies = docSnap.data()?.likedShows;
            return likedMovies.slice(-10);
        } else {
            return [];
        }
    };

    function filterMovies(movies) {
        return movies.filter(movie => movie.original_language === 'en' && movie.backdrop_path !== null && movie.vote_average > 7);
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

        if (uniqueMovies.length < 3) {
            const combinedMovieList = uniqueMovies.concat(trendingList)
            return combinedMovieList.slice(0, 3);
        } else {
            return uniqueMovies.slice(0, 3);
        }

    };

    useEffect(() => {
        const fetchForYouMovies = async () => {
            if (user?.email) {
                const likedMovies = await fetchLikedMovies(user.email);
                const promises = likedMovies.map(item => fetchSimilarMovies(item.id));
                const similarMoviesArrays = await Promise.all(promises);
                const forYouMovies = randomForYouMovies(similarMoviesArrays);
                setFypMovieList(forYouMovies);
            } else {

            }
        };

        fetchForYouMovies();
    }, [user?.email]);


    useEffect(() => {
        axios.get(requests.requestTrending).then((response) => {
            setTrendingList(response.data.results);
        });
    }, [requests.requestTrending]);

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            const likedMovies = doc.data()?.likedShows;
            if (!likedMovies || likedMovies.length === 0) {
                setFypMovieList(trendingList);
            }
        });
    }, [user?.email, trendingList]);

    const slideLeft = () => {
        var slider = document.getElementById("slider");
        slider.scrollLeft = slider.scrollLeft - 500;
    };

    const slideRight = () => {
        var slider = document.getElementById("slider");
        slider.scrollLeft = slider.scrollLeft + 500;
    };

    return (
        <>
            <div className="relative flex items-center group z-40">
                <MdChevronLeft
                    onClick={slideLeft}
                    className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                    size={40}
                />
                <div
                    id={"slider"}
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

export default ChatMovieRecs