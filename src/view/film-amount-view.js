import {createElement} from '../render.js';

const createFilmAmountTemplate = (film) => `<p>${film.length} ${film.length > 1 ? 'movies' : 'movie'} inside</p>`;

export default class FilmAmountView {
  #element = null;
  #films = null;

  constructor(film) {
    this.#films = film;
  }

  get template() {
    return createFilmAmountTemplate(this.#films);
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
