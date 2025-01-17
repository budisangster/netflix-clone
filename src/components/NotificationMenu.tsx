import { Menu, MenuItem, Typography, Box, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  isNew: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Arrival',
    message: 'Stranger Things Season 5 is now available',
    date: '1 hour ago',
    isNew: true,
  },
  {
    id: 2,
    title: 'Continue Watching',
    message: 'Continue watching "The Witcher" where you left off',
    date: '3 hours ago',
    isNew: true,
  },
  {
    id: 3,
    title: 'Recommendation',
    message: 'Based on your watching history, you might like "Dark"',
    date: '1 day ago',
    isNew: false,
  },
];

interface NotificationMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

const NotificationMenu = ({ anchorEl, onClose }: NotificationMenuProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleNotificationClick = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isNew: false } : notif
      )
    );
  };

  const newNotificationsCount = notifications.filter(n => n.isNew).length;

  return (
    <>
      <Badge badgeContent={newNotificationsCount} color="error">
        <NotificationsIcon />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 320,
            maxHeight: 400,
            bgcolor: '#141414',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              sx={{
                py: 1.5,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                bgcolor: notification.isNew ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'white',
                    fontWeight: notification.isNew ? 'bold' : 'normal',
                  }}
                >
                  {notification.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.8rem',
                    mt: 0.5,
                  }}
                >
                  {notification.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    display: 'block',
                    mt: 0.5,
                  }}
                >
                  {notification.date}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
              No notifications
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu; 