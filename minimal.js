const { getData, getRandomQuote } = require('./getData');

getData()
  .then((res) => console.log(`Number of people: ${res}/25`))
  .catch((e) => console.err(e.message));

console.log(getRandomQuote());
