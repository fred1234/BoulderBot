// heroku deployment - https://github.com/telegraf/telegraf/issues/363

const express = require('express');
const { Telegraf } = require('telegraf');
const WebSocket = require('ws');


require('dotenv').config();

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

const expressApp = express();

const port = process.env.PORT || 3000;
expressApp.get('/', (req, res) => {
  res.send('Hello World!');
});
expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const url = 'wss://s-usc1c-nss-245.firebaseio.com/.ws?v=5&ns=coronow-2d6af';
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
    let numPeople = '';
    const socket = new WebSocket(url);
    socket.onopen = function () {
      socket.send(JSON.stringify(msg));
    };

    socket.onmessage = function (event) {
      data.push(JSON.parse(event.data).d);
      if (data.length >= 3) {
        [numPeople] = data.map((el) => el.b?.d.current).filter((el) => el);
        socket.close();
      }
    };

    socket.onclose = function () {
      resolve(numPeople);
    };

    socket.onerror = function (err) {
      reject(err);
    };
  });
}

const bot = new Telegraf(token);

bot.command('stats', async (ctx) => {try {
  const response = await getData();
  const parsedMessage = `Number of people: ${response} / 25`;
  return ctx.reply(parsedMessage);
} catch (error) {
  console.log(error.message);
  return ctx.reply('something went wrong :/');
}
});

bot.startPolling();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
