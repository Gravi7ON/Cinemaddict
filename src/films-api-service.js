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

  getComments = (filmId) => fetch(`https://17.ecmascript.pages.academy/cinemaddict/comments/${filmId}`, {
    headers: {
      'Authorization': 'Basic nDiIRKWW9mAGnbeUIKcu'
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
}
