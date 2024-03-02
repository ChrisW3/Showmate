const tmdbKey = '399458558731a6f5c6e5e0b67b34bdcd'

const tmdbRequests = {
    requestPopular: `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=en-US&page=1`,
    requestTrending: `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=en-US&page=2`,
    requestUpcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${tmdbKey}&language=en-US&page=1`,
  };

  export default tmdbRequests