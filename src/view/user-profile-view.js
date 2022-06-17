import AbstractView from '../framework/view/abstract-view.js';

const getRank = (watchedFilms) => {
  if (watchedFilms === 0) {
    return '';
  }

  if (watchedFilms >= 1 && watchedFilms <= 10) {
    return 'Novice';
  }

  if (watchedFilms > 10 && watchedFilms <= 20) {
    return 'Fan';
  }

  return 'Movie Buff';
};


const createUserProfileTemplate = (films) => {
  const userRank = getRank(films.filter((film) => film.userDetails.alreadyWatched).length);

  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserProfileView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createUserProfileTemplate(this.#films);
  }
}
