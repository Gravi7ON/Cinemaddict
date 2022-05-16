import SortMenuView from '../view/sort-menu-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsTopRatedListView from '../view/films-top-rated-list-view.js';
import FilmsMostCommentedListView from '../view/films-most-commented-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import UserProfileView from '../view/user-profile-view.js';
import FilterMenuView from '../view/filter-menu-view.js';
import FilmAmountView from '../view/film-amount-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import {render, remove} from '../framework/render.js';

const FILM_COUNT_PER_STEP = 5;
const FILMS_RATED_LIST = 'rated';
const FILMS_COMMENTED_LIST = 'commented';

export default class FilmsPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #filmsTopRatedContainer = null;
  #filmsMostCommentedContainer = null;
  #filmsCards = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #userProfileElement = document.querySelector('.header');
  #filmAmountElement = document.querySelector('.footer__statistics');

  #filmsBoard = new FilmsBoardView();
  #filmsList = new FilmsListView();
  #sortMenuComponent = new SortMenuView();
  #filmsContainer = new FilmsContainerView();
  #filmsTopRatedList = new FilmsTopRatedListView();
  #filmsMostCommentedList = new FilmsMostCommentedListView();
  #showMoreButtonComponent = new ButtonShowMoreView();

  constructor(boardContainer, filmsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#filmsCards = [...this.#filmsModel.films];
    this.#renderFilmLists();
  };

  #renderFilterMenu = (filmsCards) => {
    render(new FilterMenuView(filmsCards), this.#boardContainer);
  };

  #renderSortMenu = () => {
    render(this.#sortMenuComponent, this.#boardContainer);
  };

  #renderFilmAmount = (filmsCards) => {
    render(new FilmAmountView(filmsCards), this.#filmAmountElement);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsList.element);

    this.#showMoreButtonComponent.setElementClick(this.#onShowMoreButtonClick);
  };

  #renderNoFilms = (filmsCards) => {
    this.#renderFilterMenu(filmsCards);
    render(this.#filmsBoard, this.#boardContainer);
    render(new FilmsListEmptyView(), this.#filmsBoard.element);
    this.#renderFilmAmount(filmsCards);
  };

  #renderFilmsCardsPerStep = (from, to) => {
    this.#filmsCards
      .slice(from, to)
      .forEach((film) => this.#renderFilms(film, null, this.#filmsContainer));
  };

  #renderFilms = (card, typeList, typeContainer) => {
    const filmCardPresenter = new FilmCardPresenter(typeContainer);
    filmCardPresenter.init(card, typeList);
  };

  #renderFilmLists = () => {
    this.#filmsCards = [...this.#filmsModel.films];
    this.#filmsTopRatedContainer = new FilmsContainerView();
    this.#filmsMostCommentedContainer = new FilmsContainerView();

    if (this.#filmsCards.length === 0) {
      this.#renderNoFilms(this.#filmsCards);

      return;
    }

    render(new UserProfileView(this.#filmsCards), this.#userProfileElement);
    this.#renderFilterMenu(this.#filmsCards);
    this.#renderSortMenu();
    render(this.#filmsBoard, this.#boardContainer);
    render(this.#filmsList, this.#filmsBoard.element);
    render(this.#filmsContainer, this.#filmsList.element);

    const totalFilmsAvailable = Math.min(this.#filmsCards.length, FILM_COUNT_PER_STEP);

    for (let i = 0; i < totalFilmsAvailable; i++) {
      this.#renderFilms(this.#filmsCards[i], null, this.#filmsContainer);
    }

    if (this.#filmsCards.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }

    render(this.#filmsTopRatedList, this.#filmsBoard.element);
    render(this.#filmsTopRatedContainer, this.#filmsTopRatedList.element);

    render(this.#filmsMostCommentedList, this.#filmsBoard.element);
    render(this.#filmsMostCommentedContainer, this.#filmsMostCommentedList.element);

    for (const filmCard of this.#filmsCards.slice(0, 2)) {
      this.#renderFilms(filmCard, FILMS_RATED_LIST, this.#filmsTopRatedContainer);
      this.#renderFilms(filmCard, FILMS_COMMENTED_LIST, this.#filmsMostCommentedContainer);
    }

    this.#renderFilmAmount(this.#filmsCards);
  };

  #onShowMoreButtonClick = () => {
    this.#renderFilmsCardsPerStep(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  };
}
