const { Telegraf ,Markup } = require('telegraf');

const bot = new Telegraf('g');

const userStreaks = {};
const activeUsers = new Set();



bot.start((ctx) => {
    const userId = ctx.from.id;
    userStreaks[userId] = 0;
    activeUsers.add(userId);

    ctx.reply('أحلي Streak لصلاه الفجر ! 🔥');
});
bot.command('streak',(ctx)=> {
    return ctx.reply(
    'هل صليت الفجر اليوم؟💜',
    Markup.inlineKeyboard([
        [Markup.button.callback('نعم',"yes")],
        [Markup.button.callback('لا',"no")]])
    );
});

bot.on('text', (ctx) => {
    const userId = ctx.from.id;
    const streak = userStreaks[userId] || 0;

    ctx.reply(`🔥 استريكك الحالي: ${streak}`);
});

bot.action('yes', async (ctx) => {
    const userId = ctx.from.id;
    userStreaks[userId] = (userStreaks[userId] || 0) + 1;

    await ctx.answerCbQuery();
    await ctx.deleteMessage(); 
    ctx.reply('ربنا يبارك لك ف عمرك و يزيدك يعم');
});

bot.action('no', async (ctx) => {
    const userId = ctx.from.id;
    userStreaks[userId] = 0;

    await ctx.answerCbQuery();
    await ctx.deleteMessage(); 
    ctx.reply('حرام عليك نفسك يصحبي ابدأ م الاول تاني');
});


// Launch the bot
bot.launch();

setInterval(() => {
    activeUsers.forEach((userId) => {
        bot.telegram.sendMessage(
            userId,
            'هل صليت الفجر اليوم؟💜',
            Markup.inlineKeyboard([
                [Markup.button.callback('نعم', "yes")],
                [Markup.button.callback('لا', "no")]
            ])
        );
    });
}, 24 * 60 * 60 * 1000); // every 24 hours
setInterval(() => {
    activeUsers.forEach((userId) => {
        const streak = userStreaks[userId] || 0;
        bot.telegram.sendMessage(userId, `🔥 استريكك الحالي: ${streak}`);
    });
}, 2 * 60 * 60 * 1000); 
setInterval(() => {
    activeUsers.forEach((userId) => {
        bot.telegram.sendMessage(userId, `إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا`);
    });
}, 1 * 60 * 60 * 1000); 

console.log('Bot is running...');
