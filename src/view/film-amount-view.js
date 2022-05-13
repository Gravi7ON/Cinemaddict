import AbstractView from '../framework/view/abstract-view.js';

const createFilmAmountTemplate = (films) => `<p>${films.length} ${films.length > 1 ? 'movies' : 'movie'} inside</p>`;

export default class FilmAmountView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilmAmountTemplate(this.#films);
  }
}
