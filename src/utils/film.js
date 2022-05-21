import dayjs from 'dayjs';

const formatDate = (date) => dayjs(date);

const getShortDescription = (description) => {
  if (description.trim().length > 140) {
    return `${description.trim().slice(0, 139)}...`;
  }

  return description.trim();
};

const toggleButtonStyle = (evt, styleClass) => evt.target.classList.toggle(styleClass);

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

export {formatDate, getShortDescription, toggleButtonStyle, sortFilmsDate, sortFilmsRating};
