import React from 'react'
import { useState, useEffect } from 'react'
import { UserAuth } from '../contents/AuthContext';
import { db } from '../firebase'
import { updateDoc, doc, onSnapshot, arrayUnion } from 'firebase/firestore'

const LikeButton = ({ item }) => {
    const [like, setLike] = useState(false);
    const [likedMovieList, setLikedMovieList] = useState([])

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

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.uid}`), (doc) => {
            setLikedMovieList(doc.data()?.likedShows);
        })
    }, [user?.uid]);

    const movieRef = doc(db, 'users', `${user?.uid}`)
    const removeLikeShow = async (passedID) => {
        try {
            const result = likedMovieList.filter((item) => item.id !== passedID)
            await updateDoc(movieRef, {
                likedShows: result
            })
            setLike(!like)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {like ? <button onClick={() => removeLikeShow(item.id)} className='border text-white border-gray-300 px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-base ml-4'>
                UnLike
            </button> : <button onClick={likeShow} className='border text-white border-gray-300 px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-base ml-4'>
                Like
            </button>}
        </>
    )
}

export default LikeButton