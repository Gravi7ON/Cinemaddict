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
import {render, remove, RenderPosition} from '../framework/render.js';
import {sortFilmsDate, sortFilmsRating} from '../utils/film.js';
import {Films, SortType, FILMS_COUNT_PER_STEP, UpdateType, UserAction} from '../const.js';

export default class FilmsPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #sortMenuComponent = null;
  #showMoreButtonComponent = null;
  #renderedFilmCount = FILMS_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  #userProfileElement = document.querySelector('.header');
  #filmAmountElement = document.querySelector('.footer__statistics');

  #filmsBoard = new FilmsBoardView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #filmsTopRatedContainer = new FilmsContainerView();
  #filmsMostCommentedContainer = new FilmsContainerView();
  #filmsTopRatedList = new FilmsTopRatedListView();
  #filmsMostCommentedList = new FilmsMostCommentedListView();
  #filmPresenter = new Map();
  #filmRatedPresenter = new Map();
  #filmCommentedPresenter = new Map();

  constructor(boardContainer, filmsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortFilmsDate);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortFilmsRating);
    }

    return this.#filmsModel.films;
  }

  init = () => {
    this.#renderFilmsList();
    this.#renderFilmsRatedList();
    this.#renderFilmsCommentedList();
  };

  #renderFilterMenu = (filmsCards) => {
    render(new FilterMenuView(filmsCards), this.#boardContainer);
  };

  #renderSortMenu = (position) => {
    this.#sortMenuComponent = new SortMenuView(this.#currentSortType);
    this.#sortMenuComponent.setSortTypeElementClick(this.#onSortTypeChange);

    render(this.#sortMenuComponent, this.#filmsBoard.element, position);
  };

  #renderFilmAmount = (filmsCards) => {
    render(new FilmAmountView(filmsCards), this.#filmAmountElement);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ButtonShowMoreView();
    this.#showMoreButtonComponent.setElementClick(this.#onShowMoreButtonClick);

    render(this.#showMoreButtonComponent, this.#filmsList.element);
  };

  #renderNoFilms = (filmsCards) => {
    this.#renderFilterMenu(filmsCards);
    render(this.#filmsBoard, this.#boardContainer);
    render(new FilmsListEmptyView(), this.#filmsBoard.element);
    this.#renderFilmAmount(filmsCards);
  };

  #renderFilm = (card, typeList, typeContainer) => {
    const filmPresenter = new FilmPresenter(typeContainer, this.#onViewAction, this.#onModeChange);
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

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film, null, this.#filmsContainer));
  };

  #renderCommonFilms = () => {
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILMS_COUNT_PER_STEP));

    this.#renderFilms(films);
    if (filmCount > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderFilmsList = () => {
    if (this.films.length === 0) {
      this.#renderNoFilms(this.films);

      return;
    }

    render(new UserProfileView(this.films), this.#userProfileElement);
    this.#renderFilterMenu(this.films);

    render(this.#filmsBoard, this.#boardContainer);
    this.#renderSortMenu(RenderPosition.BEFOREBEGIN);
    render(this.#filmsList, this.#filmsBoard.element);
    render(this.#filmsContainer, this.#filmsList.element);

    this.#renderCommonFilms();
    this.#renderFilmAmount(this.films);
  };

  #renderFilmsRatedList = () => {
    render(this.#filmsTopRatedList, this.#filmsBoard.element);
    render(this.#filmsTopRatedContainer, this.#filmsTopRatedList.element);

    for (const filmCard of this.films.slice(0, 2)) {
      this.#renderFilm(filmCard, Films.RATED_LIST, this.#filmsTopRatedContainer);
    }
  };

  #renderFilmsCommentedList = () => {
    render(this.#filmsMostCommentedList, this.#filmsBoard.element);
    render(this.#filmsMostCommentedContainer, this.#filmsMostCommentedList.element);

    for (const filmCard of this.films.slice(0, 2)) {
      this.#renderFilm(filmCard, Films.COMMENTED_LIST, this.#filmsMostCommentedContainer);
    }
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
    remove(this.#sortMenuComponent);
  };

  #onModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
    this.#filmRatedPresenter.forEach((presenter) => presenter.resetView());
    this.#filmCommentedPresenter.forEach((presenter) => presenter.resetView());
  };

  #onShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #onViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_FILM:
        this.#filmsModel.deleteFilm(updateType, update);
        break;
    }
  };

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        break;
    }
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmList();

    this.#renderSortMenu(RenderPosition.BEFOREBEGIN);
    this.#renderCommonFilms();
  };
}
