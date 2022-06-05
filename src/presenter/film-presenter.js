import {RenderPosition, render, remove} from '../framework/render';
import {Films, Mode, UpdateType, UserAction} from '../const';
import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view.js';

export default class FilmPresenter {
  #filmCardComponent = null;
  #filmsContainer = null;
  #popupComponent = null;

  #changeData = null;
  #changeMode = null;

  #film = null;
  #mode = Mode.DEFAULT;

  #bodyContentElement = document.body;
  #footerContentElement  = document.querySelector('.footer');

  constructor(filmsContainer, changeData, changeMode) {
    this.#filmsContainer = filmsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
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

  rerenderPopup = () => {
    this.#renderPopupOnCardClick();
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#popupComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopupOnButtonClick();
      this.#bodyContentElement.classList.add('hide-overflow');
    }
  };

  #renderPopupOnCardClick = () => {
    if (this.#popupComponent !== null) {
      this.#popupComponent.removeElement();
    }

    this.#popupComponent = new PopupView(this.#film);

    this.#popupComponent.setButtonCloseElementClick(this.#closePopupOnButtonClick);
    this.#popupComponent.setWatchlistElementClick(this.#onPopupWatchlistClick);
    this.#popupComponent.setWatchedElementClick(this.#onPopupWatchedClick);
    this.#popupComponent.setFavoriteElementClick(this.#onPopupFavoriteClick);
    this.#popupComponent.setButtonDeleteCommentClick(this.#onDeleteCommentButtonClick);
    this.#popupComponent.setEmotionElementChange();

    render(this.#popupComponent, this.#footerContentElement, RenderPosition.AFTEREND);
    this.#bodyContentElement.classList.add('hide-overflow');
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
      evt);
  };

  #closePopupOnButtonClick = () => {
    this.#popupComponent.removeElement();

    this.#bodyContentElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.removeEventListener('keydown', this.#onCommandControlEnterKeySubmit);

    this.#mode = Mode.DEFAULT;
  };

  #onCommentSubmit = () => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MAJOR,
      {...this.#film});
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
    }
  };
}
