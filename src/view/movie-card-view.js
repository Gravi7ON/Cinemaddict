/* eslint-disable camelcase */
import AbstractView from '../framework/view/abstract-view.js';
import {formatDate, getShortDescription} from '../utils/film.js';

const classStyleButtonsCard = 'film-card__controls-item--active';

const createMovieCardTemplate = (film) => {
  const {film_info, comments, user_details} = film;
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
        <p class="film-card__description">${getShortDescription(film_info.description)}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${user_details.watchlist ? classStyleButtonsCard : ''}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${user_details.already_watched ? classStyleButtonsCard : ''}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${user_details.favorite ? classStyleButtonsCard : ''}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class MovieCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createMovieCardTemplate(this.#film);
  }

  setElementClick = (callback) => {
    this._callback.cardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#onClick);
  };

  setWatchlistElementClick = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#onWatchlistClick);
  };

  setWatchedElementClick = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#onWatchedClick);
  };

  setFavoriteElementClick = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#onFavoriteClick);
  };

  #onClick = (evt) => {
    evt.preventDefault();
    this._callback.cardClick();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(evt);
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(evt);
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(evt);
  };
}
