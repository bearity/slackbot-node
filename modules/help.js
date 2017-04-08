const fs = require('fs');

let Messages = {
    MODULE_LIST: 'Command list: $commands',
    NOT_FOUND: 'Module not found, or module doesn\'t have help message.'
}

exports.help = '*HELP* Display help message.\r!help [command]';

exports.func = function(args, conn, bot, message) {
    if(args.length == 1) {
        let moduleList = new Array();
        fs.readdir(require('path').dirname(__filename), function(err, list) {
            let commands = list.join(' ').replace(/\.js/g, '');
            bot.postMessage(message.channel, Messages.MODULE_LIST.replace('$commands', commands), {icon_emoji:':question:'});
        });
    }
    if(args.length == 2) {
        try {
            let moduleHelp = require(require('path').dirname(__filename) + '/' + args[1]).help;
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
