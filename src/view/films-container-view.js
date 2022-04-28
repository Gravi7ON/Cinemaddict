import {createElement} from '../render.js';

const createFlimsContainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsContainerView {
  getTemplate() {
    return createFlimsContainerTemplate();
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
