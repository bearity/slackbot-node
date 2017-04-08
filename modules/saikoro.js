"use strict";

exports.help = '*HELP* Roll the dice.\r!dice [max:default 6]';

exports.func = function(args, conn, bot, message) {
    const SaikoroMessage = 'Let\'s roll the dice! It\'s [$rand].';
    let min = 1;
    let max = 6;
    if(args.length == 2) {
        max = args[1];
    }
    let i = (Math.random() * 32768) >>> 0;
    let rand = Math.floor(Math.random() * (max + 1 - min)) + min;

    bot.postMessage(message.channel, SaikoroMessage.replace('$rand', rand), {icon_emoji:':game_die:'});
};
