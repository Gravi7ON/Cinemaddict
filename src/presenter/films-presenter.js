import SortMenuView from '../view/sort-menu-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsTopRatedListView from '../view/films-top-rated-list-view.js';
import FilmsMostCommentedListView from '../view/films-most-commented-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import MovieCardView from '../view/movie-card-view';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #filmsCards = [];
  #filmsContainer = null;
  #filmsTopRatedContainer = null;
  #filmsMostCommentedContainer = null;

  #filmsBoard = new FilmsBoardView();
  #filmsList = new FilmsListView();
  #filmsTopRatedList = new FilmsTopRatedListView();
  #filmsMostCommentedList = new FilmsMostCommentedListView();

  init = (boardContainer, filmsModel) => {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filmsCards = [...this.#filmsModel.films];
    this.#filmsContainer = new FilmsContainerView();
    this.#filmsTopRatedContainer = new FilmsContainerView();
    this.#filmsMostCommentedContainer = new FilmsContainerView();

    render(new SortMenuView(), this.#boardContainer);
    render(this.#filmsBoard, this.#boardContainer);
    render(this.#filmsList, this.#filmsBoard.element);
    render(this.#filmsContainer, this.#filmsList.element);
    render(new ButtonShowMoreView(), this.#filmsList.element);

    this.renderFilms = (card) => {
      const cardComponent = new MovieCardView(card);
      const popupComponent = new PopupView(card);

      const showPopup = () => {
        render(popupComponent, this.#boardContainer);
      };

      const hidePopup = () => {
        this.#boardContainer.removeChild(popupComponent.element);
      };

      cardComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
        showPopup();
      });

      popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
        hidePopup();
      })

      render(cardComponent, this.#filmsContainer.element);
    };

    for (const filmCard of this.#filmsCards) {
      this.renderFilms(filmCard);
    }

    render(this.#filmsTopRatedList, this.#filmsBoard.element);
    render(this.#filmsTopRatedContainer, this.#filmsTopRatedList.element);

    render(this.#filmsMostCommentedList, this.#filmsBoard.element);
    render(this.#filmsMostCommentedContainer, this.#filmsMostCommentedList.element);

    for (const filmCard of this.#filmsCards.slice(0, 2)) {
      render(new MovieCardView(filmCard), this.#filmsTopRatedContainer.element);
      render(new MovieCardView(filmCard), this.#filmsMostCommentedContainer.element);
    }
  };
}
