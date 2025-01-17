import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardMedia,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Button,
  LinearProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Season, Episode, getTVShowEpisodes, getImageUrl, getEpisodeProgressByTVShow } from '../services/tmdb';

interface SeasonSelectorProps {
  tvId: string;
  seasons: Season[];
  onEpisodeSelect: (episode: Episode) => void;
}

const SeasonSelector = ({ tvId, seasons, onEpisodeSelect }: SeasonSelectorProps) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [episodeProgress, setEpisodeProgress] = useState<{ [key: string]: number }>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const loadEpisodes = async () => {
      try {
        setIsLoading(true);
        const data = await getTVShowEpisodes(tvId, selectedSeason);
        setEpisodes(data.episodes);

        const progress = getEpisodeProgressByTVShow(parseInt(tvId));
        const progressMap = progress.reduce((acc, curr) => {
          const key = `${curr.seasonNumber}-${curr.episodeNumber}`;
          acc[key] = curr.progress;
          return acc;
        }, {} as { [key: string]: number });
        setEpisodeProgress(progressMap);
      } catch (error) {
        console.error('Failed to load episodes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEpisodes();
  }, [tvId, selectedSeason]);

  const handleSeasonChange = (event: SelectChangeEvent<number>) => {
    setSelectedSeason(event.target.value as number);
  };

  const getEpisodeProgress = (seasonNumber: number, episodeNumber: number) => {
    return episodeProgress[`${seasonNumber}-${episodeNumber}`] || 0;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <FormControl 
        variant="outlined" 
        sx={{ 
          minWidth: 200,
          mb: 3,
          '& .MuiOutlinedInput-root': {
            color: 'white',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,255,255,0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255,255,255,0.7)',
            '&.Mui-focused': {
              color: '#E50914',
            },
          },
          '& .MuiSelect-icon': {
            color: 'rgba(255,255,255,0.7)',
          },
        }}
      >
        <InputLabel id="season-select-label">Season</InputLabel>
        <Select
          labelId="season-select-label"
          value={selectedSeason}
          onChange={handleSeasonChange}
          label="Season"
        >
          {seasons.map((season) => (
            <MenuItem 
              key={season.season_number} 
              value={season.season_number}
              sx={{
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.9)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                '&.Mui-selected': {
                  bgcolor: 'rgba(229,9,20,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(229,9,20,0.3)',
                  },
                },
              }}
            >
              {season.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        {episodes.map((episode, index) => {
          const progress = getEpisodeProgress(selectedSeason, episode.episode_number);
          const isHovered = hoveredCard === episode.id;
          
          return (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={episode.id}
              sx={{
                animation: 'fadeInUp 0.5s ease-out',
                animationDelay: `${index * 0.1}s`,
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)'
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <Card
                onMouseEnter={() => setHoveredCard(episode.id)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    background: isHovered ? 
                      'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)' :
                      'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
                    transition: 'all 0.3s ease',
                    zIndex: 1,
                  },
                }}
              >
                {episode.still_path && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={getImageUrl(episode.still_path, 'w500')}
                    alt={episode.name}
                    sx={{
                      transition: 'all 0.3s ease',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                )}
                <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {episode.episode_number}. {episode.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mt: 1,
                      mb: 2,
                      opacity: isHovered ? 1 : 0.7,
                      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                      transition: 'all 0.3s ease',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {episode.overview}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mt: 'auto',
                      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => onEpisodeSelect(episode)}
                      sx={{
                        bgcolor: progress > 0 ? 'rgba(229,9,20,0.9)' : 'white',
                        color: progress > 0 ? 'white' : 'black',
                        transition: 'all 0.3s ease',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        '&:hover': {
                          bgcolor: progress > 0 ? '#E50914' : 'rgba(255,255,255,0.9)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {progress > 0 ? 'Resume' : 'Play'}
                    </Button>
                    
                    {episode.runtime && (
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: 'rgba(255,255,255,0.7)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        }}
                      >
                        {episode.runtime} min
                      </Typography>
                    )}
                  </Box>

                  {progress > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 3,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          borderRadius: 1,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#E50914',
                            transition: 'all 0.3s ease',
                          },
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SeasonSelector; 