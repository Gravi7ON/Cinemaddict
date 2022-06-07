import {getRandomPositiveInteger, getRandomPositiveFloat} from '../utils/common.js';
import {nanoid} from 'nanoid';

const createTitle = () => {
  const titles = [
    'Happiness On The Floor',
    'Friends Without The Carpet',
    'A Shark Who Sold Himself',
    'Happiness Who Bought The Carpet',
    'Laziness Within The Floor',
    'A Man Who Saw Him',
    'A Lion Of The Darkness',
    'Pioneers Who The Floor',
    'A Lion Who Saw The Floor',
    'A Little Pony In The Void',
    'Pioneers With The Carpet',
    'Friends With The Room',
    'A Shark Who Sold Himself',
    'A Man Who Sold Themselves',
    'Family Within The Void',
    'A Lion Who Saw The Storm',
  ];
  return titles[getRandomPositiveInteger(0, titles.length - 1)];
};

const createAgeRating = () => {
  const ages = [0, 6, 12, 16, 18];
  return ages[getRandomPositiveInteger(0, ages.length - 1)];
};

const createGenre = () => {
  const genres = [
    ['Sci-Fi'],
    ['Action', 'Horror', 'Family', 'Sci-Fi', 'Drama'],
    ['Horror', 'Sci-Fi', 'Animation', 'Thriller'],
    ['Sci-Fi', 'Animation', 'Horror'],
    ['Comedy', 'Family', 'Drama'],
    ['Drama', 'Horror', 'Animation'],
    ['Action', 'Animation', 'Horror', 'Comedy', 'Family', 'Adventure']
  ];
  return genres[getRandomPositiveInteger(0, genres.length - 1)];
};

const createDescription = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'
  ];
  return description[getRandomPositiveInteger(0, description.length - 1)];
};

const createImageAddress = () => {
  const addresses = [
    'the-man-with-the-golden-arm',
    'the-great-flamarion',
    'the-dance-of-life',
    'santa-claus-conquers-the-martians',
    'sagebrush-trail'
  ];
  return addresses[getRandomPositiveInteger(0, addresses.length - 1)];
};

const createComment = () => {
  const emotions = ['smile', 'puke', 'sleeping', 'angry'];
  const comments = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'
  ];
  const userNames = [
    'Natasha O\'Caml',
    'Sergey O\'Caml',
    'Fedor O\'Reilly',
    'Tim Makoveev',
    'Marina James',
    'Ilya O\'Reilly'
  ];
  const getComment = () => ({
    'id': nanoid(),
    'author': userNames[getRandomPositiveInteger(0, userNames.length - 1)],
    'comment': comments[getRandomPositiveInteger(0, comments.length - 1)],
    'date': '2019-05-11T16:12:32.554Z',
    'emotion': emotions[getRandomPositiveInteger(0, emotions.length - 1)]
  });
  return Array.from({length: getRandomPositiveInteger(1, 10)}, getComment);
};

const getDate = () => {
  const dates = [
    '1937-08-15T00:00:00.000Z',
    '1965-02-18T00:00:00.000Z',
    '1987-03-10T00:00:00.000Z',
    '1955-06-14T00:00:00.000Z',
    '1963-09-13T00:00:00.000Z',
    '1974-04-22T00:00:00.000Z',
    '1980-05-28T00:00:00.000Z'
  ];
  return dates[getRandomPositiveInteger(0, dates.length - 1)];
};

export const createFilm = () => ({
  'id': nanoid(),
  'comments': createComment(),
  'film_info': {
    'title': createTitle(),
    'alternative_title': 'Laziness Who Sold Themselves',
    'total_rating': getRandomPositiveFloat(1, 10, 2),
    'poster': `images/posters/${createImageAddress()}.jpg`,
    'age_rating': createAgeRating(),
    'director': 'Tom Ford',
    'writers': [
      'Takeshi Kitano'
    ],
    'actors': [
      'Morgan Freeman'
    ],
    'release': {
      'date': getDate(),
      'release_country': 'Finland'
    },
    'runtime': getRandomPositiveInteger(80, 180),
    'genre': createGenre(),
    'description': `${createDescription()} ${createDescription()}`
  },
  'user_details': {
    'watchlist': Boolean(getRandomPositiveInteger(0, 1)),
    'already_watched': Boolean(getRandomPositiveInteger(0, 1)),
    'watching_date': '2019-04-12T16:12:32.554Z',
    'favorite': Boolean(getRandomPositiveInteger(0, 1))
  }
});
