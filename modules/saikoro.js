"use strict";

exports.help = '*HELP* サイコロを振ります\r!saikoro [サイコロの最大の目:デフォルトは6]';

exports.func = function(args, conn, bot, message) {
    const SaikoroMessage = 'サイコロをふりました！結果は「$rand」です。';
    let min = 1;
    let max = 6;
    if(args.length == 2) {
        max = args[1];
    }
    let i = (Math.random() * 32768) >>> 0;
    let rand = Math.floor(Math.random() * (max + 1 - min)) + min;

    bot.postMessage(message.channel, SaikoroMessage.replace('$rand', rand), {icon_emoji:':game_die:'});
};