import {createElement} from '../render.js';

const createFilmAmountTemplate = (films) => `<p>${films.length} ${films.length > 1 ? 'movies' : 'movie'} inside</p>`;

export default class FilmAmountView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
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
