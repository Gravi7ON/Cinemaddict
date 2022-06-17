import ApiService from './framework/api-service.js';
import {errorLoadWrapper} from './utils/film.js';

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
      errorLoadWrapper.showError(err);
    });

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
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

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': {
        ...film.filmInfo,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        'age_rating': film.filmInfo.ageRating,
        release: {
          ...film.filmInfo.release,
          'release_country': film.filmInfo.release.releaseCountry
        }
      },
      'user_details': {
        ...film.userDetails,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate
      }
    };

    delete adaptedFilm.filmInfo.alternativeTitle;
    delete adaptedFilm.filmInfo.totalRating;
    delete adaptedFilm.filmInfo.ageRating;
    delete adaptedFilm.filmInfo.release.releaseCountry;
    delete adaptedFilm.userDetails.alreadyWatched;
    delete adaptedFilm.userDetails.watchingDate;

    return adaptedFilm;
  };
}
