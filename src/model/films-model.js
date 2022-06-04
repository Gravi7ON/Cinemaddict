import Observable from '../framework/observable.js';
import {createFilm} from '../mock/film.js';
import {UPDATE_COUNT} from '../const.js';

export default class FilmsModel extends Observable {
  #films = Array.from({length: 25}, createFilm);

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films.splice(index, UPDATE_COUNT, update);
    this._notify(updateType, update);
  };

  deleteFilmComment = (updateType, films) => {
    this._notify(updateType, films);
  };
}
