import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCH_LIST]: 'There are no movies to watch now',
  [FilterType.WATCHED]: 'There are no watched movies now',
  [FilterType.FAVORITE]: 'There are no favorite movies now'
};

const createFilmsListEmptyTemplate = (filterType) => {
  const noFilmsTextValue = NoFilmsTextType[filterType];

  return `<section class="films-list">
    <h2 class="films-list__title">${noFilmsTextValue}</h2>
  </section>`;
};

export default class FilmsListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createFilmsListEmptyTemplate(this.#filterType);
  }
}
