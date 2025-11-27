
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const token = process.env.BOT_TOKEN; // توکن ربات از BotFather
const apiKey = process.env.API_KEY;   // Unsplash یا Pixabay API Key

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'سلام! نام هر چیزی را بفرست تا 20 والپیپر برات بیارم.');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const query = msg.text;

  if (query.startsWith('/')) return; // دستورها را نادیده بگیر

  try {
    bot.sendMessage(chatId, `در حال جستجو برای: ${query} ...`);

    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`);
    const data = await response.json();

    if (data.hits.length === 0) {
      bot.sendMessage(chatId, 'هیچ تصویری پیدا نشد.');
      return;
    }

    for (let hit of data.hits) {
      bot.sendPhoto(chatId, hit.largeImageURL);
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, 'خطا در دریافت تصاویر.');
  }
});
