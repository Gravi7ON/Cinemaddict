import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';
import {nanoid} from 'nanoid';

const AUTHORIZATION = `Basic ${nanoid()}`;
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const mainContentElement = document.querySelector('.main');
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filmsPresenter = new FilmsPresenter(mainContentElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainContentElement, filterModel, filmsModel);

filterPresenter.init();
filmsPresenter.init();
filmsModel.init();
