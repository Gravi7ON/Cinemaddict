import {createElement} from '../render.js';

const createFilmAmountTemplate = () => '<p>130 291 movies inside</p>';

export default class FilmAmountView {
  #element = null;

  get template() {
    return createFilmAmountTemplate();
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
