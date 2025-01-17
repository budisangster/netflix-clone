import { Box, Typography, Grid, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Movie, getMoviesByGenre, getTVShowsByGenre } from '../services/tmdb';

const genres: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  14: 'Fantasy',
  27: 'Horror',
  10749: 'Romance',
  878: 'Science Fiction',
  53: 'Thriller'
};

const Genre = () => {
  const { id } = useParams<{ id: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const [movieData, tvData] = await Promise.all([
          getMoviesByGenre(parseInt(id)),
          getTVShowsByGenre(parseInt(id))
        ]);
        setMovies(movieData.results);
        setTVShows(tvData.results);
      } catch (error) {
        console.error('Failed to load genre content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [id]);

  if (!id || !genres[parseInt(id)]) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: '#141414',
        pt: { xs: '76px', sm: '84px' },
        color: 'white'
      }}>
        <Container>
          <Typography variant="h4">Genre not found</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#141414',
      pt: { xs: '76px', sm: '84px' },
      pb: 4
    }}>
      <Container>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: 'white',
            mb: { xs: 3, sm: 4 },
            fontWeight: 'bold'
          }}
        >
          {genres[parseInt(id)]}
        </Typography>

        {!isLoading && (
          <>
            {movies.length > 0 && (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    mb: 2,
                    fontWeight: 500
                  }}
                >
                  Movies
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {movies.map((movie) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
                      <MovieCard movie={movie} type="movies" />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {tvShows.length > 0 && (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    mb: 2,
                    fontWeight: 500
                  }}
                >
                  TV Shows
                </Typography>
                <Grid container spacing={2}>
                  {tvShows.map((show) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={show.id}>
                      <MovieCard movie={show} type="tv" />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {movies.length === 0 && tvShows.length === 0 && (
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  mt: 4
                }}
              >
                No content found for this genre
              </Typography>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Genre; 