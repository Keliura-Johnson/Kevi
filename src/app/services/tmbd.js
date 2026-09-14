const API_KEY = 'dad509a42948326ed8f98899575dc208';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const getTrending = async () => {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results;
};

export const getPersonalizedRecommendations = async (genreIds) => {
    const genreString = genreIds.join(',');
    const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreString}&sort_by=popularity.desc`
    );
    const data = await res.json();
    return data.results;
};
export const getYouMightAlsoLike = async () => {
    try {
        const randomPage = Math.floor(Math.random() * 20) + 1;

        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${randomPage}`
        );

        const data = await response.json();

        return data.results || [];

    } catch (error) {
        console.log("Error loading You Might Also Like:", error);
        return [];
    }
};

export const searchMovies = async (query) => {
    const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    return data.results;
};

export const getMovieDetails = async (movieId) => {
    const res = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
    );
    return await res.json();
};

export const getImageUrl = (path) => `${IMAGE_BASE_URL}${path}`;