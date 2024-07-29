

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default eventHandler((event) => {
  return getRandomNumber(1, 6).toString();
});
