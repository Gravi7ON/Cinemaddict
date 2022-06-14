import dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime);

const formatDate = (date) => dayjs(date);

const getShortDescription = (description) => {
  if (description.trim().length > 140) {
    return `${description.trim().slice(0, 139)}...`;
  }

  return description.trim();
};

const sortFilmsDate = (filmA, filmB) => {
  const dateA = formatDate(filmA.film_info.release.date).format('YYYY');
  const dateB = formatDate(filmB.film_info.release.date).format('YYYY');

  return dateB - dateA;
};

const sortFilmsRating = (filmA, filmB) => {
  const ratingA = filmA.film_info.total_rating;
  const ratingB = filmB.film_info.total_rating;

  return ratingB - ratingA;
};

const errorLoadWrapper = {
  timeoutId: null,

  showError(message) {
    const errorBlockElement = document.createElement('div');
    errorBlockElement.classList.add('film-details_error-notification');
    errorBlockElement.textContent = `Comments not found, please try again (${message})`;
    document.body.append(errorBlockElement);

    this.timeoutId = setTimeout(() => {
      document.querySelector('.film-details_error-notification').remove();
    }, 5000);
  },

  deleteTimeout() {
    clearTimeout(this.timeoutId);
  }
};

export {formatDate, getShortDescription, sortFilmsDate, sortFilmsRating, errorLoadWrapper};
