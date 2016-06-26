const fs = require('fs');

let Messages = {
    MODULE_LIST: 'コマンド一覧: $commands',
    NOT_FOUND: '該当モジュールが存在しないか、またはヘルプが設定されていません'
}

exports.help = '*HELP* ヘルプメッセージを表示します\r!help [コマンド]';

exports.func = function(args, conn, bot, message) {
    if(args.length == 1) {
        let moduleList = new Array();
        fs.readdir('./modules', function(err, list) {
            let commands = list.join(' ').replace(/\.js/g, '');
            bot.postMessage(message.channel, Messages.MODULE_LIST.replace('$commands', commands), {icon_emoji:':question:'});
        });
    }
    if(args.length == 2) {
        try {
            let moduleHelp = require('../modules/'+ args[1]).help;
            if(typeof moduleHelp != 'undefined' && moduleHelp != '') {
                bot.postMessage(message.channel, moduleHelp, {icon_emoji:':question:'});
            }
        }
        catch(e) {
            console.log(e);
            bot.postMessage(message.channel, Messages.NOT_FOUND, {icon_emoji:':question:'});
        }
    }
}