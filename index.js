const { Composer } = require('micro-bot');
const { getData, getRandomQuote } = require('./getData');

require('dotenv').config();

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Composer();

bot.command('stats', async (ctx) => {
  try {
    const res = await getData();
    const { text: quote, author } = getRandomQuote();

    const parsedMessage = `Number of people: <pre language="scala">${res.numPeople}/${res.max}</pre>\n<i>${quote}</i> [${author}]`;

    return ctx.replyWithHTML(parsedMessage);
  } catch (error) {
    console.err(error.message);
    return ctx.reply('something went wrong :/');
  }
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
