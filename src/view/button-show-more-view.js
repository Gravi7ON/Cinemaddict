import AbstractView from '../framework/view/abstract-view.js';

const createButtonShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ButtonShowMoreView extends AbstractView {
  get template() {
    return createButtonShowMoreTemplate();
  }

  setElementClick = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#onClick);
  };

  #onClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
