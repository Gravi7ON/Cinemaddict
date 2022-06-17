/* eslint-disable camelcase */
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {formatDate, getShortDescription} from '../utils/film.js';
import {durationInMinutes} from '../const.js';
import he from 'he';

const classStyleButtonsPopup = 'film-details__control-button--active';

const createGenreTemplate = (genres) => genres.reduce((previous, current) => `${previous}<span class="film-details__genre">${current}</span>`, '');

const createCommentsTemplate = (comments) => {
  const commentDate = (currentDate) => formatDate(currentDate).fromNow();
  return comments.reduce((previous, current) =>
    `${previous}<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${current.emotion}.png" width="55" height="55" alt="emoji-${current.emotion}">
    </span>
    <div>
    <p class="film-details__comment-text">${he.encode(current.comment)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${current.author}</span>
      <span class="film-details__comment-day">${commentDate(current.date)}</span>
      <button id="${current.id}" class="film-details__comment-delete">Delete</button>
    </p>
    </div>
  </li>`, '');
};

const createPopupTemplate = (popup, comments) => {
  const {filmInfo, userDetails} = popup;
  const durationHours = Math.floor(filmInfo.runtime / durationInMinutes);
  const durationMunutes = filmInfo.runtime - durationInMinutes * durationHours;
  const releaseDate = formatDate(filmInfo.release.date).format('D MMM YYYY');

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${filmInfo.poster}" alt="${filmInfo.alternativeTitle}">

              <p class="film-details__age">${filmInfo.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.title}</h3>
                  <p class="film-details__title-original">Original: ${filmInfo.title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${filmInfo.actors.length > 1 ? 'Writers' : 'Writer'}</td>
                  <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${filmInfo.actors.length > 1 ? 'Actors' : 'Actor'}</td>
                  <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
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
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${filmInfo.genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">
                    ${createGenreTemplate(filmInfo.genre)}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${getShortDescription(filmInfo.description)}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchlist ? classStyleButtonsPopup : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.alreadyWatched ? classStyleButtonsPopup : ''}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? classStyleButtonsPopup : ''}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comment <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${createCommentsTemplate(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                <img width="55" height="55" style="visibility: hidden">
                <input id="user-emoji-hidden" type="hidden" name="user-emoji" value="">
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
  #film = null;
  #comments = [];
  #buttonsControl = null;
  #buttonDeleteComment = null;
  #deleteCommentBlock = null;
  #textArea = null;
  #emojiButton = null;
  #commentForm = null;
  currentTopPosition = null;

  constructor(popup, comments = []) {
    super();
    this.#film = popup;
    this.#comments = comments;
  }

  get template() {
    return createPopupTemplate(this.#film, this.#comments);
  }

  get buttonsControl() {
    if (!this.#buttonsControl) {
      this.#buttonsControl = this.element.querySelector('.film-details__controls');
    }

    return this.#buttonsControl;
  }

  get deleteCommentBlock() {
    this.#deleteCommentBlock = this.#buttonDeleteComment.closest('.film-details__comment');

    return this.#deleteCommentBlock;
  }

  get textArea() {
    if (!this.#textArea) {
      this.#textArea = this.element.querySelector('.film-details__comment-input');
    }

    return this.#textArea;
  }

  get emojiButton() {
    if (!this.#emojiButton) {
      this.#emojiButton = this.element.querySelectorAll('.film-details__emoji-item');
    }

    return this.#emojiButton;
  }

  get commentForm() {
    if (!this.#commentForm) {
      this.#commentForm = this.element.querySelector('.film-details__new-comment');
    }

    return this.#commentForm;
  }

  getbuttonDeleteComment(commentId) {
    this.#buttonDeleteComment = this.element.querySelector(`button[id='${commentId}']`);

    return this.#buttonDeleteComment;
  }

  setButtonCloseElementClick = (callback) => {
    this._callback.closeButtonClick = callback;
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

  setButtonDeleteCommentClick = (callback) => {
    this._callback.deleteButtonClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#onButtonDeleteClick);
  };

  setEmotionElementChange = (callback) => {
    this._callback.emotionClick = callback;
    this.element.querySelector('.film-details__inner').addEventListener('change', this.#onEmotionButtonClick);
  };

  scrollTo = (currentPosition) => {
    this.element.scrollTo(0, currentPosition);
    this.currentTopPosition = 0;
  };

  catchErrorUpdateFilm = () => {
    this.shake(this.buttonsControl);
  };

  checkErrorDeleteComment = (commentId, isDeleting, isError) => {
    const deletingCommentButton = this.getbuttonDeleteComment(commentId);
    deletingCommentButton.textContent = isDeleting ? 'Deleting' : 'Delete';
    deletingCommentButton.disabled = isDeleting || false;

    if (!isError) {
      return;
    }

    this.shake(this.deleteCommentBlock);
  };

  checkErrorAddComment = (isAdding, isError, err, uiBlocker) => {
    this.textArea.disabled = isAdding || false;
    this.emojiButton.forEach((element) => {
      element.disabled = isAdding || false;
    });

    if (!isError) {
      return;
    }

    const commentForm = this.commentForm;
    this.shake(commentForm);
    uiBlocker.unblock();
    throw new Error(err);
  };

  #restoreScrollForChange = (callback, evt) => {
    this.currentTopPosition = this.element.scrollTop;
    callback(evt);
  };

  #onClick = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this.#restoreScrollForChange(this._callback.watchlistClick);
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this.#restoreScrollForChange(this._callback.watchedClick);
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this.#restoreScrollForChange(this._callback.favoriteClick);
  };

  #onEmotionButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.emotionClick(evt);
  };

  #onButtonDeleteClick = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    this.#restoreScrollForChange(this._callback.deleteButtonClick, evt);
  };
}
