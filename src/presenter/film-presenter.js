import {RenderPosition, render, remove} from '../framework/render.js';
import {Films, Mode, UpdateType, UserAction} from '../const.js';
import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';

export default class FilmPresenter {
  #filmCardComponent = null;
  #filmsContainer = null;
  #popupComponent = null;

  #changeData = null;
  #changeMode = null;

  #film = null;
  #loadComments = null;
  #curentPosition = null;
  #mode = Mode.DEFAULT;

  #bodyContentElement = document.body;
  #footerContentElement  = document.querySelector('.footer');

  constructor(filmsContainer, changeData, changeMode, loadComments) {
    this.#filmsContainer = filmsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#loadComments = loadComments;
  }

  init = (card, typeList) => {
    this.#film = card;

    this.#filmCardComponent = new MovieCardView(card);

    this.#filmCardComponent.setElementClick(this.#renderPopupOnCardClick);
    this.#filmCardComponent.setWatchlistElementClick(this.#onWatchlistClick);
    this.#filmCardComponent.setWatchedElementClick(this.#onWatchedClick);
    this.#filmCardComponent.setFavoriteElementClick(this.#onFavoriteClick);

    switch (typeList) {
      case Films.RATED_LIST:
        render(this.#filmCardComponent, this.#filmsContainer.element);
        break;
      case Films.COMMENTED_LIST:
        render(this.#filmCardComponent, this.#filmsContainer.element);
        break;
      default:
        render(this.#filmCardComponent, this.#filmsContainer.element);
        break;
    }
  };

  rerenderPopup = (preLoadComments, currentPopupPosition) => {
    this.#renderPopupOnCardClick(preLoadComments, currentPopupPosition);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#popupComponent);
  };

  getCurrentPopupPosition = () => {
    this.#curentPosition = this.#popupComponent._currentTopPosition;
    return this.#curentPosition;
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopupOnButtonClick();
      this.#bodyContentElement.classList.add('hide-overflow');
    }
  };

  #renderPopupOnCardClick = async (comments, currentPopupPosition) => {
    if (this.#popupComponent !== null) {
      this.#popupComponent.removeElement();
    }

    if (comments) {
      this.#popupComponent = new PopupView(this.#film, comments);
    } else {
      const firstLoad = await this.#loadComments(this.#film.id);
      this.#popupComponent = new PopupView(this.#film, firstLoad);
    }

    this.#popupComponent.setButtonCloseElementClick(this.#closePopupOnButtonClick);
    this.#popupComponent.setWatchlistElementClick(this.#onPopupWatchlistClick);
    this.#popupComponent.setWatchedElementClick(this.#onPopupWatchedClick);
    this.#popupComponent.setFavoriteElementClick(this.#onPopupFavoriteClick);
    this.#popupComponent.setButtonDeleteCommentClick(this.#onDeleteCommentButtonClick);
    this.#popupComponent.setEmotionElementChange(this.#onEmotionChange);

    render(this.#popupComponent, this.#footerContentElement, RenderPosition.AFTEREND);
    this.#bodyContentElement.classList.add('hide-overflow');
    this.#popupComponent._scrollTo(currentPopupPosition);
    document.addEventListener('keydown', this.#onEscKeyDown);
    document.addEventListener('keydown', this.#onCommandControlEnterKeySubmit);

    if (this.#mode === Mode.POPUP) {
      return;
    }

    this.#changeMode();
    this.#mode = Mode.POPUP;
  };

  #onWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film,
        'user_details': {...this.#film.user_details, watchlist: !this.#film.user_details.watchlist}});
  };

  #onWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film,
        'user_details': {...this.#film.user_details, 'already_watched': !this.#film.user_details.already_watched}});
  };

  #onFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film,
        'user_details': {...this.#film.user_details, favorite: !this.#film.user_details.favorite}});
  };

  #onPopupWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {...this.#film,
        'user_details': {...this.#film.user_details, watchlist: !this.#film.user_details.watchlist}});
  };

  #onPopupWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {...this.#film,
        'user_details': {...this.#film.user_details, 'already_watched': !this.#film.user_details.already_watched}});
  };

  #onPopupFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MAJOR,
      {...this.#film,
        'user_details': {...this.#film.user_details, favorite: !this.#film.user_details.favorite}});
  };

  #onDeleteCommentButtonClick = (evt) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MAJOR,
      {...this.#film},
      evt.target.id);
  };

  #closePopupOnButtonClick = () => {
    this.#popupComponent.removeElement();

    this.#bodyContentElement.classList.remove('hide-overflow');
    const notification = this.#bodyContentElement.querySelector('.film-details_error-notification');
    if (notification) {
      notification.remove('film-details_error-notification');
    }
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.addEventListener('keydown', this.#onCommandControlEnterKeySubmit);

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
    const getComment = () => ({
      'comment': commentElement,
      'emotion': emotionElement
    });
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MAJOR,
      {...this.#film},
      null,
      getComment());
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopupOnButtonClick();
    }
  };

  #onCommandControlEnterKeySubmit = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      evt.preventDefault();
      this.#onCommentSubmit();

      const currentPopupPosition = document.querySelector('.film-details').scrollHeight;
      const newPopup = document.querySelector('.film-details');
      newPopup.scrollTo(0, currentPopupPosition);
    }
  };
}
