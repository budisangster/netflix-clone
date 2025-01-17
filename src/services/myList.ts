import { Movie } from './tmdb';

const MY_LIST_KEY = 'netflix_clone_my_list';

export const getMyList = (): Movie[] => {
  const list = localStorage.getItem(MY_LIST_KEY);
  return list ? JSON.parse(list) : [];
};

export const addToMyList = (movie: Movie) => {
  const list = getMyList();
  if (!list.some(item => item.id === movie.id)) {
    list.push(movie);
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(list));
  }
};

export const removeFromMyList = (movieId: number) => {
  const list = getMyList();
  const updatedList = list.filter(item => item.id !== movieId);
  localStorage.setItem(MY_LIST_KEY, JSON.stringify(updatedList));
};

export const isInMyList = (movieId: number): boolean => {
  const list = getMyList();
  return list.some(item => item.id === movieId);
}; 