import {createFilm} from '../dev-data/random-film.js';

export default class PopupModel {
  popup = Array.from({length: 1}, createFilm);

  getPopup = () => this.popup;
}
