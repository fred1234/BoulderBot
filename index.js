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
    const response = await getData();
    const quote = getRandomQuote();

    const parsedMessage = `Number of people: ${response} / 25 \n ${quote.text}  <sub>${quote.author}</sub>`;

    return ctx.reply(parsedMessage, { reply_markup: 'markdown' });
  } catch (error) {
    console.err(error.message);
    return ctx.reply('something went wrong :/');
  }
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
