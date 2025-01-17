import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  getNetflixOriginals,
  getTopRatedTVShows,
  getPopularTVShows,
  getTrendingTVShows,
  getDramaTVShows,
  getComedyTVShows,
  getCrimeTVShows,
  getDocumentaryTVShows,
  getKidsTVShows,
  getSciFiTVShows,
  getWatchProgressDetails,
  Movie
} from '../services/tmdb';
import MovieRow from '../components/MovieRow';
import FeaturedMovie from '../components/FeaturedMovie';

const TV = () => {
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);

  useEffect(() => {
    const loadContinueWatching = async () => {
      try {
        const details = await getWatchProgressDetails();
        const tvShows = details.filter(item => item.type === 'tv');
        setContinueWatching(tvShows);
      } catch (error) {
        console.error('Failed to load continue watching:', error);
      }
    };

    loadContinueWatching();
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#141414',
      pt: { xs: '56px', sm: '64px' },
      pb: 4,
      overflow: 'hidden'
    }}>
      <FeaturedMovie type="tv" />
      
      <Box sx={{ 
        mt: { xs: '-60px', sm: '-80px', md: '-100px' },
        pt: { xs: 8, sm: 10, md: 12 },
        position: 'relative',
        zIndex: 2 
      }}>
        {continueWatching.length > 0 && (
          <MovieRow
            title="Continue Watching"
            fetchMovies={() => Promise.resolve({ results: continueWatching })}
            type="tv"
            sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
          />
        )}
        
        <MovieRow
          title="Netflix Originals"
          fetchMovies={getNetflixOriginals}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Trending Now"
          fetchMovies={getTrendingTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Popular on Netflix"
          fetchMovies={getPopularTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Top Rated"
          fetchMovies={getTopRatedTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Drama Shows"
          fetchMovies={getDramaTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Comedy Shows"
          fetchMovies={getComedyTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Crime Shows"
          fetchMovies={getCrimeTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Documentaries"
          fetchMovies={getDocumentaryTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Kids Shows"
          fetchMovies={getKidsTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Sci-Fi & Fantasy"
          fetchMovies={getSciFiTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
      </Box>
    </Box>
  );
};

export default TV; 