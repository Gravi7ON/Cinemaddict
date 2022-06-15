import AbstractView from '../framework/view/abstract-view.js';

const createFilmsTopRatedListTemplate = () => (
  `<section class="films-list films-list--extra films-list--rated">
    <h2 class="films-list__title">Top rated</h2>
  </section>`
);

export default class FilmsTopRatedListView extends AbstractView {
  get template() {
    return createFilmsTopRatedListTemplate();
  }
}
