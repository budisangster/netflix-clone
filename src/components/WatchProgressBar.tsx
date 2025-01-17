import { Box, LinearProgress } from '@mui/material';

interface WatchProgressBarProps {
  progress: number;
}

const WatchProgressBar = ({ progress }: WatchProgressBarProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        bgcolor: 'rgba(255, 255, 255, 0.3)',
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: '100%',
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          '& .MuiLinearProgress-bar': {
            bgcolor: '#E50914',
          },
        }}
      />
    </Box>
  );
};

export default WatchProgressBar; 