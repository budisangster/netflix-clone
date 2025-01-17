import { Box, Typography, Grid, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { Movie } from '../services/tmdb';
import { getMyList } from '../services/myList';

const MyList = () => {
  const [savedContent, setSavedContent] = useState<Movie[]>([]);

  useEffect(() => {
    const list = getMyList();
    setSavedContent(list);
  }, []);

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
          My List
        </Typography>

        {savedContent.length > 0 ? (
          <Grid container spacing={2}>
            {savedContent.map((item) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                <MovieCard 
                  movie={item} 
                  type={item.first_air_date ? 'tv' : 'movies'} 
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              textAlign: 'center',
              mt: 4
            }}
          >
            Your list is empty. Add some movies or TV shows to get started!
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default MyList; 