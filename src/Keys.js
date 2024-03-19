const tmdbKey = import.meta.env.VITE_TMDB_KEY

const tmdbRequests = {
    requestTopRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${tmdbKey}&language=en-US&page=1`,
    requestTrending: `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=en-US&page=2`,
    requestNowPlaying: `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbKey}&language=en-US&page=1`,
  };

  export default tmdbRequests