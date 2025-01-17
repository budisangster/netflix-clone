import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#141414',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        pt: { xs: '56px', sm: '64px' },
        px: 2,
        textAlign: 'center'
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '4rem', sm: '6rem' },
          fontWeight: 'bold',
          mb: 2,
          color: 'primary.main'
        }}
      >
        404
      </Typography>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        Lost your way?
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '600px',
          fontSize: { xs: '1rem', sm: '1.1rem' }
        }}
      >
        Sorry, we can't find that page. You'll find lots to explore on the home page.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/')}
        sx={{
          bgcolor: 'white',
          color: 'black',
          fontWeight: 'bold',
          fontSize: { xs: '0.9rem', sm: '1.1rem' },
          textTransform: 'none',
          px: { xs: 4, sm: 6 },
          py: { xs: 1, sm: 1.5 },
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.9)',
          }
        }}
      >
        Netflix Home
      </Button>
      <Typography
        variant="body2"
        sx={{
          mt: 4,
          color: 'rgba(255,255,255,0.7)',
          fontSize: { xs: '0.8rem', sm: '0.9rem' }
        }}
      >
        Error Code: NSES-404
      </Typography>
    </Box>
  );
};

export default NotFound; 