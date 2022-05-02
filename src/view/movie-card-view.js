/* eslint-disable camelcase */
import {createElement} from '../render.js';
import {formatDate} from '../utils.js';

const createMovieCardTemplate = (film) => {
  const {film_info, comments} = film;
  const durationHours = Math.floor(film_info.runtime / 60);
  const durationMunutes = film_info.runtime - 60 * durationHours;
  const releaseYear = formatDate(film_info.release.date).format('YYYY');

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${film_info.title}</h3>
        <p class="film-card__rating">${film_info.total_rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${releaseYear}</span>
          <span class="film-card__duration">${durationHours}h ${durationMunutes}m</span>
          <span class="film-card__genre">${film_info.genre[0]}</span>
        </p>
        <img src="./${film_info.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${film_info.description}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class MovieCardView {
  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createMovieCardTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}