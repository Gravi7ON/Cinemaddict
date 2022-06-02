import {FilterType} from '../const.js';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCH_LIST]: (films) => films.filter((item) => item.user_details.watchlist),
  [FilterType.WATCHED]: (films) => films.filter((item) => item.user_details.already_watched),
  [FilterType.FAVORITES]: (films) => films.filter((item) => item.user_details.favorite),
};

export {filter};
