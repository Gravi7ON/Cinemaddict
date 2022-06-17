import AbstractView from '../framework/view/abstract-view.js';

const createFilmAmountTemplate = (films) => `<p>${films.length} movies inside</p>`;

export default class FilmAmountView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilmAmountTemplate(this.#films);
  }
}
