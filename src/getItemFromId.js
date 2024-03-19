async function getItemFromId(movieId) {
    const tmdbKey = import.meta.env.VITE_TMDB_KEY
    const url= `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbKey}`
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        //console.log(data);
        return data;
      } catch (error) {
        console.error('Error fetching item', error);
        return "";
      }

}

export default getItemFromId;