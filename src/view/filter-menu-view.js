import AbstractView from '../framework/view/abstract-view.js';

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

export default class FilterMenuView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilterMenuTemplate(this.#films);
  }
}
