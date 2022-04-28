import SortMenuView from '../view/sort-menu-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsTopRatedListView from '../view/films-top-rated-list-view.js';
import FilmsMostRecommentedListView from '../view/films-most-recommented-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import MovieCardView from '../view/movie-card-view';
import ButtonShowMoreView from '../view/show-more-button-view.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  filmsBoard = new FilmsBoardView();
  filmsList = new FilmsListView();
  filmsTopRatedList = new FilmsTopRatedListView();
  filmsMostRecommentedList = new FilmsMostRecommentedListView();

  getMovieCard() {
    return () => new MovieCardView();
  }

  getContainerView(element) {
    switch(element){
      case 'films':
      case 'recommented':
      case 'rated':
        return new FilmsContainerView();
      default:
        break;
    }
  }

  init = (boardContainer) => {
    this.boardContainer = boardContainer;
    this.filmsContainer = this.getContainerView('films');
    this.filmsTopRatedContainer = this.getContainerView('rated');
    this.filmsMostRecommentedContainer = this.getContainerView('recommented');

    render(new SortMenuView(), this.boardContainer);
    render(this.filmsBoard, this.boardContainer);
    render(this.filmsList, this.filmsBoard.getElement());
    render(this.filmsContainer, this.filmsList.getElement());
    render(new ButtonShowMoreView(), this.filmsList.getElement());

    for (let i = 0; i < 5; i++) {
      render((this.getMovieCard())(), this.filmsContainer.getElement());
    }

    render(this.filmsTopRatedList, this.filmsBoard.getElement());
    render(this.filmsTopRatedContainer, this.filmsTopRatedList.getElement());

    render(this.filmsMostRecommentedList, this.filmsBoard.getElement());
    render(this.filmsMostRecommentedContainer, this.filmsMostRecommentedList.getElement());

    for (let i = 0; i < 2; i++) {
      render((this.getMovieCard())(), this.filmsTopRatedContainer.getElement());
      render((this.getMovieCard())(), this.filmsMostRecommentedContainer.getElement());
    }
  };
}
