import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

const classStyleButtonsSort = 'sort__button--active';

const createSortMenuTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortMenuView extends AbstractView {
  get template() {
    return createSortMenuTemplate();
  }

  #sortTypeOnMenuClick = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeClick(evt.target.dataset.sortType);

    const buttons = this.element.querySelectorAll('.sort__button');
    buttons.forEach((button) => button.classList.remove(classStyleButtonsSort));
    evt.target.classList.add(classStyleButtonsSort);
  };

  setSortTypeElementClick = (callback) => {
    this._callback.sortTypeClick = callback;
    this.element.addEventListener('click', this.#sortTypeOnMenuClick);
  };

}
