const getRandomPositiveInteger = (min, max) => {
  const from = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const to = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  return Math.floor(Math.random() * (to - from + 1) + from);
};

const getRandomPositiveFloat = (min, max, amountFloat = 1) => {
  const from = Math.min(Math.abs(min), Math.abs(max));
  const to = Math.max(Math.abs(min), Math.abs(max));
  return (Math.random() * (to - from) + from).toPrecision(amountFloat);
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomPositiveInteger, getRandomPositiveFloat, updateItem};
