async function getMovieGenres(movieIdGenres) {

    function getGenreNamesByIds(movieIdGenres, genreList) {
        return movieIdGenres.map(id => {
          const genre = genreList.find(genre => genre.id === id);
          return genre ? genre.name : 'Unknown';
        });
      }

    const tmdbKey = import.meta.env.VITE_TMDB_KEY
    const movieGenreList = `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbKey}`;

    try {
        const response = await fetch(movieGenreList);
        const data = await response.json();
        const genreList = data.genres;
        return getGenreNamesByIds(movieIdGenres, genreList);
    } catch (error) {
        console.error('Error fetching genre list:', error);
        return [];
    }

}

export default getMovieGenres;