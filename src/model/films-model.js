import {createFilm} from '../mock/film.js';

export default class FilmsModel {
  films = Array.from({length: 5}, createFilm);

  getFilms = () => this.films;
}
