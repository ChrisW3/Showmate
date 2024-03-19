import React from 'react'
import { useState, useEffect } from 'react'
import { UserAuth } from '../contents/AuthContext';
import { db } from '../firebase'
import { updateDoc, doc, onSnapshot, arrayUnion } from 'firebase/firestore'

const WatchlistButton = ({ item }) => {
    const [watchlist, setWatchlist] = useState(false);
    const [watchlistMovieList, setWatchlistMovieList] = useState([])

    const { user } = UserAuth();
    const movieId = doc(db, 'users', `${user?.email}`)

    const watchlistShow = async (e) => {
        e.stopPropagation();
        if (user?.email) {
            setWatchlist(!watchlist)
            await updateDoc(movieId, {
                watchlistShows: arrayUnion({
                    id: item.id,
                    title: item.title,
                    img: item.backdrop_path
                })
            })
        } else {
            alert('Please Log In to Watchlist a Show.')
        }
    }

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setWatchlistMovieList(doc.data()?.watchlistShows);
        })
    }, [user?.email]);

    const movieRef = doc(db, 'users', `${user?.email}`)
    const removeWatchlistShow = async (passedID) => {
        try {
            const result = watchlistMovieList.filter((item) => item.id !== passedID)
            await updateDoc(movieRef, {
                watchlistShows: result
            })
            setWatchlist(!watchlist)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {watchlist ? <button onClick={() => removeWatchlistShow(item.id)} className='border text-white border-gray-300 px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-base ml-4'>
                Remove from WatchList
            </button> : <button onClick={watchlistShow} className='border text-white border-gray-300 px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-base ml-4'>
                Save to WatchList
            </button>}
        </>
    )
}

export default WatchlistButton