import { Box, Typography, IconButton, SxProps, Theme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRef, useState, useEffect } from 'react';
import { MovieResponse } from '../services/tmdb';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  fetchMovies: () => Promise<MovieResponse>;
  type?: 'movies' | 'tv' | 'mylist';
  sx?: SxProps<Theme>;
}

const MovieRow = ({ title, fetchMovies, type = 'movies', sx }: MovieRowProps) => {
  const [movies, setMovies] = useState<MovieResponse>({ results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMovies();
        setMovies(data);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [fetchMovies]);

  const handleScroll = () => {
    if (!rowRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;

    const { clientWidth } = rowRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
    
    rowRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  if (isLoading || movies.results.length === 0) return null;

  return (
    <Box sx={{ ...sx }}>
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          mb: 1,
          px: { xs: 2, sm: 4 },
          fontSize: { xs: '1rem', sm: '1.25rem' },
          fontWeight: 'bold',
        }}
      >
        {title}
      </Typography>

      <Box sx={{ position: 'relative', '&:hover button': { opacity: 1 } }}>
        {showLeftArrow && (
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
              opacity: { xs: 1, sm: 0 },
              transition: 'opacity 0.3s',
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        <Box
          ref={rowRef}
          onScroll={handleScroll}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            gap: 1,
            px: { xs: 2, sm: 4 },
          }}
        >
          {movies.results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              type={type}
            />
          ))}
        </Box>

        {showRightArrow && (
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
              opacity: { xs: 1, sm: 0 },
              transition: 'opacity 0.3s',
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default MovieRow; 