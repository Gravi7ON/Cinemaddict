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
  const dateA = formatDate(filmA.filmInfo.release.date).format('YYYY');
  const dateB = formatDate(filmB.filmInfo.release.date).format('YYYY');

  return dateB - dateA;
};

const sortFilmsRating = (filmA, filmB) => {
  const ratingA = filmA.filmInfo.totalRating;
  const ratingB = filmB.filmInfo.totalRating;

  return ratingB - ratingA;
};

const sortFilmsComments = (filmA, filmB) => {
  const ratingA = filmA.comments.length;
  const ratingB = filmB.comments.length;

  return ratingB - ratingA;
};

const getRandomPositiveInteger = (min, max) => {
  const from = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const to = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  return Math.floor(Math.random() * (to - from + 1) + from);
};

const getRandomUniquePositiveInteger = (min, max) => {
  const previousValues = [];

  return () => {
    let currentValue = getRandomPositiveInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      return;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomPositiveInteger(min, max);
    }
    previousValues.push(currentValue);

    return currentValue;
  };
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

export {formatDate, getShortDescription, sortFilmsDate, sortFilmsRating, errorLoadWrapper, sortFilmsComments, getRandomUniquePositiveInteger};
