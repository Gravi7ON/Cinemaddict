import dayjs from 'dayjs';

const getRandomPositiveInteger = (min, max) => {
  const from = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const to = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  return Math.floor(Math.random() * (to - from + 1) + from);
};

const getRandomPositiveFloat = (min, max, amountFloat = 1) => {
  const from = Math.min(Math.abs(min), Math.abs(max));
  const to = Math.max(Math.abs(min), Math.abs(max));
  return +(Math.random() * (to - from) + from).toFixed(amountFloat);
};

const formatDate = (date) => dayjs(date);

const getShortDescription = (description) => {
  if (description.trim().length > 140) {
    return `${description.trim().slice(0, 139)}...`;
  }

  return description.trim();
};

export {getRandomPositiveInteger, getRandomPositiveFloat, formatDate, getShortDescription};
