import React, { useState, useEffect } from 'react'
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { UserAuth } from '../contents/AuthContext';
import { db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore';
import AccMovie from './AccMovie';

const WatchlistShows = ({ rowID }) => {
    const [movies, setMovies] = useState([])
    const { user } = UserAuth();

    const slideLeft = () => {
        var slider = document.getElementById("slider" + rowID);
        slider.scrollLeft = slider.scrollLeft - 500;
    };

    const slideRight = () => {
        var slider = document.getElementById("slider" + rowID);
        slider.scrollLeft = slider.scrollLeft + 500;
    };

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.uid}`), (doc) => {
            setMovies(doc.data()?.watchlistShows.reverse());
        })
    }, [user?.uid]);

    return (
        <div>
            <h2 className="text-white font-bold md:text-xl p-4">Watchlisted Shows</h2>
            <div className="relative flex items-center group">
                <MdChevronLeft
                    onClick={slideLeft}
                    className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                    size={40}
                />
                <div
                    id={"slider" + rowID}
                    className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide"
                >
                    {movies.map((item, id) => (
                        <AccMovie key={id} item_id={item.id} img={item.img} type={'watchlist'}/>
                    ))}
                </div>
                <MdChevronRight
                    onClick={slideRight}
                    className="bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                    size={40}
                />
            </div>
        </div>
    )
}

export default WatchlistShows