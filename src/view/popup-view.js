/* eslint-disable camelcase */
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {formatDate, getShortDescription, toggleButtonStyle} from '../utils/film.js';

const classStyleButtonsPopup = 'film-details__control-button--active';

const createGenreTemplate = (genres) => genres.reduce((previous, current) => `${previous}<span class="film-details__genre">${current}</span>`, '');
const createCommentsTemplate = (comments) => {
  const createdComments = [];

  for (const comment of comments) {
    const commentDate = formatDate(comment.date).format('YYYY/MM/DD hh:mm');
    const createdComment = (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
        </span>
        <div>
         <p class="film-details__comment-text">${comment.comment}</p>
         <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
         </p>
        </div>
      </li>`
    );

    createdComments.push(createdComment);
  }

  return createdComments.join('');
};

const createPopupTemplate = (popup) => {
  const {film_info, comments} = popup;
  const durationHours = Math.floor(film_info.runtime / 60);
  const durationMunutes = film_info.runtime - 60 * durationHours;
  const releaseDate = formatDate(film_info.release.date).format('D MMM YYYY');

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${film_info.poster}" alt="${film_info.alternative_title}">

              <p class="film-details__age">${film_info.age_rating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${film_info.title}</h3>
                  <p class="film-details__title-original">Original: ${film_info.title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${film_info.total_rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${film_info.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${film_info.actors.length > 1 ? 'Writers' : 'Writer'}</td>
                  <td class="film-details__cell">${film_info.writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${film_info.actors.length > 1 ? 'Actors' : 'Actor'}</td>
                  <td class="film-details__cell">${film_info.actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${durationHours}h ${durationMunutes}m</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${film_info.release.release_country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${film_info.genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">
                    ${createGenreTemplate(film_info.genre)}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${getShortDescription(film_info.description)}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">${comments.length > 1 ? 'Comments' : 'Comment'} <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${createCommentsTemplate(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                <img width="55" height="55" style="visibility: hidden">
                <input type="hidden" name="user-emoji" value="absent">
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class PopupView extends AbstractStatefulView {
  #popup = null;

  constructor(popup) {
    super();
    this.#popup = popup;
  }

  get template() {
    return createPopupTemplate(this.#popup);
  }

  setButtonCloseElementClick = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onClick);
  };

  setWatchlistElementClick = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#onWatchlistClick);
  };

  setWatchedElementClick = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#onWatchedClick);
  };

  setFavoriteElementClick = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#onFavoriteClick);
  };

  setEmotionElementChange = () => {
    this.element.querySelector('.film-details__inner').addEventListener('change', this.#onEmotionButtonClick);
  };

  _restoreHandlers = () => {

  };

  #onClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
    toggleButtonStyle(evt, classStyleButtonsPopup);
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
    toggleButtonStyle(evt, classStyleButtonsPopup);
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
    toggleButtonStyle(evt, classStyleButtonsPopup);
  };

  #onEmotionButtonClick = (evt) => {
    evt.preventDefault();

    if (evt.target.matches('input[type="radio"]')) {
      const userEmotionContainer = this.element.querySelector('.film-details__add-emoji-label');
      const userEmoji = userEmotionContainer.querySelector('img');
      const hiddenField = userEmotionContainer.querySelector('input');
      userEmoji.setAttribute('src', `images/emoji/${evt.target.value}.png`);
      userEmoji.setAttribute('alt', `emoji-${evt.target.value}`);
      userEmoji.style.visibility = 'visible';
      hiddenField.value = evt.target.value;
      this.element.scrollTo(0, this.element.scrollHeight);
    }
  };
}
