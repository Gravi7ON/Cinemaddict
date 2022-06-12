import ApiService from './framework/api-service.js';
import {showErrorLoadWrapper} from './utils/film.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST'
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = async (filmId) => await fetch(`${this._endPoint}/comments/${filmId}`, {
    headers: {
      'Authorization': `${this._authorization}`
    }})
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status}, ${response.statusText}`);
      }

      return response.json();
    })
    .catch((err) => {
      showErrorLoadWrapper(err);
    });

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  addComment = async (film, newComment) => {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(newComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });

    return response;
  };
}
