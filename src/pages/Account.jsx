import React from 'react'
import SavedShows from '../components/SavedShows'
import WatchlistShows from '../components/WatchlistShows'

const Account = () => {
  return (
    <>
      <div className='w-full text-white'>
        <img
          className='w-full h-[400px] object-cover'
          src="login-bg.png"
          alt="" />

        <div className='bg-black/60 fixed top-0 left-0 w-full h-[550px]'></div>
        <div className='absolute top-[20%] p-4 md:p-8'>
          <h1 className='text-3xl md:text-5xl font-bold'>My Shows</h1>
        </div>
      </div>
      <SavedShows rowID='1'/>
      <WatchlistShows rowID='2'/>
    </>
  )
}

export default Account