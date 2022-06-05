import Observable from '../framework/observable.js';
import {createFilm} from '../mock/film.js';
import {UPDATE_COUNT, DELETE_COUNT} from '../const.js';
import {nanoid} from 'nanoid';

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

  deleteComment = (updateType, update, evt) => {
    const film = this.films.find((movie) => movie.id === update.id);
    const indexDeletingComment = film.comments.findIndex((comment) => comment.id === evt.target.id);

    if (indexDeletingComment === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    const refreshComments = film.comments;
    refreshComments.splice(indexDeletingComment, DELETE_COUNT);

    this._notify(updateType, film);
  };

  addComment = (updateType, update) => {
    const film = this.films.find((movie) => movie.id === update.id);
    const comments = film.comments;
    const getComment = () => ({
      'id': nanoid(),
      'author': 'Ilya O\'Reilly',
      'date': '2019-05-11T16:12:32.554Z',
      'comment': 'Testing comment',
      'emotion': 'sleeping'
    });
    const newComment = getComment();
    comments.push(newComment);
    const addedComment = {...film, comments};

    this._notify(updateType, addedComment);
  };
}
