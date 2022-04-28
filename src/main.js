import UserProfileView from './view/user-profile-view.js';
import FilterMenuView from './view/filter-menu-view.js';
import FilmAmountView from './view/film-amount-view.js';
import {render} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';
// import PopupPresenter from './presenter/popup-presenter.js';

const userProfileElement = document.querySelector('.header');
const mainContentElement = document.querySelector('.main');
const filmAmountElement = document.querySelector('.footer__statistics');
const filmsPresenter = new FilmsPresenter();
// const popupPresenter = new PopupPresenter();

render(new UserProfileView(), userProfileElement);
render(new FilterMenuView(), mainContentElement);
render(new FilmAmountView(), filmAmountElement);
filmsPresenter.init(mainContentElement);
// popupPresenter.init(mainContentElement);
