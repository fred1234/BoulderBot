const { getData, getRandomQuote } = require('./getData');

getData()
  .then((res) => console.log(`Number of people: ${res.numPeople}/${res.max}`))
  .catch((e) => console.err(e.message));

console.log(getRandomQuote());
