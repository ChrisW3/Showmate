import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai'
import getMovieCast from '../getMovieCast'
import getMovieGenres from '../getMovieGenres';
import CommaSeperate from './CommaSeperate';
import getPlatformList from '../getPlatformList';
import OpenPlatformLink from './OpenPlatformLink';
import WatchlistButton from './WatchlistButton';
import LikeButton from './LikeButton';

const MovieCardDetails = ({ item, onClose }) => {
    const [castList, setCastList] = useState([])
    const [genreList, setGenreList] = useState([])
    const [platformLink, setPlatformLink] = useState("");
    const modalRef = useRef(null);

    const trimText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
      };

    const desc = trimText(item?.overview, 300)

    useEffect(() => {
        const getCast = async () => {
            const cast = await getMovieCast(item?.id);
            setCastList(cast);
        };

        getCast();
    }, [item?.id]);

    useEffect(() => {
        if (!item?.genre_ids) {
            const ids = item?.genres.map(i => i.id);
            const getGenres = async () => {
                const genres = await getMovieGenres(ids);
                setGenreList(genres);
            };
            getGenres();
        } else {
            const getGenres = async () => {
                const genres = await getMovieGenres(item?.genre_ids);
                setGenreList(genres);
            };
            getGenres();
        }
    }, [item?.genre_ids]);

    useEffect(() => {
        const getPlatformLink = async () => {
            const platformLink = await getPlatformList(item?.id);
            setPlatformLink(platformLink);
        };
        getPlatformLink();
    }, [item?.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="w-[90%] sm:w[-80%] md:w-[50%] h-[90%] bg-gray-900 bg-opacity-90 rounded-lg text-white relative" ref={modalRef}>
                <p onClick={onClose} className='absolute text-gray-300 top-4 right-4 cursor-pointer z-50'><AiOutlineClose /></p>
                <div className='absolute w-full h-[100%] bg-gradient-to-t from-black'></div>
                <img
                    className='w-full h-full object-cover'
                    src={`https://image.tmdb.org/t/p/original/${item?.backdrop_path}`}
                    alt={item?.title}
                />
                <div className='absolute w-full top-[50%] p-4 md:p-8'>
                    <h2 className="sm:text-lg md:text-xl font-bold">{item?.title}</h2>
                    <p className='whitespace-pre-wrap py-2 sm:text-sm md:text-base'>{desc}</p>
                    <h3 className='py-2 text-sm'>Cast: <CommaSeperate elements={castList} /></h3>
                    <h3 className='py-2 text-sm'>Genres: <CommaSeperate elements={genreList} /> </h3>
                    <div className='py-4'>
                        <OpenPlatformLink link={platformLink} />
                        <WatchlistButton item={item} />
                        <LikeButton item={item} />
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
};

export default MovieCardDetails;