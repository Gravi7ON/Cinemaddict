import {createElement} from '../render.js';

const getRank = (watchedFilms) => {
  if (watchedFilms >= 1 && watchedFilms <= 10) {
    return 'Novice';
  } else if (watchedFilms > 10 && watchedFilms <= 20) {
    return 'Fan';
  }
  return 'Movie Buff';
};

const createUserProfileTemplate = (film) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRank(film.filter((item) => item.user_details.already_watched === true).length)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserProfileView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createUserProfileTemplate(this.#film);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
