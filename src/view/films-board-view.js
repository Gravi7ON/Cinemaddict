import AbstractView from '../framework/view/abstract-view.js';

const createFilmsBoardTemplate = () => '<section class="films"></section>';

export default class FilmsBoardView extends AbstractView{
  get template() {
    return createFilmsBoardTemplate();
  }
}
