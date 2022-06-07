import Observable from '../framework/observable.js';
import {createFilm} from '../mock/film.js';
import {UPDATE_COUNT, DELETE_COUNT} from '../const.js';

export default class FilmsModel extends Observable {
  #films = Array.from({length: 25}, createFilm);

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films.splice(index, UPDATE_COUNT, update);
    this._notify(updateType, update);
  };

  deleteComment = (updateType, update, commentId) => {
    const filmIndex = this.films.findIndex((film) => film.id === update.id);
    const indexDeletingComment = update.comments.findIndex((comment) => comment.id === commentId);
    update.comments.splice(indexDeletingComment, DELETE_COUNT);

    this.#films = [
      ...this.#films.slice(0, filmIndex),
      {
        ...update,
        comments: [...update.comments]
      },
      ...this.#films.slice(filmIndex + 1)
    ];

    this._notify(updateType, update);
  };

  addComment = (updateType, update, newComment) => {
    const filmIndex = this.films.findIndex((film) => film.id === update.id);

    if (!newComment.comment || !newComment.emotion) {
      return;
    }

    update.comments.push(newComment);

    this.#films = [
      ...this.#films.slice(0, filmIndex),
      {
        ...update,
        comments: [...update.comments]
      },
      ...this.#films.slice(filmIndex + 1)
    ];

    this._notify(updateType, update);
  };
}
