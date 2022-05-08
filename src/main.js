import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';

const mainContentElement = document.querySelector('.main');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter(mainContentElement, filmsModel);

filmsPresenter.init();
