async function getMovieCast(movieId) {
    const tmdbKey = import.meta.env.VITE_TMDB_KEY
    const url= `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${tmdbKey}`
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const castList = data.cast.slice(0, 5).map(castMember => castMember.name);
        return castList;
      } catch (error) {
        console.error('Error fetching cast list:', error);
        return [];
      }

}

export default getMovieCast;



