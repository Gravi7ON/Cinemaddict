import {RenderPosition, render, remove} from '../framework/render.js';
import {Film, Mode, UpdateType, UserAction} from '../const.js';
import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import {errorLoadWrapper} from '../utils/film.js';

export default class FilmPresenter {
  #filmsContainer = null;

  #changeData = null;
  #changeMode = null;

  #film = null;
  #loadComments = null;
  #curentPosition = null;
  #mode = Mode.DEFAULT;

  filmCardComponent = null;
  popupComponent = null;
  typePresenter = null;

  bodyContentElement = document.body;
  #footerContentElement = document.querySelector('.footer');

  constructor(filmsContainer, changeData, changeMode, loadComments, typePresenter) {
    this.#filmsContainer = filmsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#loadComments = loadComments;
    this.typePresenter = typePresenter;
  }

  init = (card, typeList) => {
    this.#film = card;

    this.filmCardComponent = new MovieCardView(card);

    this.filmCardComponent.setElementClick(this.#renderPopupOnCardClick);
    this.filmCardComponent.setWatchlistElementClick(this.#onWatchlistClick);
    this.filmCardComponent.setWatchedElementClick(this.#onWatchedClick);
    this.filmCardComponent.setFavoriteElementClick(this.#onFavoriteClick);

    switch (typeList) {
      case Film.RATED_LIST:
        render(this.filmCardComponent, this.#filmsContainer.element);
        break;
      case Film.COMMENTED_LIST:
        render(this.filmCardComponent, this.#filmsContainer.element);
        break;
      default:
        render(this.filmCardComponent, this.#filmsContainer.element);
        break;
    }
  };

  rerenderPopup = (preLoadComments = [], currentPopupPosition) => {
    this.#renderPopupOnCardClick(preLoadComments, currentPopupPosition);
  };

  destroy = () => {
    remove(this.filmCardComponent);
    remove(this.popupComponent);
  };

  getCurrentPopupPosition = () => {
    if (!this.#curentPosition) {
      this.#curentPosition = this.popupComponent.currentTopPosition;
    }

    return this.#curentPosition;
  };

  removePopupKeysHandlers = () => {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.removeEventListener('keydown', this.#onCommandControlEnterKeySubmit);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#onClosePopupButtonClick();
      this.bodyContentElement.classList.add('hide-overflow');
    }
  };

  #renderPopupOnCardClick = async (comments, currentPopupPosition) => {
    if (this.popupComponent !== null) {
      this.popupComponent.removeElement();
      this.#deleteNotification();
    }

    if (comments) {
      this.popupComponent = new PopupView(this.#film, comments);
    } else {
      const firstLoad = await this.#loadComments(this.#film.id);
      this.popupComponent = new PopupView(this.#film, firstLoad);
    }

    this.popupComponent.setButtonCloseElementClick(this.#onClosePopupButtonClick);
    this.popupComponent.setWatchlistElementClick(this.#onPopupWatchlistClick);
    this.popupComponent.setWatchedElementClick(this.#onPopupWatchedClick);
    this.popupComponent.setFavoriteElementClick(this.#onPopupFavoriteClick);
    this.popupComponent.setButtonDeleteCommentClick(this.#onDeleteCommentButtonClick);
    this.popupComponent.setEmotionElementChange(this.#onEmotionChange);

    render(this.popupComponent, this.#footerContentElement, RenderPosition.AFTEREND);
    this.bodyContentElement.classList.add('hide-overflow');
    this.popupComponent.scrollTo(currentPopupPosition);
    document.addEventListener('keydown', this.#onEscKeyDown);
    document.addEventListener('keydown', this.#onCommandControlEnterKeySubmit);

    if (this.#mode === Mode.POPUP) {
      return;
    }

    this.#changeMode();
    this.#mode = Mode.POPUP;
  };

  #deleteNotification = () => {
    const notification = this.bodyContentElement.querySelector('.film-details_error-notification');
    if (notification) {
      notification.remove();
      errorLoadWrapper.deleteTimeout();
    }
  };

  #onWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film,
        'userDetails': {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}},
      null,
      null,
      this.typePresenter
    );
  };

  #onWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film,
        'userDetails': {...this.#film.userDetails, 'alreadyWatched': !this.#film.userDetails.alreadyWatched}},
      null,
      null,
      this.typePresenter
    );
  };

  #onFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film,
        'userDetails': {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}},
      null,
      null,
      this.typePresenter
    );
  };

  #onPopupWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {...this.#film,
        'userDetails': {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}},
      null,
      null,
      this.typePresenter
    );
  };

  #onPopupWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {...this.#film,
        'userDetails': {...this.#film.userDetails, 'alreadyWatched': !this.#film.userDetails.alreadyWatched}},
      null,
      null,
      this.typePresenter
    );
  };

  #onPopupFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {...this.#film,
        'userDetails': {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}},
      null,
      null,
      this.typePresenter
    );
  };

  #onDeleteCommentButtonClick = (evt) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MAJOR,
      {...this.#film},
      evt.target.id,
      null,
      this.typePresenter
    );
  };

  #onClosePopupButtonClick = () => {
    this.popupComponent.removeElement();

    this.bodyContentElement.classList.remove('hide-overflow');
    this.#deleteNotification();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.removeEventListener('keydown', this.#onCommandControlEnterKeySubmit);

    this.#mode = Mode.DEFAULT;
  };

  #onEmotionChange = (evt) => {
    if (evt.target.matches('input[type="radio"]')) {
      const userEmotionContainer = document.querySelector('.film-details__add-emoji-label');
      const userEmoji = userEmotionContainer.querySelector('img');
      const hiddenField = userEmotionContainer.querySelector('input');
      userEmoji.setAttribute('src', `images/emoji/${evt.target.value}.png`);
      userEmoji.setAttribute('alt', `emoji-${evt.target.value}`);
      userEmoji.style.visibility = 'visible';
      hiddenField.value = evt.target.value;
    }
  };

  #onCommentSubmit = () => {
    const emotionElement = document.querySelector('#user-emoji-hidden').value;
    const commentElement = document.querySelector('.film-details__comment-input').value;
    const createNewComment = () => ({
      comment: commentElement,
      emotion: emotionElement
    });
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MAJOR,
      {...this.#film},
      null,
      createNewComment(),
      this.typePresenter
    );
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#onClosePopupButtonClick();
    }
  };

  #onCommandControlEnterKeySubmit = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      evt.preventDefault();
      this.#curentPosition = this.popupComponent.element.scrollTop;
      this.#onCommentSubmit();
    }
  };
}
