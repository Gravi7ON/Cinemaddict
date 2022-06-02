import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const createFilterMenuTemplate = (films, currentFilterType) => {
  const countWatchList = films.filter((item) => item.user_details.watchlist).length;
  const countHistory = films.filter((item) => item.user_details.already_watched).length;
  const countFavorites = films.filter((item) => item.user_details.favorite).length;

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item ${currentFilterType === FilterType.ALL ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.ALL}">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${currentFilterType === FilterType.WATCH_LIST ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.WATCH_LIST}">Watchlist <span class="main-navigation__item-count">${countWatchList}</span></a>
    <a href="#history" class="main-navigation__item ${currentFilterType === FilterType.WATCHED ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.WATCHED}">History <span class="main-navigation__item-count">${countHistory}</span></a>
    <a href="#favorites" class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${countFavorites}</span></a>
  </nav>`;
};

export default class FilterMenuView extends AbstractView {
  #films = null;
  #currentFilter = null;

  constructor(films, currentFilterType) {
    super();
    this.#films = films;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterMenuTemplate(this.#films, this.#currentFilter);
  }

  setFilterTypeElementClick = (callback) => {
    this._callback.filterTypeClick = callback;
    this.element.addEventListener('click', this.#filterTypeOnClick);
  };

  #filterTypeOnClick = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.dataset.filterType);
  };
}
