import React from 'react'

const Footer = () => {
    return (
        <>
            <div className='w-full h-full flex justify-center items-center'>
                <img className='py-32' src="moviedb-logo.png" alt="" />
                <h2 className='text-white p-4'>This product uses the TMDB API but is not endorsed or certified by TMDB.</h2>
            </div>
        </>
    )
}

export default Footer