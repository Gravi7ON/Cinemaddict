import {createElement} from '../render.js';

const createFilmAmountTemplate = () => '<p>130 291 movies inside</p>';

export default class FilmAmountView {
  getTemplate() {
    return createFilmAmountTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
