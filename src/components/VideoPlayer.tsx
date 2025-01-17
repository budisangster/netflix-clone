import { Box, Dialog, IconButton, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, useRef, useCallback } from 'react';
import { getTrailer, saveEpisodeProgress, getNextEpisode, Episode } from '../services/tmdb';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface VideoPlayerProps {
  open: boolean;
  onClose: () => void;
  movieId: number;
  type: 'movie' | 'tv';
  seasonNumber?: number;
  episodeNumber?: number;
  onNextEpisode?: (episode: Episode) => void;
}

const VideoPlayer = ({ 
  open, 
  onClose, 
  movieId, 
  type,
  seasonNumber,
  episodeNumber,
  onNextEpisode 
}: VideoPlayerProps) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<number | null>(null);
  const playerContainerId = 'youtube-player';

  const onPlayerReady = useCallback(() => {
    setIsLoading(false);
    if (type === 'tv' && seasonNumber && episodeNumber) {
      startProgressTracking();
    }
  }, [type, seasonNumber, episodeNumber]);

  const onPlayerStateChange = useCallback((event: any) => {
    // YT.PlayerState.ENDED = 0
    if (event.data === 0 && type === 'tv' && onNextEpisode) {
      handleVideoEnd();
    }
  }, [type, onNextEpisode]);

  const createPlayer = useCallback((videoId: string) => {
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player(playerContainerId, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    }
  }, [onPlayerReady, onPlayerStateChange]);

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      if (trailerKey) {
        createPlayer(trailerKey);
      }
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [trailerKey, createPlayer]);

  const startProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = window.setInterval(() => {
      if (playerRef.current && type === 'tv' && seasonNumber && episodeNumber) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        const progress = (currentTime / duration) * 100;
        
        saveEpisodeProgress(movieId, seasonNumber, episodeNumber, progress);
      }
    }, 5000);
  };

  const handleVideoEnd = async () => {
    if (type === 'tv' && seasonNumber && episodeNumber && onNextEpisode) {
      try {
        const nextEpisode = await getNextEpisode(movieId, seasonNumber, episodeNumber);
        if (nextEpisode) {
          onNextEpisode(nextEpisode);
        }
      } catch (error) {
        console.error('Failed to load next episode:', error);
      }
    }
  };

  useEffect(() => {
    const loadTrailer = async () => {
      if (open && movieId) {
        setIsLoading(true);
        setShowFallbackMessage(false);
        setError(null);
        try {
          const key = await getTrailer(movieId, type, seasonNumber, episodeNumber);
          if (!key) {
            setError(type === 'tv' ? 'This TV show or episode is not available.' : 'This title is not available.');
            setIsLoading(false);
            return;
          }
          setTrailerKey(key);
          if (key && window.YT && window.YT.Player) {
            createPlayer(key);
          }
          // If we're trying to play an episode but got the show's trailer instead
          if (type === 'tv' && seasonNumber && episodeNumber && key) {
            setShowFallbackMessage(true);
          }
        } catch (error) {
          console.error('Failed to load trailer:', error);
          setError('Unable to play this title. Please try again later.');
          setIsLoading(false);
        }
      }
    };

    loadTrailer();
  }, [open, movieId, type, seasonNumber, episodeNumber, createPlayer]);

  const handleClose = () => {
    setTrailerKey(null);
    setIsLoading(true);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    if (playerRef.current) {
      playerRef.current.destroy();
    }
    onClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionProps={{
        timeout: 400
      }}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'black',
          transition: 'all 0.3s ease-in-out',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }
      }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: { xs: 8, sm: 16 },
            top: { xs: 8, sm: 16 },
            color: 'white',
            zIndex: 2,
            bgcolor: 'rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {showFallbackMessage && (
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 16 },
              left: { xs: 8, sm: 16 },
              right: { xs: 56, sm: 80 },
              zIndex: 2,
              bgcolor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              p: { xs: 1.5, sm: 2 },
              borderRadius: 1,
              animation: 'fadeIn 0.3s ease-in-out',
              '@keyframes fadeIn': {
                from: {
                  opacity: 0,
                  transform: 'translateY(-10px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}
            >
              Episode preview not available. Showing TV show trailer instead.
            </Typography>
          </Box>
        )}

        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <CircularProgress 
              sx={{ 
                color: '#E50914',
                filter: 'drop-shadow(0 0 8px rgba(229,9,20,0.3))'
              }} 
            />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'white',
              p: 3,
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                maxWidth: '600px'
              }}
            >
              {error}
            </Typography>
          </Box>
        ) : trailerKey ? (
          <Box
            id={playerContainerId}
            sx={{
              width: '100%',
              height: '100%',
              animation: 'fadeIn 0.5s ease-in-out',
            }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'white',
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <Typography 
              variant="h6"
              sx={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                maxWidth: '600px'
              }}
            >
              No trailer available
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default VideoPlayer; 