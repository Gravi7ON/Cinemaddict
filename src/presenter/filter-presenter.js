import {render, replace, remove} from '../framework/render.js';
import FilterMenuView from '../view/filter-menu-view.js';
import {UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #renderFilms = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel, renderFilms) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#renderFilms = renderFilms;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return this.#filmsModel.films;
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterMenuView(this.filters, this.#filterModel.filter);
    if (!this.#filmsModel.films.length === 0) {
      this.#filterComponent.setFilterTypeElementClick(this.#handleFilterTypeChange);
    }
    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.#renderFilms();
    this.init();
    if (this.#filmsModel.films.length === 0) {
      return;
    }

    this.#filterComponent.setFilterTypeElementClick(this.#handleFilterTypeChange);
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.PRE_MINOR, filterType);
  };
}
