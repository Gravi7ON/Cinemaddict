import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

// const classStyleButtonsSort = 'sort__button--active';

const createSortMenuTemplate = (currentSortType) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortMenuView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortMenuTemplate(this.#currentSortType);
  }

  setSortTypeElementClick = (callback) => {
    this._callback.sortTypeClick = callback;
    this.element.addEventListener('click', this.#sortTypeOnMenuClick);
  };

  #sortTypeOnMenuClick = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeClick(evt.target.dataset.sortType);
  };
}
