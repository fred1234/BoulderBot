const { Telegraf } = require('telegraf');
const WebSocket = require('ws');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

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

const bot = new Telegraf(token);

bot.command('stats', async (ctx) => {
  const response = await getData();
  const parsedMessage = `Number of people: ${response.map((el) => el.b?.d.current).filter((el) => el)[0]}`;
  return ctx.reply(parsedMessage);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
