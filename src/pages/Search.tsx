import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchMovies, MovieResponse } from '../services/tmdb';
import MovieRow from '../components/MovieRow';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<MovieResponse>({ results: [] });

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        const results = await searchMovies(query);
        setSearchResults(results);
      } else {
        setSearchResults({ results: [] });
      }
    };

    fetchResults();
  }, [query]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 12 }}>
      {searchResults.results.length > 0 ? (
        <MovieRow 
          title={`Search Results for "${query}"`} 
          fetchMovies={() => Promise.resolve(searchResults)} 
          type="movies"
        />
      ) : (
        <Box sx={{ p: 4, color: 'white', textAlign: 'center' }}>
          {query ? 'No results found.' : 'Enter a search query to find movies and TV shows.'}
        </Box>
      )}
    </Box>
  );
};

export default Search; 