import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  getComments = (filmId) => {
    const comments = this.#filmsApiService.getComments(filmId);
    return comments;
  };

  updateFilm = async (updateType, update, typePresenter) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      const comments = await this.#filmsApiService.getComments(update.id);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm, comments, typePresenter);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  deleteComment = async (updateType, update, commentId, typePresenter) => {
    const filmIndex = this.films.findIndex((film) => film.id === update.id);
    const deletingComment = update.comments.find((comment) => comment === commentId);

    try {
      await this.#filmsApiService.deleteComment(deletingComment);
      const comments = await this.#filmsApiService.getComments(update.id);

      this.#films = [
        ...this.#films.slice(0, filmIndex),
        {
          ...update,
          comments: update.comments.filter((comment) => comment !== commentId)
        },
        ...this.#films.slice(filmIndex + 1)
      ];

      this._notify(updateType, update, comments, typePresenter);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  addComment = async (updateType, update, newComment, typePresenter) => {
    const filmIndex = this.films.findIndex((film) => film.id === update.id);

    if (!newComment.comment || !newComment.emotion) {
      throw new Error('Can\'t add unexisting comment or emotion');
    }

    try {
      const updatedComments = await this.#filmsApiService.addComment(update, newComment);

      this.#films = [
        ...this.#films.slice(0, filmIndex),
        this.#adaptToClient(updatedComments.movie),
        ...this.#films.slice(filmIndex + 1)
      ];

      this._notify(updateType, update, updatedComments.comments, typePresenter);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      filmInfo: {
        ...film['film_info'],
        alternativeTitle: film['film_info'].alternative_title,
        totalRating: film['film_info'].total_rating,
        ageRating: film['film_info'].age_rating,
        release: {
          ...film['film_info'].release,
          releaseCountry: film['film_info'].release.release_country
        }
      },
      userDetails: {
        ...film['user_details'],
        alreadyWatched: film['user_details'].already_watched,
        watchingDate: film['user_details'].watching_date
      }
    };

    delete adaptedFilm['film_info']['alternative_title'];
    delete adaptedFilm['film_info']['total_rating'];
    delete adaptedFilm['film_info']['age_rating'];
    delete adaptedFilm['film_info'].release['release_country'];
    delete adaptedFilm['user_details']['already_watched'];
    delete adaptedFilm['user_details']['watching_date'];

    return adaptedFilm;
  };
}
