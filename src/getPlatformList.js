async function getPlatformList(movieId) {
    const tmdbKey = import.meta.env.VITE_TMDB_KEY
    const url= `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${tmdbKey}`
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const platformLink = data.results.US.link;
        return platformLink;
      } catch (error) {
        console.error('Error fetching platform link', error);
        return "";
      }

}

export default getPlatformList;