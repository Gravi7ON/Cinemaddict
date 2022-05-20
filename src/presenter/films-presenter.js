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
import FilmPresenter from './film-presenter.js';
import {render, remove} from '../framework/render.js';
import {updateItem} from '../utils/common.js';

const Films = {
  COUNT_PER_STEP: 5,
  RATED_LIST: 'rated',
  COMMENTED_LIST: 'commented'
};

export default class FilmsPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #filmsCards = [];
  #renderedFilmCount = Films.COUNT_PER_STEP;

  #userProfileElement = document.querySelector('.header');
  #filmAmountElement = document.querySelector('.footer__statistics');

  #filmsBoard = new FilmsBoardView();
  #filmsList = new FilmsListView();
  #sortMenuComponent = new SortMenuView();
  #filmsContainer = new FilmsContainerView();
  #filmsTopRatedContainer = new FilmsContainerView();
  #filmsMostCommentedContainer = new FilmsContainerView();
  #filmsTopRatedList = new FilmsTopRatedListView();
  #filmsMostCommentedList = new FilmsMostCommentedListView();
  #showMoreButtonComponent = new ButtonShowMoreView();
  #filmPresenter = new Map();
  #filmRatedPresenter = new Map();
  #filmCommentedPresenter = new Map();

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
    const filmPresenter = new FilmPresenter(typeContainer, this.#onFilmCardChange, this.#onModeChange);
    filmPresenter.init(card, typeList);

    if (typeList === Films.RATED_LIST) {
      this.#filmRatedPresenter.set(card.id, filmPresenter);
      return;
    }

    if (typeList === Films.COMMENTED_LIST) {
      this.#filmCommentedPresenter.set(card.id, filmPresenter);
      return;
    }

    this.#filmPresenter.set(card.id, filmPresenter);
  };

  #renderFilmLists = () => {
    this.#filmsCards = [...this.#filmsModel.films];

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

    const totalFilmsAvailable = Math.min(this.#filmsCards.length, Films.COUNT_PER_STEP);

    for (let i = 0; i < totalFilmsAvailable; i++) {
      this.#renderFilms(this.#filmsCards[i], null, this.#filmsContainer);
    }

    if (this.#filmsCards.length > Films.COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }

    render(this.#filmsTopRatedList, this.#filmsBoard.element);
    render(this.#filmsTopRatedContainer, this.#filmsTopRatedList.element);

    render(this.#filmsMostCommentedList, this.#filmsBoard.element);
    render(this.#filmsMostCommentedContainer, this.#filmsMostCommentedList.element);

    for (const filmCard of this.#filmsCards.slice(0, 2)) {
      this.#renderFilms(filmCard, Films.RATED_LIST, this.#filmsTopRatedContainer);
      this.#renderFilms(filmCard, Films.COMMENTED_LIST, this.#filmsMostCommentedContainer);
    }

    this.#renderFilmAmount(this.#filmsCards);
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = Films.COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #onModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
    this.#filmRatedPresenter.forEach((presenter) => presenter.resetView());
    this.#filmCommentedPresenter.forEach((presenter) => presenter.resetView());
  };

  #onShowMoreButtonClick = () => {
    this.#renderFilmsCardsPerStep(this.#renderedFilmCount, this.#renderedFilmCount + Films.COUNT_PER_STEP);

    this.#renderedFilmCount += Films.COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmsCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #onFilmCardChange = (updatedFilm) => {
    this.#filmsCards = updateItem(this.#filmsCards, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };
}
