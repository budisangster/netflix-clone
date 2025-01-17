import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import FeaturedMovie from '../components/FeaturedMovie';
import MovieRow from '../components/MovieRow';
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getPopularTVShows,
  getTopRatedTVShows,
  getTrendingTVShows,
} from '../services/tmdb';

const Browse = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#141414',
      pt: { xs: '56px', sm: '64px' },
      pb: 4,
      overflow: 'hidden'
    }}>
      <FeaturedMovie type="movies" />
      
      <Box sx={{ 
        mt: { xs: '-60px', sm: '-80px', md: '-100px' },
        pt: { xs: 8, sm: 10, md: 12 },
        position: 'relative',
        zIndex: 2 
      }}>
        <MovieRow
          title="Trending Now"
          fetchMovies={getTrendingMovies}
          type="movies"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Popular Movies"
          fetchMovies={getPopularMovies}
          type="movies"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Top Rated Movies"
          fetchMovies={getTopRatedMovies}
          type="movies"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Popular TV Shows"
          fetchMovies={getPopularTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Top Rated TV Shows"
          fetchMovies={getTopRatedTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
        <MovieRow
          title="Trending TV Shows"
          fetchMovies={getTrendingTVShows}
          type="tv"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        />
      </Box>
    </Box>
  );
};

export default Browse; 