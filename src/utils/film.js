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

const showErrorLoadWrapper = (message) => {
  const errorBlockElement = document.createElement('div');
  errorBlockElement.style.zIndex = 100;
  errorBlockElement.style.position = 'absolute';
  errorBlockElement.style.left = 0;
  errorBlockElement.style.top = 0;
  errorBlockElement.style.right = 0;
  errorBlockElement.style.boxShadow = '0 2px 5px #0e1f3cc4';
  errorBlockElement.style.padding = '35px 3px';
  errorBlockElement.style.opacity = '95%';
  errorBlockElement.style.fontSize = '20px';
  errorBlockElement.style.fontWeight = 'bold';
  errorBlockElement.style.textAlign = 'center';
  errorBlockElement.style.fontFamily = 'Open Sans, sans-serif';
  errorBlockElement.style.color = '#ff00009c';
  errorBlockElement.style.backgroundColor = '#212126';

  errorBlockElement.textContent = `Comments not found, please try again (${message})`.toUpperCase();

  document.body.append(errorBlockElement);

  setTimeout(() => {
    errorBlockElement.remove();
  }, 5000);
};

export {formatDate, getShortDescription, sortFilmsDate, sortFilmsRating, showErrorLoadWrapper};
