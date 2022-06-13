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
import {sortFilmsDate, sortFilmsRating} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import {Films, SortType, FILMS_COUNT_PER_STEP, UpdateType, UserAction, FilterType, TimeLimit} from '../const.js';

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
    const filmPresenter = new FilmPresenter(typeContainer, this.#onViewAction, this.#onModeChange, this.#filmsModel.getComments);
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

  #renderLoading = (filmsCards) => {
    render(this.#filmsBoard, this.#boardContainer);
    render(this.#loadingComponent, this.#filmsBoard.element);
    this.#renderFilmAmount(filmsCards);
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

  #catchErrorUpdateFilm = (update) => {
    if (!document.body.querySelector('.film-details__controls')) {
      this.#filmPresenter.get(update.id)._filmCardComponent.shake();
    } else {
      const popupButtonsControl = this.#filmPresenter.get(update.id)._popupComponent.element.querySelector('.film-details__controls');
      popupButtonsControl.classList.add('shake');
      setTimeout(() => {
        popupButtonsControl.classList.remove('shake');
      }, 600);
    }
  };

  #checkErrorDeleteComment = (commentId, isDeleteng, isError) => {
    const deletingCommentButton = document.getElementById(`${commentId}`);
    deletingCommentButton.textContent = isDeleteng ? 'Deleting' : 'Delete';
    deletingCommentButton.disabled = isDeleteng ? isDeleteng : false;

    if (isError) {
      deletingCommentButton.closest('.film-details__comment').classList.add('shake');
      setTimeout(() => {
        deletingCommentButton.closest('.film-details__comment').classList.remove('shake');
      }, 600);
    }
  };

  #checkErrorAddComment = (update, isAdding, isError, err) => {
    const textArea = this.#filmPresenter.get(update.id)._popupComponent.element.querySelector('.film-details__comment-input');
    const emojis = this.#filmPresenter.get(update.id)._popupComponent.element.querySelectorAll('.film-details__emoji-item');
    textArea.disabled = isAdding ? isAdding : false;
    emojis.forEach((element) => {
      element.disabled = isAdding ? isAdding : false;
    });

    if (isError) {
      const commentForm = this.#filmPresenter.get(update.id)._popupComponent.element.querySelector('.film-details__new-comment');
      commentForm.classList.add('shake');
      setTimeout(() => {
        commentForm.classList.remove('shake');
      }, 600);
      this.#uiBlocker.unblock();
      throw new Error(err);
    }
  };

  #onViewAction = async (actionType, updateType, update, commentId, newCommnet) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch {
          this.#catchErrorUpdateFilm(update);
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          this.#checkErrorDeleteComment(commentId, true);
          await this.#filmsModel.deleteComment(updateType, update, commentId);
        } catch {
          this.#checkErrorDeleteComment(commentId, false, true);
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          this.#checkErrorAddComment(update, true);
          await this.#filmsModel.addComment(updateType, update, newCommnet);
        } catch(err) {
          this.#checkErrorAddComment(update, false, true, err);
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #onModelEvent = (updateType, update, comments) => {
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
        this.#currentPopupPosition = this.#filmPresenter.get(update.id).getCurrentPopupPosition();
        this.#clearFilmList({rerenderUserProfile: true});
        this.#renderUserProfile();
        this.#renderCommonFilms();
        this.#filmPresenter.get(update.id).rerenderPopup(comments, this.#currentPopupPosition);
        break;
      case UpdateType.INIT:
        remove(this.#loadingComponent);
        this.init();
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
