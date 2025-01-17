import { AppBar, Toolbar, Box, Button, IconButton, Avatar, Menu, MenuItem, TextField, Fade, Paper, Typography, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { searchMovies, Movie, getImageUrl } from '../services/tmdb';
import useDebounce from '../hooks/useDebounce';
import NotificationMenu from './NotificationMenu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' }
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genreAnchorEl, setGenreAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<null | HTMLElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await searchMovies(debouncedSearchQuery);
        setSearchResults(data.results.slice(0, 5));
      } catch (error) {
        console.error('Failed to search:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]);

  const handleAvatarMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAvatarAnchorEl(null);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleAvatarClose();
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleGenreMenu = (event: React.MouseEvent<HTMLElement>) => {
    setGenreAnchorEl(event.currentTarget);
  };

  const handleGenreClose = () => {
    setGenreAnchorEl(null);
  };

  return (
    <>
    <AppBar 
      position="fixed" 
      sx={{ 
          background: 'transparent',
          backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.7) 10%, transparent)',
          transition: 'background-color 0.3s',
          '&:hover': {
            backgroundColor: '#141414'
          },
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        <Box 
          component="img"
          src="/netflix-logo.png"
          alt="Netflix"
          sx={{ 
                height: { xs: '1.5rem', sm: '1.8rem' },
            cursor: 'pointer',
          }}
              onClick={() => handleNavigation('/')}
            />
            
            {!isHome && (
              <Box 
                sx={{ 
                  display: { xs: 'none', md: 'flex' }, 
                  gap: 2 
                }}
              >
                <Button 
                  color="inherit"
                  onClick={() => handleNavigation('/browse')}
                  sx={{ 
                    color: location.pathname === '/browse' ? 'white' : 'rgba(255,255,255,0.7)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  Movies
                </Button>
                <Button 
                  color="inherit"
                  onClick={() => handleNavigation('/tv')}
                  sx={{ 
                    color: location.pathname === '/tv' ? 'white' : 'rgba(255,255,255,0.7)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  TV Shows
                </Button>
                <Button
                  color="inherit"
                  onClick={handleGenreMenu}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  Genres
                </Button>
                <Menu
                  anchorEl={genreAnchorEl}
                  open={Boolean(genreAnchorEl)}
                  onClose={handleGenreClose}
                  TransitionComponent={Fade}
                  sx={{
                    '& .MuiPaper-root': {
                      bgcolor: 'rgba(0, 0, 0, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mt: 0.5,
                    },
                  }}
                >
                  {genres.map((genre) => (
                    <MenuItem
                      key={genre.id}
                      onClick={() => {
                        handleGenreClose();
                        navigate(`/genre/${genre.id}`);
                      }}
                      sx={{
                        color: 'white',
                        fontSize: '0.9rem',
                        py: 1,
                        minWidth: 200,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      {genre.name}
                    </MenuItem>
                  ))}
                </Menu>
          <Button
                  color="inherit"
                  onClick={() => handleNavigation('/mylist')}
            sx={{
                    color: location.pathname === '/mylist' ? 'white' : 'rgba(255,255,255,0.7)',
                    '&:hover': { color: 'white' }
            }}
          >
                  My List
          </Button>
              </Box>
            )}

            {!isHome && (
              <IconButton
                color="inherit"
                sx={{ display: { xs: 'flex', md: 'none' } }}
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          {!isHome && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                position: 'relative',
                width: showSearch ? { xs: '100%', sm: 'auto' } : 'auto',
              }}>
                <Fade in={showSearch}>
                  <TextField
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    variant="standard"
                    sx={{
                      width: showSearch ? { xs: '100%', sm: 300 } : 0,
                      transition: 'width 0.3s',
                      mr: 1,
                      '& .MuiInput-root': {
                        color: 'white',
                        '&:before, &:after': {
                          borderColor: 'white',
                        },
                      },
                      '& .MuiInput-input': {
                        color: 'white',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '&::placeholder': {
                          color: 'rgba(255,255,255,0.7)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Fade>
                <IconButton 
                  color="inherit" 
                  onClick={handleSearchToggle}
                  sx={{ 
                    color: 'white',
                    padding: { xs: '4px', sm: '8px' }
                  }}
                >
                  {showSearch ? <CloseIcon /> : <SearchIcon />}
                </IconButton>

                {showSearch && searchQuery && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      width: { xs: '100vw', sm: 300 },
                      maxWidth: '100%',
                      mt: 1,
                      bgcolor: '#141414',
                      borderRadius: 1,
                      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                      zIndex: 1000,
                    }}
                  >
                    {isLoading ? (
                      <Box sx={{ p: 2, color: 'white' }}>
                        <Typography>Loading...</Typography>
                      </Box>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <Box
                          key={result.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.1)',
                            },
                          }}
                          onClick={() => {
                            navigate(`/movie/${result.id}`);
                            handleSearchToggle();
                          }}
                        >
                          <Box
                            component="img"
                            src={getImageUrl(result.poster_path, 'w500')}
                            alt={result.title || result.name}
                            sx={{
                              width: 50,
                              height: 75,
                              borderRadius: 0.5,
                              mr: 2,
                              objectFit: 'cover',
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white' }}>
                              {result.title || result.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {result.release_date?.split('-')[0] || result.first_air_date?.split('-')[0]}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ p: 2, color: 'white' }}>
                        <Typography>No results found</Typography>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
              
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                <IconButton 
                  color="inherit"
                  onClick={handleNotificationMenu}
                >
                  <NotificationMenu
                    anchorEl={notificationAnchorEl}
                    onClose={handleNotificationClose}
                  />
                </IconButton>
                <IconButton
                  onClick={handleAvatarMenu}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    alt="Profile"
                    src="/netflix-avatar.png"
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 300,
            bgcolor: '#141414',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Menu</Typography>
            <IconButton 
              color="inherit" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List>
            <ListItem 
              onClick={() => {
                handleNavigation('/browse');
                setMobileMenuOpen(false);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText primary="Movies" />
            </ListItem>
            <ListItem 
              onClick={() => {
                handleNavigation('/tv');
                setMobileMenuOpen(false);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText primary="TV Shows" />
            </ListItem>
            <ListItem 
              onClick={() => {
                handleNavigation('/mylist');
                setMobileMenuOpen(false);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText primary="My List" />
            </ListItem>
            <ListItem 
              onClick={handleGenreMenu}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText primary="Genres" />
              <ArrowDropDownIcon />
            </ListItem>
          </List>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />

          <List>
            <ListItem 
              onClick={() => {
                handleNavigation('/profile');
                setMobileMenuOpen(false);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem 
              onClick={() => {
                handleNavigation('/account');
                setMobileMenuOpen(false);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText primary="Account" />
            </ListItem>
            <ListItem 
              onClick={() => {
                handleNavigation('/');
                setMobileMenuOpen(false);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Menu
        anchorEl={genreAnchorEl}
        open={Boolean(genreAnchorEl)}
        onClose={handleGenreClose}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mt: 0.5,
          },
        }}
      >
        {genres.map((genre) => (
          <MenuItem
            key={genre.id}
            onClick={() => {
              handleGenreClose();
              setMobileMenuOpen(false);
              navigate(`/genre/${genre.id}`);
            }}
            sx={{
              color: 'white',
              fontSize: '0.9rem',
              py: 1,
              minWidth: 200,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {genre.name}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={avatarAnchorEl}
        open={Boolean(avatarAnchorEl)}
        onClose={handleAvatarClose}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mt: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={() => handleNavigation('/profile')}
          sx={{
            color: 'white',
            fontSize: '0.9rem',
            py: 1,
            minWidth: 150,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigation('/account')}
          sx={{
            color: 'white',
            fontSize: '0.9rem',
            py: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Account
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigation('/')}
          sx={{
            color: 'white',
            fontSize: '0.9rem',
            py: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar; 