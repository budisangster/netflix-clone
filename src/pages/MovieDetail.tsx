import { Box, Typography, Button, Stack, CircularProgress, Grid, Rating, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Movie, getMovieDetails, getTVShowDetails, getMovieCredits, getTVShowCredits, getImageUrl, Season, Episode, getTVShowSeasons } from '../services/tmdb';
import { addToMyList, removeFromMyList, isInMyList } from '../services/myList';
import VideoPlayer from '../components/VideoPlayer';
import SeasonSelector from '../components/SeasonSelector';

interface Credits {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string;
  }>;
}

interface MovieDetailProps {
  mediaType: 'movie' | 'tv';
}

const MovieDetail = ({ mediaType }: MovieDetailProps) => {
  const { id } = useParams();
  const [details, setDetails] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inMyList, setInMyList] = useState(false);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [currentSeason, setCurrentSeason] = useState<number>(1);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [movieData, creditsData] = await Promise.all([
          mediaType === 'movie' ? getMovieDetails(id) : getTVShowDetails(id),
          mediaType === 'movie' ? getMovieCredits(id) : getTVShowCredits(id)
        ]);
        
        setDetails(movieData);
        setCredits(creditsData);

        // Fetch seasons data for TV shows
        if (mediaType === 'tv') {
          const tvData = await getTVShowSeasons(id);
          setSeasons(tvData.seasons || []);
        }
      } catch (error) {
        console.error('Failed to fetch details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType]);

  useEffect(() => {
    if (details?.id) {
      setInMyList(isInMyList(details.id));
    }
  }, [details?.id]);

  const handleMyList = () => {
    if (!details) return;
    
    if (inMyList) {
      removeFromMyList(details.id);
      setInMyList(false);
    } else {
      addToMyList(details);
      setInMyList(true);
    }
  };

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
    setShowTrailer(true);
  };

  const handleNextEpisode = (episode: Episode) => {
    setSelectedEpisode(episode);
    // No need to set showTrailer to true as it's already playing
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!details) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          color: 'white',
        }}
      >
        <Typography variant="h5">Content not found</Typography>
      </Box>
    );
  }

  const title = details.title || details.name;
  const releaseYear = (details.release_date || details.first_air_date)?.split('-')[0];
  const type = details.first_air_date ? 'tv' : 'movie';
  const director = credits?.crew.find(person => person.job === 'Director');
  const writers = credits?.crew.filter(person => ['Writer', 'Screenplay'].includes(person.job));
  const cast = credits?.cast.slice(0, 6) || [];

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          pt: { xs: '56px', sm: '64px' },
          position: 'relative',
          pb: 4,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: { xs: '40vh', sm: '60vh', md: '70vh' },
            backgroundImage: `linear-gradient(to bottom, rgba(20,20,20,0.2), rgba(20,20,20,1)), url("${getImageUrl(details.backdrop_path)}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            px: { xs: 2, sm: 4, md: 6 },
            pt: { xs: '20vh', sm: '30vh', md: '35vh' },
            maxWidth: 'xl',
            mx: 'auto',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem' },
              color: 'white',
            }}
          >
            {title}
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1, sm: 2 }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            sx={{ mb: { xs: 1, sm: 2 } }}
          >
            <Rating 
              value={details.vote_average / 2} 
              precision={0.5} 
              readOnly 
              size="small"
              sx={{ color: 'primary.main' }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {releaseYear}
              {details.runtime && ` • ${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`}
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                mt: { xs: 0.5, sm: 0 }
              }}
            >
              {details.genres?.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                />
              ))}
            </Box>
          </Stack>

          <Typography
            variant="body1"
            sx={{
              mb: { xs: 2, sm: 4 },
              color: 'white',
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
              maxWidth: '60ch',
              lineHeight: 1.6,
            }}
          >
            {details.overview}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
            sx={{ mb: { xs: 4, sm: 6 } }}
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
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                textTransform: 'none',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.75)',
                },
                px: { xs: 4, sm: 6 },
                py: { xs: 1, sm: 1.5 },
                minWidth: { xs: '100%', sm: 200 },
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
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                textTransform: 'none',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(109, 109, 110, 0.4)',
                },
                px: { xs: 4, sm: 6 },
                py: { xs: 1, sm: 1.5 },
                minWidth: { xs: '100%', sm: 200 },
              }}
            >
              {inMyList ? 'Remove from My List' : 'Add to My List'}
            </Button>
          </Stack>

          {/* Cast & Crew Section */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                mb: { xs: 1.5, sm: 2 },
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              Cast & Crew
            </Typography>
            
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {cast.map((person) => (
                <Grid item xs={4} sm={4} md={2} key={person.id}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: '100%',
                        paddingBottom: '100%',
                        borderRadius: '50%',
                        position: 'relative',
                        overflow: 'hidden',
                        mb: { xs: 0.5, sm: 1 },
                        bgcolor: 'grey.800',
                      }}
                    >
                      {person.profile_path && (
                        <Box
                          component="img"
                          src={getImageUrl(person.profile_path, 'w500')}
                          alt={person.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      {person.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        display: 'block',
                      }}
                    >
                      {person.character}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Additional Details Section */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                mb: { xs: 1.5, sm: 2 },
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              Details
            </Typography>
            
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {director && (
                <Grid item xs={12} sm={4}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Director
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'white',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {director.name}
                  </Typography>
                </Grid>
              )}
              
              {writers && writers.length > 0 && (
                <Grid item xs={12} sm={4}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Writers
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'white',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {writers.map(writer => writer.name).join(', ')}
                  </Typography>
                </Grid>
              )}
              
              {details.genres && (
                <Grid item xs={12} sm={4}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Genres
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'white',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {details.genres.map(genre => genre.name).join(', ')}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Season Selector for TV Shows */}
          {mediaType === 'tv' && seasons.length > 0 && (
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  mb: { xs: 1.5, sm: 2 },
                  fontWeight: 'bold',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Episodes
              </Typography>
              
              <SeasonSelector
                tvId={id || ''}
                seasons={seasons}
                onEpisodeSelect={handleEpisodeSelect}
              />
            </Box>
          )}
        </Box>
      </Box>

      <VideoPlayer
        open={showTrailer}
        onClose={() => {
          setShowTrailer(false);
          setSelectedEpisode(null);
        }}
        movieId={selectedEpisode?.id || details?.id || 0}
        type={mediaType}
        seasonNumber={selectedEpisode?.season_number || currentSeason}
        episodeNumber={selectedEpisode?.episode_number}
        onNextEpisode={mediaType === 'tv' ? handleNextEpisode : undefined}
      />
    </>
  );
};

export default MovieDetail; 