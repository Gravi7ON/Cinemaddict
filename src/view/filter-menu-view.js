import {createElement} from '../render.js';

const createFilterMenuTemplate = (films) => {
  const countWatchList = films.filter((item) => item.user_details.watchlist).length;
  const countHistory = films.filter((item) => item.user_details.already_watched).length;
  const countFavorites = films.filter((item) => item.user_details.favorite).length;

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${countWatchList}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${countHistory}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${countFavorites}</span></a>
  </nav>`;
};

export default class FilterMenuView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get template() {
    return createFilterMenuTemplate(this.#films);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
