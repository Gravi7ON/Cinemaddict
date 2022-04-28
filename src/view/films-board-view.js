import {createElement} from '../render.js';

const createFlimsBoardTemplate = () => '<section class="films"></section>';

export default class FilmsBoardView {
  getTemplate() {
    return createFlimsBoardTemplate();
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
