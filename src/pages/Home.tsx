import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.9) 100%), url('/hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: { xs: 2, sm: 4 }
        }}
      >
        <Box>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
              mb: { xs: 3, sm: 4 },
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Unlimited movies, TV shows, and more
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}
          >
            Watch anywhere. Cancel anytime.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: { xs: 4, sm: 5 },
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            Ready to watch? Enter your email to create or restart your membership.
          </Typography>

          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 3 },
              justifyContent: 'center',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/browse')}
              sx={{
                bgcolor: '#e50914',
                color: 'white',
                px: { xs: 4, sm: 6 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                '&:hover': {
                  bgcolor: '#b2070f'
                },
                textTransform: 'none',
                minWidth: { xs: '100%', sm: 'auto' },
                flex: { sm: 1 }
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: { xs: 4, sm: 6 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                },
                textTransform: 'none',
                minWidth: { xs: '100%', sm: 'auto' },
                flex: { sm: 1 }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 