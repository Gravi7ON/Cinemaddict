import {FilterType} from '../const.js';

const filter = {
  [FilterType.ALL]: (films) => [...films],
  [FilterType.WATCH_LIST]: (films) => films.filter((item) => item.userDetails.watchlist),
  [FilterType.WATCHED]: (films) => films.filter((item) => item.userDetails.alreadyWatched),
  [FilterType.FAVORITE]: (films) => films.filter((item) => item.userDetails.favorite)
};

export {filter};
