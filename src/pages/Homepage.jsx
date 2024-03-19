import React from 'react'
import Main from '../components/Main'
import requests from '../Keys'
import ShowsRow from '../components/ShowsRow'
import ForYouPageAlgo from '../components/ForYouPageAlgo'

const Homepage = () => {
  return (
    <>
      <Main />
      <ForYouPageAlgo rowID='1' />
      <ShowsRow rowID='2' title='Top Rated' fetchURL={requests.requestTopRated}/>
      <ShowsRow rowID='3' title='Now Playing' fetchURL={requests.requestNowPlaying}/>
    </>
  )
}

export default Homepage