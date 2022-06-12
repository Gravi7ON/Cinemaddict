import Observable from '../framework/observable.js';
import {DELETE_COUNT, UpdateType} from '../const.js';

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
      this.#films = await this.#filmsApiService.films;
    } catch(err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  getComments = (filmId) => {
    const comments = this.#filmsApiService.getComments(filmId);
    return comments;
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const updatedFilm = await this.#filmsApiService.updateFilm(update);
      const comments = await this.#filmsApiService.getComments(update.id);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm, comments);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  deleteComment = async (updateType, update, commentId) => {
    const filmIndex = this.films.findIndex((film) => film.id === update.id);
    const deletingComment = update.comments.find((comment) => comment === commentId);
    const indexDeletingComment = update.comments.findIndex((comment) => comment === commentId);
    update.comments.splice(indexDeletingComment, DELETE_COUNT);

    try {
      await this.#filmsApiService.deleteComment(deletingComment);
      const comments = await this.#filmsApiService.getComments(update.id);

      this.#films = [
        ...this.#films.slice(0, filmIndex),
        {
          ...update,
          comments: [...update.comments]
        },
        ...this.#films.slice(filmIndex + 1)
      ];

      this._notify(updateType, update, comments);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  addComment = async (updateType, update, newComment) => {
    const filmIndex = this.films.findIndex((film) => film.id === update.id);

    if (!newComment.comment || !newComment.emotion) {
      return;
    }

    try {
      const respondedComments = await this.#filmsApiService.addComment(update, newComment);

      this.#films = [
        ...this.#films.slice(0, filmIndex),
        respondedComments.movie,
        ...this.#films.slice(filmIndex + 1)
      ];

      this._notify(updateType, update, respondedComments.comments);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };
}
