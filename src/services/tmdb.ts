const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  genres?: { id: number; name: string; }[];
}

export interface MovieResponse {
  results: Movie[];
}

export interface VideoResponse {
  results: {
    key: string;
    site: string;
    type: string;
    official: boolean;
  }[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
  runtime: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  season_number: number;
  episode_count: number;
}

const fetchFromTMDB = async (endpoint: string) => {
  const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=en-US`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch from TMDB');
  }
  return response.json();
};

export const getTrailer = async (id: number, type: 'movie' | 'tv', seasonNumber?: number, episodeNumber?: number) => {
  if (!id) {
    console.warn('Invalid ID provided to getTrailer');
    return null;
  }

  let endpoint = '';
  
  if (type === 'tv' && seasonNumber && episodeNumber) {
    try {
      // First validate that the TV show exists
      const tvShowResponse = await fetch(`${BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`);
      if (!tvShowResponse.ok) {
        console.warn(`TV show with ID ${id} not found`);
        return null;
      }

      // Try to get episode videos
      endpoint = `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/videos`;
      const data: VideoResponse = await fetchFromTMDB(endpoint);
      const episodeTrailer = data.results.find(
        video => video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser' || video.type === 'Clip') && 
        video.official
      ) || data.results[0];

      if (episodeTrailer?.key) {
        return episodeTrailer.key;
      }
    } catch (error) {
      console.log('No episode video available, falling back to TV show trailer');
    }
    
    try {
      // If no episode video, fall back to TV show trailer
      endpoint = `/tv/${id}/videos`;
      const data: VideoResponse = await fetchFromTMDB(endpoint);
      const trailer = data.results.find(
        video => video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser') && 
        video.official
      ) || data.results[0];
      
      return trailer?.key || null;
    } catch (error) {
      console.warn('Failed to fetch TV show trailer:', error);
      return null;
    }
  } else {
    try {
      // Get movie or TV show videos
      endpoint = `/${type}/${id}/videos`;
      const data: VideoResponse = await fetchFromTMDB(endpoint);
      const trailer = data.results.find(
        video => video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser') && 
        video.official
      ) || data.results[0];
      
      return trailer?.key || null;
    } catch (error) {
      console.warn(`Failed to fetch ${type} trailer:`, error);
      return null;
    }
  }
};

export const searchMovies = async (query: string) => {
  if (!query) return { results: [] };
  const url = `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search movies');
  }
  return response.json();
};

// Movies
export const getTrendingMovies = () => fetchFromTMDB('/trending/movie/week');
export const getTopRatedMovies = () => fetchFromTMDB('/movie/top_rated');
export const getPopularMovies = () => fetchFromTMDB('/movie/popular');
export const getUpcomingMovies = () => fetchFromTMDB('/movie/upcoming');

// TV Shows
export const getNetflixOriginals = () => fetchFromTMDB('/discover/tv?with_networks=213');
export const getTopRatedTVShows = () => fetchFromTMDB('/tv/top_rated');
export const getPopularTVShows = () => fetchFromTMDB('/tv/popular');
export const getTrendingTVShows = () => fetchFromTMDB('/trending/tv/week');

// Genres
export const getActionMovies = () => fetchFromTMDB('/discover/movie?with_genres=28');
export const getComedyMovies = () => fetchFromTMDB('/discover/movie?with_genres=35');
export const getHorrorMovies = () => fetchFromTMDB('/discover/movie?with_genres=27');
export const getRomanceMovies = () => fetchFromTMDB('/discover/movie?with_genres=10749');
export const getDocumentaries = () => fetchFromTMDB('/discover/movie?with_genres=99');

// Details
export const getMovieDetails = (movieId: string) => fetchFromTMDB(`/movie/${movieId}`);
export const getTVShowDetails = (tvId: string) => fetchFromTMDB(`/tv/${tvId}`);
export const getMovieCredits = (movieId: string) => fetchFromTMDB(`/movie/${movieId}/credits`);
export const getTVShowCredits = (tvId: string) => fetchFromTMDB(`/tv/${tvId}/credits`);
export const getSimilarMovies = (movieId: string) => fetchFromTMDB(`/movie/${movieId}/similar`);
export const getSimilarTVShows = (tvId: string) => fetchFromTMDB(`/tv/${tvId}/similar`);

export const getImageUrl = (path: string, size: 'original' | 'w500' = 'original') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : ''; 

export const getMoviesByGenre = async (genreId: number): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movies by genre');
  }
  return response.json();
};

export const getTVShowsByGenre = async (genreId: number): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch TV shows by genre');
  }
  return response.json();
};

// TV Show Genres
export const getDramaTVShows = () => fetchFromTMDB('/discover/tv?with_genres=18');
export const getComedyTVShows = () => fetchFromTMDB('/discover/tv?with_genres=35');
export const getCrimeTVShows = () => fetchFromTMDB('/discover/tv?with_genres=80');
export const getDocumentaryTVShows = () => fetchFromTMDB('/discover/tv?with_genres=99');
export const getKidsTVShows = () => fetchFromTMDB('/discover/tv?with_genres=10762');
export const getSciFiTVShows = () => fetchFromTMDB('/discover/tv?with_genres=10765');

// Continue Watching
const CONTINUE_WATCHING_KEY = 'netflix_clone_continue_watching';

export interface WatchProgress {
  id: number;
  type: 'movie' | 'tv';
  progress: number;
  timestamp: number;
}

export const saveWatchProgress = (id: number, type: 'movie' | 'tv', progress: number) => {
  const watchList = getContinueWatching();
  const updatedList = [
    { id, type, progress, timestamp: Date.now() },
    ...watchList.filter(item => item.id !== id)
  ].slice(0, 20); // Keep only last 20 items
  localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updatedList));
};

export const getContinueWatching = (): WatchProgress[] => {
  const list = localStorage.getItem(CONTINUE_WATCHING_KEY);
  return list ? JSON.parse(list) : [];
};

export const getWatchProgressDetails = async () => {
  const watchList = getContinueWatching();
  const details = await Promise.all(
    watchList.map(async ({ id, type, progress, timestamp }) => {
      try {
        const details = await (type === 'movie' ? getMovieDetails(id.toString()) : getTVShowDetails(id.toString()));
        return { ...details, progress, timestamp, type };
      } catch (error) {
        console.error(`Failed to fetch details for ${type} ${id}:`, error);
        return null;
      }
    })
  );
  return details.filter(Boolean);
}; 

export const getTVShowSeasons = (tvId: string) => fetchFromTMDB(`/tv/${tvId}`);

export const getTVShowEpisodes = (tvId: string, seasonNumber: number) => 
  fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`); 

// Episode Progress Tracking
const EPISODE_PROGRESS_KEY = 'netflix_clone_episode_progress';

export interface EpisodeProgress {
  tvId: number;
  seasonNumber: number;
  episodeNumber: number;
  progress: number;
  timestamp: number;
}

export const saveEpisodeProgress = (
  tvId: number,
  seasonNumber: number,
  episodeNumber: number,
  progress: number
) => {
  const progressList = getEpisodeProgress();
  const key = `${tvId}-${seasonNumber}-${episodeNumber}`;
  
  const updatedList = {
    ...progressList,
    [key]: {
      tvId,
      seasonNumber,
      episodeNumber,
      progress,
      timestamp: Date.now()
    }
  };
  
  localStorage.setItem(EPISODE_PROGRESS_KEY, JSON.stringify(updatedList));
};

export const getEpisodeProgress = (): { [key: string]: EpisodeProgress } => {
  const list = localStorage.getItem(EPISODE_PROGRESS_KEY);
  return list ? JSON.parse(list) : {};
};

export const getEpisodeProgressByTVShow = (tvId: number): EpisodeProgress[] => {
  const progressList = getEpisodeProgress();
  return Object.values(progressList).filter(progress => progress.tvId === tvId);
};

export const getNextEpisode = async (
  tvId: number,
  currentSeasonNumber: number,
  currentEpisodeNumber: number
): Promise<Episode | null> => {
  try {
    // First try to get next episode in current season
    const currentSeason = await getTVShowEpisodes(tvId.toString(), currentSeasonNumber);
    const nextEpisodeInSeason = currentSeason.episodes.find(
      (ep: Episode) => ep.episode_number === currentEpisodeNumber + 1
    );
    
    if (nextEpisodeInSeason) {
      return nextEpisodeInSeason;
    }
    
    // If no next episode in current season, try to get first episode of next season
    const tvShow = await getTVShowSeasons(tvId.toString());
    const nextSeason = tvShow.seasons?.find(
      (season: Season) => season.season_number === currentSeasonNumber + 1
    );
    
    if (nextSeason) {
      const nextSeasonEpisodes = await getTVShowEpisodes(tvId.toString(), nextSeason.season_number);
      return nextSeasonEpisodes.episodes[0] || null;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get next episode:', error);
    return null;
  }
};