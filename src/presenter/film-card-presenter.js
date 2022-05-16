import {RenderPosition, render} from '../framework/render';
import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view.js';

export default class FilmCardPresenter {
  #filmCardComponent = null;
  #filmsContainer = null;
  #popupComponent = null;

  #bodyContentElement = document.body;
  #footerContentElement  = document.querySelector('.footer');

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = (card, typeList) => {
    this.#filmCardComponent = new MovieCardView(card);
    this.#popupComponent = new PopupView(card);

    this.#filmCardComponent.setElementClick(() => {
      if (this.#bodyContentElement.querySelector('.film-details')) {
        this.#bodyContentElement.querySelector('.film-details__close-btn').click();
      }

      render(this.#popupComponent, this.#footerContentElement, RenderPosition.AFTEREND);
      this.#bodyContentElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    this.#popupComponent.setElementClick(() => {
      this.#bodyContentElement.removeChild(this.#popupComponent.element);
      this.#bodyContentElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

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

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#bodyContentElement.removeChild(this.#popupComponent.element);
      this.#bodyContentElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}
