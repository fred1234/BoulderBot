const fs = require('fs');
const fetch = require('node-fetch');

const url = 'https://www.startupuniverse.ch/api/1.1/de/counters/get/1KN5NCz3HfQuXE8GZC3mPoXrwVq1';

async function getData() {
  let numPeople = 0;
  let max = 25;
  const res = await fetch(url);
  const json = await res.json();
  numPeople = json.response.data.counteritems[0].val;
  max = json.response.data.max;
  return { numPeople, max };
}

// by: https://forum.freecodecamp.org/t/free-api-inspirational-quotes-json-with-code-examples/311373
function getRandomQuote() {
  const data = fs.readFileSync('quotes.json');
  const quotes = JSON.parse(data);
  return quotes[Math.floor(Math.random() * quotes.length)];
}

exports.getData = getData;
exports.getRandomQuote = getRandomQuote;
