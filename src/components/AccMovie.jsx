import React from "react";
import { useState, useEffect } from 'react'
import MovieCardDetails from "./MovieCardDetails";
import getItemFromId from "../getItemFromId";
import { AiOutlineClose } from 'react-icons/ai'
import { UserAuth } from '../contents/AuthContext';
import { db } from '../firebase';
import { updateDoc, doc, onSnapshot } from 'firebase/firestore';

const AccMovie = ({ item_id, img, type }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [item, setItem] = useState([]);
    const [movies, setMovies] = useState([]);
    const { user } = UserAuth();

    useEffect(() => {
        getItemFromId(item_id)
            .then(item => {
                setItem(item);
                console.log(item);
            })
            .catch(error => {
                console.error('Error displaying item', error);
            });
    }, [item_id])

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            if (type === 'like') {
                setMovies(doc.data()?.likedShows);
            } else {
                setMovies(doc.data()?.watchlistShows);
            }
        });
    }, [user?.email]);

    const movieRef = doc(db, 'users', `${user?.email}`)

    const deleteShow = async (passedID) => {
        try {
            const result = movies.filter((item) => item.id !== passedID)
            if (type === 'like') {
                await updateDoc(movieRef, {
                    likedShows: result
                })
            } else {
                await updateDoc(movieRef, {
                    watchlistShows: result
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div onClick={toggleModal} className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2 z-40">
                <img
                    className="w-full h-auto block"
                    src={`https://image.tmdb.org/t/p/w500/${img}`}
                    alt={item?.title}
                />
                <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0  hover:opacity-100 text-white">
                    <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
                        {item?.title}
                    </p>
                    <div className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white'>
                        <p className='white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center'>
                            {item?.title}
                        </p>
                        <p onClick={(e) => {
                            e.stopPropagation();
                            deleteShow(item.id)
                        }}><AiOutlineClose className='absolute text-gray-300 top-4 right-4 z-50' /></p>
                    </div>
                </div>
            </div>
            {isModalOpen && <MovieCardDetails item={item} onClose={toggleModal} />}
        </>
    );
};

export default AccMovie;
