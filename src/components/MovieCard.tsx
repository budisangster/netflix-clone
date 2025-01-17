import { Box, Typography, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Movie, getImageUrl } from '../services/tmdb';
import WatchProgressBar from './WatchProgressBar';

interface MovieCardProps {
  movie: Movie & { progress?: number };
  type?: 'movies' | 'tv' | 'mylist';
}

const MovieCard = ({ movie, type = 'movies' }: MovieCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const title = movie.title || movie.name;
  const releaseYear = (movie.release_date || movie.first_air_date)?.split('-')[0];
  const detailPath = `/${type === 'tv' ? 'tv' : 'movie'}/${movie.id}`;
  const posterUrl = getImageUrl(movie.poster_path, 'w500');

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(detailPath)}
      sx={{
        position: 'relative',
        minWidth: { xs: 120, sm: 150, md: 200 },
        height: { xs: 180, sm: 225, md: 300 },
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? { xs: 'scale(1.05)', sm: 'scale(1.1)' } : 'scale(1)',
        zIndex: isHovered ? 2 : 1,
        '&:hover': {
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        },
        touchAction: 'manipulation',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Fade in={isHovered}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 0.5, sm: 1 },
            background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
            color: 'white',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'bold',
              mb: { xs: 0.2, sm: 0.5 },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.8rem', sm: '1rem' },
            }}
          >
            {title}
          </Typography>

          {releaseYear && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'rgba(255,255,255,0.7)',
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                mb: movie.progress ? 1 : 0,
              }}
            >
              {releaseYear}
            </Typography>
          )}
        </Box>
      </Fade>

      {movie.progress !== undefined && (
        <WatchProgressBar progress={movie.progress} />
      )}
    </Box>
  );
};

export default MovieCard; 