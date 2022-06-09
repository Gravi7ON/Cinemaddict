import ApiService from './framework/api-service.js';
import {nanoid} from 'nanoid';
import {showErrorLoadWrapper} from './utils/film.js';

const RANDOM_STRING = nanoid();

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

  getComments = (filmId) => fetch(`https://17.ecmascript.pages.academy/cinemaddict/comment/${filmId}`, {
    headers: {
      'Authorization': `Basic ${RANDOM_STRING}`
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

  updateTask = async (film) => {
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
