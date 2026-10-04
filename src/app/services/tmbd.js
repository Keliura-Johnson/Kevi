const API_KEY = 'dad509a42948326ed8f98899575dc208';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const getTrending = async (page = 1) => {
    const res = await fetch(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`
    );

    const data = await res.json();

    return data.results || [];
};
export const getTVDetails = async (tvId) => {
    const res = await fetch(
        `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=credits,videos`
    );
    return await res.json();
};

export const getPersonDetails = async (personId) => {
    const res = await fetch(
        `${BASE_URL}/person/${personId}?api_key=${API_KEY}&append_to_response=combined_credits`
    );
    return await res.json();
};

// export const getPersonalizedRecommendations = async (genreIds, page = 1) => {
//     const genreString = genreIds.join(',');

//     const res = await fetch(
//         `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreString}&sort_by=popularity.desc&page=${page}`
//     );

//     const data = await res.json();

//     return data.results || [];
// };



export const getPersonalizedRecommendations = async (genreIds, page = 1) => {
    try {
       
        const idsArray = Array.isArray(genreIds) ? genreIds : [genreIds];

        if (!idsArray.length) return [];

        const genreString = idsArray.join('|');

   
        const sortOptions = [
            'popularity.desc',
            'vote_average.desc',
            'vote_count.desc',
            'revenue.desc',
        ];
        const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

        const res = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreString}&sort_by=${randomSort}&vote_count.gte=100&page=${page}`
        );

        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.log("TMDB Personalization Error:", error);
        return [];
    }


    const data = await res.json();

    return data.results || [];
};

export const getBackdropUrl = (path) => `https://image.tmdb.org/t/p/w1280${path}`;

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

export const searchMovies = async (query, page = 1) => {
    const res = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await res.json();
    const filtered = (data.results || []).filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
    );
    return { results: filtered, total_pages: data.total_pages || 1 };
};

export const getMovieDetails = async (movieId) => {
    const res = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
    );
    return await res.json();
};

export const discoverMovies = async ({ genre, year, rating, page = 1 }) => {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`;

    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&primary_release_year=${year}`;
    if (rating) url += `&vote_average.gte=${rating}`;

    const res = await fetch(url);
    const data = await res.json();
    return { results: data.results || [], total_pages: data.total_pages || 1 };
};

export const getTVSeasonDetails = async (tvId, seasonNumber) => {
    const res = await fetch(
        `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`
    );

    return await res.json();
};
export const searchMulti = async (query) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("TMDB searchMulti error:", error);
        return { results: [] };
    }
};

export const getImageUrl = (path) => `${IMAGE_BASE_URL}${path}`;