import {RenderPosition, render, remove} from '../framework/render';
import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view.js';

export default class FilmCardPresenter {
  #filmCardComponent = null;
  #filmsContainer = null;
  #popupComponent = null;
  #changeData = null;
  #film = null;

  #bodyContentElement = document.body;
  #footerContentElement  = document.querySelector('.footer');

  constructor(filmsContainer, changeData) {
    this.#filmsContainer = filmsContainer;
    this.#changeData = changeData;
  }

  init = (card, typeList) => {
    this.#film = card;

    this.#filmCardComponent = new MovieCardView(card);
    this.#popupComponent = new PopupView(card);

    this.#filmCardComponent.setElementClick(this.#renderPopupOnCardClick);
    this.#filmCardComponent.setWatchlistElementClick(this.#onWatchlistClick);
    this.#filmCardComponent.setWatchedElementClick(this.#onWatchedClick);
    this.#filmCardComponent.setFavoriteElementClick(this.#onFavoriteClick);

    this.#popupComponent.setElementClick(this.#closePopupOnButtonClick);

    switch (typeList) {
      case typeList === 'rated':
        render(this.#filmCardComponent, this.#filmsContainer.element);
        break;
      case typeList === 'commented':
        render(this.#filmCardComponent, this.#filmsContainer.element);
        break;
      default:
        render(this.#filmCardComponent, this.#filmsContainer.element);
        break;
    }
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#popupComponent);
  };

  #onWatchlistClick = () => {
    this.#changeData({...this.#film, watchlist: !this.#film.watchlist});
  };

  #onWatchedClick = () => {
    this.#changeData({...this.#film, watchlist: !this.#film.watchlist});
  };

  #onFavoriteClick = () => {
    this.#changeData({...this.#film, watchlist: !this.#film.watchlist});
  };

  #renderPopupOnCardClick = () => {
    if (this.#bodyContentElement.querySelector('.film-details')) {
      this.#bodyContentElement.querySelector('.film-details__close-btn').click();
    }

    render(this.#popupComponent, this.#footerContentElement, RenderPosition.AFTEREND);
    this.#bodyContentElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #closePopupOnButtonClick = () => {
    this.#bodyContentElement.removeChild(this.#popupComponent.element);
    this.#bodyContentElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#bodyContentElement.removeChild(this.#popupComponent.element);
      this.#bodyContentElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}
