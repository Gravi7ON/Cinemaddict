import AbstractView from '../framework/view/abstract-view.js';

const createFilmsMostCommentedListTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>`
);

export default class FilmsMostCommentedListView extends AbstractView {
  get template() {
    return createFilmsMostCommentedListTemplate();
  }
}
