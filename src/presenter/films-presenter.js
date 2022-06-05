import SortMenuView from '../view/sort-menu-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsTopRatedListView from '../view/films-top-rated-list-view.js';
import FilmsMostCommentedListView from '../view/films-most-commented-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import UserProfileView from '../view/user-profile-view.js';
import FilmAmountView from '../view/film-amount-view.js';
import FilmPresenter from './film-presenter.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import {sortFilmsDate, sortFilmsRating} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import {Films, SortType, FILMS_COUNT_PER_STEP, UpdateType, UserAction, FilterType} from '../const.js';

export default class FilmsPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #userProfile = null;
  #filterMenu = null;
  #sortMenuComponent = null;
  #showMoreButtonComponent = null;
  #filmsAmount = null;
  #filterModel = null;
  #filmsListEmptyComponent = null;
  #renderedFilmCount = FILMS_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

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

  constructor(boardContainer, filmsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsRating);
    }

    return filteredFilms;
  }

  init = () => {
    if (this.films.length === 0) {
      this.#renderNoFilms(this.films);
      return;
    }

    this.#renderUserProfile();
    this.#renderCommonFilms();
    this.#renderFilmAmount(this.films);
    // this.#renderFilmsRatedList();
    // this.#renderFilmsCommentedList();
  };

  #renderUserProfile = () => {
    this.#userProfile = new UserProfileView(this.#filmsModel.films);
    render(this.#userProfile, this.#userProfileElement);
  };

  #renderSortMenu = () => {
    this.#sortMenuComponent = new SortMenuView(this.#currentSortType);
    this.#sortMenuComponent.setSortTypeElementClick(this.#onSortTypeChange);

    render(this.#sortMenuComponent, this.#filmsBoard.element, RenderPosition.BEFOREBEGIN);
  };

  #renderFilmAmount = (filmsCards) => {
    this.#filmsAmount = new FilmAmountView(filmsCards);
    render(this.#filmsAmount, this.#filmAmountElement);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ButtonShowMoreView();
    this.#showMoreButtonComponent.setElementClick(this.#onShowMoreButtonClick);

    render(this.#showMoreButtonComponent, this.#filmsList.element);
  };

  #renderNoFilms = (filmsCards) => {
    render(this.#filmsBoard, this.#boardContainer);
    this.#filmsListEmptyComponent = new FilmsListEmptyView(this.#filterType);
    render(this.#filmsListEmptyComponent, this.#filmsBoard.element);
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
    const films = this.films.slice(0, Math.min(filmCount, this.#renderedFilmCount));

    if (filmCount === 0) {
      remove(this.#filmsList);
      this.#renderNoFilms(films);
      remove(this.#filmsAmount);

      return;
    }


    this.#renderFilms(films);
    render(this.#filmsBoard, this.#boardContainer);

    if (filmCount > 0) {
      this.#renderSortMenu();
    }

    render(this.#filmsList, this.#filmsBoard.element);
    render(this.#filmsContainer, this.#filmsList.element);

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
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

  #clearFilmList = ({resetRenderedFilmsCount = false, resetSortType = false, rerenderUserProfile = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortMenuComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#filterMenu);

    if (rerenderUserProfile) {
      remove(this.#userProfile);
    }

    if (this.#filmsListEmptyComponent) {
      remove(this.#filmsListEmptyComponent);
    }

    this.#renderedFilmCount = resetRenderedFilmsCount ? FILMS_COUNT_PER_STEP : Math.min(filmCount, this.#renderedFilmCount);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
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

  #onViewAction = (actionType, updateType, update, evt) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.deleteComment(updateType, update, evt);
        break;
    }
  };

  #onModelEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PRE_MINOR:
        this.#clearFilmList({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderCommonFilms();
        break;
      case UpdateType.MINOR:
        this.#clearFilmList({rerenderUserProfile: true});
        this.#renderUserProfile();
        this.#renderCommonFilms();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmList({rerenderUserProfile: true});
        this.#renderUserProfile();
        this.#renderCommonFilms();
        this.#filmPresenter.get(update.id).rerenderPopup();
        break;
    }
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmList({resetRenderedFilmsCount: true});
    this.#renderCommonFilms();
  };
}
