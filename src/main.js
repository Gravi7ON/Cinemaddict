import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';

const mainContentElement = document.querySelector('.main');
const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const filmsPresenter = new FilmsPresenter(mainContentElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainContentElement, filterModel, filmsModel);

filterPresenter.init();
filmsPresenter.init();
