import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

const createFilterMenuTemplate = (films, currentFilterType) => (
  `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item ${currentFilterType === FilterType.ALL ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.ALL}">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${currentFilterType === FilterType.WATCH_LIST ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.WATCH_LIST}">Watchlist
    <span class="main-navigation__item-count" data-filter-type="${FilterType.WATCH_LIST}">${filter[FilterType.WATCH_LIST](films).length}</span>
    </a>
    <a href="#history" class="main-navigation__item ${currentFilterType === FilterType.WATCHED ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.WATCHED}">History
    <span class="main-navigation__item-count" data-filter-type="${FilterType.WATCHED}">${filter[FilterType.WATCHED](films).length}</span>
    </a>
    <a href="#favorites" class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.FAVORITE}">Favorites
    <span class="main-navigation__item-count" data-filter-type="${FilterType.FAVORITE}">${filter[FilterType.FAVORITE](films).length}</span>
    </a>
  </nav>`
);

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
    this.element.addEventListener('click', this.#onFilterTypeClick);
  };

  #onFilterTypeClick = (evt) => {
    if (evt.target.tagName !== 'A' && evt.target.tagName !== 'SPAN') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.dataset.filterType);
  };
}
