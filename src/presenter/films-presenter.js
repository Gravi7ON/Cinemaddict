import SortMenuView from '../view/sort-menu-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsTopRatedListView from '../view/films-top-rated-list-view.js';
import FilmsMostRecommentedListView from '../view/films-most-recommented-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import MovieCardView from '../view/movie-card-view';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  filmsBoard = new FilmsBoardView();
  filmsList = new FilmsListView();
  filmsTopRatedList = new FilmsTopRatedListView();
  filmsMostRecommentedList = new FilmsMostRecommentedListView();

  init = (boardContainer, filmsModel) => {
    this.boardContainer = boardContainer;
    this.filmsModel = filmsModel;
    this.filmsCards = [...this.filmsModel.getFilms()];
    this.filmsContainer = new FilmsContainerView();
    this.filmsTopRatedContainer = new FilmsContainerView();
    this.filmsMostRecommentedContainer = new FilmsContainerView();

    render(new SortMenuView(), this.boardContainer);
    render(this.filmsBoard, this.boardContainer);
    render(this.filmsList, this.filmsBoard.getElement());
    render(this.filmsContainer, this.filmsList.getElement());
    render(new ButtonShowMoreView(), this.filmsList.getElement());

    for (let i = 0; i < this.filmsCards.length; i++) {
      render(new MovieCardView(this.filmsCards[i]), this.filmsContainer.getElement());
    }

    render(this.filmsTopRatedList, this.filmsBoard.getElement());
    render(this.filmsTopRatedContainer, this.filmsTopRatedList.getElement());

    render(this.filmsMostRecommentedList, this.filmsBoard.getElement());
    render(this.filmsMostRecommentedContainer, this.filmsMostRecommentedList.getElement());

    for (let i = 0; i < 2; i++) {
      render(new MovieCardView(this.filmsCards[i]), this.filmsTopRatedContainer.getElement());
      render(new MovieCardView(this.filmsCards[i]), this.filmsMostRecommentedContainer.getElement());
    }

    render(new PopupView(this.filmsCards[0]), boardContainer);
  };
}
