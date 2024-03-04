import React from 'react'
import Main from '../components/Main'
import requests from '../Keys'
import ShowsRow from '../components/ShowsRow'

const Homepage = () => {
  return (
    <>
      <Main />
      <ShowsRow rowID='1' title='Top Rated' fetchURL={requests.requestTopRated}/>
      <ShowsRow rowID='2' title='Trending' fetchURL={requests.requestTrending}/>
      <ShowsRow rowID='3' title='Now Playing' fetchURL={requests.requestNowPlaying}/>
    </>
  )
}

export default Homepage