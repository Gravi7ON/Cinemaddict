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
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import {sortFilmsDate, sortFilmsRating, sortFilmsComments, getRandomUniquePositiveInteger} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import {Film, SortType, FILMS_COUNT_PER_STEP, UpdateType, UserAction, FilterType, TimeLimit, FILMS_COUNT_ADDITIONAL_BLOCK} from '../const.js';

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
  #currentPopupPosition = null;
  #renderedFilmCount = FILMS_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  #userProfileElement = document.querySelector('.header');
  #filmAmountElement = document.querySelector('.footer__statistics');

  #filmsBoard = new FilmsBoardView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #filmsTopRatedContainer = new FilmsContainerView();
  #filmsMostCommentedContainer = new FilmsContainerView();
  #filmsTopRatedList = new FilmsTopRatedListView();
  #filmsMostCommentedList = new FilmsMostCommentedListView();
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
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
    if (this.#isLoading) {
      this.#isLoading = false;
      this.#renderLoading(this.films);
      return;
    }

    if (this.films.length === 0) {
      remove(this.#filmsAmount);
      this.#renderNoFilms(this.films);
      return;
    }

    remove(this.#filmsAmount);
    this.#renderUserProfile();
    this.#renderCommonFilms();
    this.#renderFilmAmount(this.films);
    this.#renderFilmsRatedList();
    this.#renderFilmsCommentedList();
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
    const filmPresenter = new FilmPresenter(typeContainer, this.#onViewAction, this.#onModeChange, this.#filmsModel.getComments, typeList);
    filmPresenter.init(card, typeList);

    if (typeList === Film.RATED_LIST) {
      this.#filmRatedPresenter.set(card.id, filmPresenter);
      return;
    }

    if (typeList === Film.COMMENTED_LIST) {
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

  #renderLoading = (filmsCards) => {
    render(this.#filmsBoard, this.#boardContainer);
    render(this.#loadingComponent, this.#filmsBoard.element);
    this.#renderFilmAmount(filmsCards);
  };

  #renderFilmsRatedList = () => {
    const films = [...this.#filmsModel.films];
    const ratedFilms = films.sort(sortFilmsRating).slice(0, FILMS_COUNT_ADDITIONAL_BLOCK);
    const isAllFilmsHaveRatingZero = (movies) => movies.every((movie) => movie.total_rating === 0);
    const isAllFilmsHaveRatingSame = (movies) => movies.every((movie) => movie.total_rating === movies[0]);

    if (isAllFilmsHaveRatingZero(films)) {
      return;
    }

    if (isAllFilmsHaveRatingSame(films)) {
      const randomRated = [];

      for (let i = 0; i < FILMS_COUNT_ADDITIONAL_BLOCK; i++) {
        randomRated.push(films[getRandomUniquePositiveInteger(0, films.length - 1)()]);
      }

      render(this.#filmsTopRatedList, this.#filmsBoard.element);
      render(this.#filmsTopRatedContainer, this.#filmsTopRatedList.element);

      for (const filmCard of randomRated) {
        this.#renderFilm(filmCard, Film.RATED_LIST, this.#filmsTopRatedContainer);
      }
      return;
    }

    render(this.#filmsTopRatedList, this.#filmsBoard.element);
    render(this.#filmsTopRatedContainer, this.#filmsTopRatedList.element);

    for (const filmCard of ratedFilms) {
      this.#renderFilm(filmCard, Film.RATED_LIST, this.#filmsTopRatedContainer);
    }
  };

  #renderFilmsCommentedList = () => {
    const films = [...this.#filmsModel.films];
    const commentedFilms = films.sort(sortFilmsComments).slice(0, FILMS_COUNT_ADDITIONAL_BLOCK);
    const isAllFilmsHaveCommentsZero = (movies) => movies.every((film) => film.comments.length === 0);
    const isAllFilmsHaveCommentsSame = (movies) => movies.every((movie) => movie.comments.length === movies[0].comments.length);

    if (isAllFilmsHaveCommentsZero(films)) {
      return;
    }

    if (isAllFilmsHaveCommentsSame(films)) {
      const randomCommentedFilms = [];

      for (let i = 0; i < FILMS_COUNT_ADDITIONAL_BLOCK; i++) {
        randomCommentedFilms.push(films[getRandomUniquePositiveInteger(0, films.length - 1)()]);
      }

      render(this.#filmsMostCommentedList, this.#filmsBoard.element);
      render(this.#filmsMostCommentedContainer, this.#filmsMostCommentedList.element);

      for (const filmCard of randomCommentedFilms) {
        this.#renderFilm(filmCard, Film.COMMENTED_LIST, this.#filmsMostCommentedContainer);
      }
      return;
    }

    render(this.#filmsMostCommentedList, this.#filmsBoard.element);
    render(this.#filmsMostCommentedContainer, this.#filmsMostCommentedList.element);

    for (const filmCard of commentedFilms) {
      this.#renderFilm(filmCard, Film.COMMENTED_LIST, this.#filmsMostCommentedContainer);
    }
  };

  #removeAdditionalsLists = () => {
    remove(this.#filmsTopRatedList);
    remove(this.#filmsTopRatedContainer);
    remove(this.#filmsMostCommentedList);
    remove(this.#filmsMostCommentedContainer);
  };

  #clearFilmList = ({resetRenderedFilmsCount = false, resetSortType = false, rerenderUserProfile = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#filmRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmRatedPresenter.clear();
    this.#filmCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCommentedPresenter.clear();

    remove(this.#sortMenuComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#filterMenu);
    this.#removeAdditionalsLists();

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

  #clearAndRenderChange = () => {
    this.#clearFilmList({rerenderUserProfile: true});
    this.#renderUserProfile();
    this.#renderCommonFilms();
    this.#renderFilmsRatedList();
    this.#renderFilmsCommentedList();
  };

  #switchUserAction = async (actionType, updateType, update, commentId, newCommnet, currentPopupComponent, currentFilmComponent, currentPresenter, typePresenter) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(updateType, update, typePresenter);
        } catch {
          if (!currentPopupComponent){
            currentFilmComponent.shake(currentFilmComponent.element);
          } else {
            currentPresenter.get(update.id).popupComponent.catchErrorUpdateFilm();
          }
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          currentPopupComponent.checkErrorDeleteComment(update, commentId, true);
          await this.#filmsModel.deleteComment(updateType, update, commentId, typePresenter);
        } catch {
          currentPopupComponent.checkErrorDeleteComment(update, commentId, false, true);
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          currentPopupComponent.checkErrorAddComment(true, false);
          await this.#filmsModel.addComment(updateType, update, newCommnet, typePresenter);
        } catch(err) {
          currentPopupComponent.checkErrorAddComment(false, true, err, this.#uiBlocker);
        }
        break;
    }

    this.#uiBlocker.unblock();
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

  #onViewAction = (actionType, updateType, update, commentId, newCommnet, typePresenter) => {
    if (typePresenter === Film.RATED_LIST) {
      const currentFilmRatedPresenter = this.#filmRatedPresenter.get(update.id);
      const currentFilmRatedComponent = currentFilmRatedPresenter.filmCardComponent;
      const currentPopupRatedComponent = currentFilmRatedPresenter.popupComponent;
      this.#switchUserAction(actionType, updateType, update, commentId, newCommnet, currentPopupRatedComponent, currentFilmRatedComponent, this.#filmRatedPresenter, typePresenter);
      return;
    }

    if (typePresenter === Film.COMMENTED_LIST) {
      const currentFilmCommentedPresenter = this.#filmCommentedPresenter.get(update.id);
      const currentFilmCommentedComponent = currentFilmCommentedPresenter.filmCardComponent;
      const currentPopupCommentedComponent = currentFilmCommentedPresenter.popupComponent;
      this.#switchUserAction(actionType, updateType, update, commentId, newCommnet, currentPopupCommentedComponent, currentFilmCommentedComponent, this.#filmCommentedPresenter, typePresenter);
      return;
    }

    const currentFilmPresenter = this.#filmPresenter.get(update.id);
    const currentFilmComponent = currentFilmPresenter.filmCardComponent;
    const currentPopupComponent = currentFilmPresenter.popupComponent;
    this.#switchUserAction(actionType, updateType, update, commentId, newCommnet, currentPopupComponent, currentFilmComponent, this.#filmPresenter, typePresenter);
  };

  #onModelEvent = (updateType, update, comments, typePresenter) => {
    switch (updateType) {
      case UpdateType.PRE_MINOR:
        this.#clearFilmList({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderCommonFilms();
        this.#renderFilmsRatedList();
        this.#renderFilmsCommentedList();
        break;
      case UpdateType.MINOR:
        this.#clearAndRenderChange();
        break;
      case UpdateType.MAJOR:
        if (typePresenter === Film.RATED_LIST) {
          const currentFilmRatedPresenter = this.#filmRatedPresenter.get(update.id);
          this.#currentPopupPosition = currentFilmRatedPresenter.getCurrentPopupPosition();
          currentFilmRatedPresenter.removePopupKeysHandlers();
          this.#clearAndRenderChange();
          this.#filmRatedPresenter.get(update.id).rerenderPopup(comments, this.#currentPopupPosition);
          return;
        }

        if (typePresenter === Film.COMMENTED_LIST) {
          const currentFilmCommentedPresenter = this.#filmCommentedPresenter.get(update.id);
          this.#currentPopupPosition = currentFilmCommentedPresenter.getCurrentPopupPosition();
          currentFilmCommentedPresenter.removePopupKeysHandlers();
          currentFilmCommentedPresenter.bodyContentElement.classList.remove('hide-overflow');
          this.#clearAndRenderChange();
          this.#filmCommentedPresenter.get(update.id).rerenderPopup(comments, this.#currentPopupPosition);
          return;
        }

        this.#currentPopupPosition = this.#filmPresenter.get(update.id).getCurrentPopupPosition();
        this.#filmPresenter.get(update.id).removePopupKeysHandlers();
        this.#clearAndRenderChange();
        this.#filmPresenter.get(update.id).rerenderPopup(comments, this.#currentPopupPosition);
        break;
      case UpdateType.INIT:
        remove(this.#loadingComponent);
        this.init();
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
    this.#renderFilmsRatedList();
    this.#renderFilmsCommentedList();
  };
}
