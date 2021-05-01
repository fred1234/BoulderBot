const WebSocket = require('ws');

const url = 'wss://s-usc1c-nss-245.firebaseio.com/.ws?v=5&ns=coronow-2d6af';
const msg = {
  t: 'd',
  d: {
    r: 4,
    a: 'q',
    b: { p: '/data/1KN5NCz3HfQuXE8GZC3mPoXrwVq1', h: '' },
  },
};

function connect() {
  return new Promise((resolve, reject) => {
    const data = [];
    const socket = new WebSocket(url);
    socket.onopen = function () {
      socket.send(JSON.stringify(msg));
    };

    socket.onmessage = function (event) {
      data.push(JSON.parse(event.data).d);
      if (data.length >= 3) {
        socket.close();
      }
    };

    socket.onclose = function () {
      resolve(data);
    };

    socket.onerror = function (err) {
      reject(err);
    };
  });
}

connect()
  .then((data) => {
    console.log(`people: ${data.map((el) => el.b?.d.current).filter((el) => el)[0]}`);
  })
  .catch((err) => {
    console.error(`ou ou: ${err.message}`);
  });
