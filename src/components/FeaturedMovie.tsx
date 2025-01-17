import { Box, Typography, Button, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Movie, MovieResponse, getTrendingMovies, getTrendingTVShows, getImageUrl } from '../services/tmdb';
import { addToMyList, removeFromMyList, isInMyList } from '../services/myList';
import VideoPlayer from './VideoPlayer';

interface FeaturedMovieProps {
  type?: 'movies' | 'tv' | 'mylist';
}

const FeaturedMovie = ({ type = 'movies' }: FeaturedMovieProps) => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inMyList, setInMyList] = useState(false);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setIsLoading(true);
        const data = await (type === 'tv' ? getTrendingTVShows() : getTrendingMovies());
        // Randomly select one of the top 10 trending items
        const randomIndex = Math.floor(Math.random() * Math.min(10, data.results.length));
        const selectedMovie = data.results[randomIndex];
        setFeatured(selectedMovie);
        setInMyList(isInMyList(selectedMovie.id));
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatured();
  }, [type]);

  const handleMyList = () => {
    if (!featured) return;
    
    if (inMyList) {
      removeFromMyList(featured.id);
      setInMyList(false);
    } else {
      addToMyList(featured);
      setInMyList(true);
    }
  };

  if (isLoading || !featured) return null;

  const title = featured.title || featured.name;
  const releaseYear = (featured.release_date || featured.first_air_date)?.split('-')[0];
  const detailPath = `/${type === 'tv' ? 'tv' : 'movie'}/${featured.id}`;

  return (
    <>
      <Box
        sx={{
          height: '85vh',
          position: 'relative',
          backgroundImage: `linear-gradient(to bottom, rgba(20,20,20,0.2), rgba(20,20,20,1)), url("${getImageUrl(featured.backdrop_path)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          color: 'white',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '7.4rem',
            backgroundImage: 'linear-gradient(180deg, transparent, rgba(20,20,20,0.6), #141414)',
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            pl: { xs: 4, sm: 10 },
            pr: { xs: 4, sm: 0 },
            width: { xs: '100%', sm: '50%' }
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' }
            }}
          >
            {title}
          </Typography>

          {releaseYear && (
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {releaseYear}
            </Typography>
          )}

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {featured.overview}
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1, sm: 2 }}
            sx={{ 
              width: '100%',
              '& .MuiButton-root': {
                width: { xs: '100%', sm: 'auto' }
              }
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={() => setShowTrailer(true)}
              sx={{
                bgcolor: 'white',
                color: 'black',
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                textTransform: 'none',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.75)',
                },
                px: { xs: 2, sm: 4 },
                py: 1,
                minWidth: { xs: '100%', sm: 130 },
              }}
            >
              Play
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={inMyList ? <RemoveIcon /> : <AddIcon />}
              onClick={handleMyList}
              sx={{
                bgcolor: 'rgba(109, 109, 110, 0.7)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                textTransform: 'none',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(109, 109, 110, 0.4)',
                },
                px: { xs: 2, sm: 4 },
                py: 1,
                minWidth: { xs: '100%', sm: 130 },
              }}
            >
              {inMyList ? 'Remove' : 'My List'}
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<InfoOutlinedIcon />}
              onClick={() => navigate(detailPath)}
              sx={{
                bgcolor: 'rgba(109, 109, 110, 0.7)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                textTransform: 'none',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(109, 109, 110, 0.4)',
                },
                px: { xs: 2, sm: 4 },
                py: 1,
                minWidth: { xs: '100%', sm: 130 },
              }}
            >
              More Info
            </Button>
          </Stack>
        </Box>
      </Box>

      <VideoPlayer
        open={showTrailer}
        onClose={() => setShowTrailer(false)}
        movieId={featured.id}
        type={type === 'tv' ? 'tv' : 'movie'}
      />
    </>
  );
};

export default FeaturedMovie; 