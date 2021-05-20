const WebSocket = require('ws');
const fs = require('fs');

const url = 'wss://coronow-2d6af.firebaseio.com/.ws?v=5&ns=coronow-2d6af';
const msg = {
  t: 'd',
  d: {
    r: 4,
    a: 'q',
    b: { p: '/data/1KN5NCz3HfQuXE8GZC3mPoXrwVq1', h: '' },
  },
};

function getData() {
  return new Promise((resolve, reject) => {
    const data = [];
    let numPeople;
    const socket = new WebSocket(url);
    socket.onopen = () => {
      socket.send(JSON.stringify(msg));
    };

    socket.onmessage = (event) => {
      data.push(JSON.parse(event.data).d);
      if (data.length >= 3) {
        [numPeople] = data.map((el) => el.b?.d.current).filter((el) => el);
        if (!numPeople) { numPeople = '0'; }
        socket.close();
      }
    };

    socket.onclose = () => { resolve(numPeople); };
    socket.onerror = (err) => { reject(err); };
  });
}

// by: https://forum.freecodecamp.org/t/free-api-inspirational-quotes-json-with-code-examples/311373
function getRandomQuote() {
  const data = fs.readFileSync('quotes.json');
  const quotes = JSON.parse(data);
  return quotes[Math.floor(Math.random() * quotes.length)];
}

exports.getData = getData;
exports.getRandomQuote = getRandomQuote;
