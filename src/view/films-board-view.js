import {createElement} from '../render.js';

const createFilmsBoardTemplate = () => '<section class="films"></section>';

export default class FilmsBoardView {
  #element = null;

  get template() {
    return createFilmsBoardTemplate();
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
