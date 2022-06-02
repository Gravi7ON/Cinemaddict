const Films = {
  COMMON_LIST: 'common',
  RATED_LIST: 'rated',
  COMMENTED_LIST: 'commented'
};

const FILMS_COUNT_PER_STEP = 5;

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const FilterType = {
  ALL: 'all',
  WATCH_LIST: 'watch',
  WATCHED: 'watched',
  FAVORITES: 'favorites'
};

export {Films, Mode, SortType, FILMS_COUNT_PER_STEP, UpdateType, UserAction, FilterType};
