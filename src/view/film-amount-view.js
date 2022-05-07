import {createElement} from '../render.js';

const createFilmAmountTemplate = (film) => `<p>${film.length} movies inside</p>`;

export default class FilmAmountView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createFilmAmountTemplate(this.#film);
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
