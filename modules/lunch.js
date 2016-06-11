"use strict";
const LunchModel = require('../models/Lunch');
const appConf = require('../conf/app.conf');
const googleMapAPI = require('../lib/googleMap');
const debug = require('debug')('slackbot-node:'+ require('path').basename(__filename));
const mongoose = require('mongoose');
const Lunch = mongoose.model('Lunch', LunchModel);

const LunchMessage = {
    NOT_FOUND: '該当の飲食店を見つけられませんでした。',
    NOT_FOUND_DB: 'そういう名前のデータは登録されていません。',
    SAVED: '次のデータが追加されました。「$name」',
    EXISTS: '「$name」はすでに登録されています。',
    REMOVED: '次のデータを削除しました。「$name」',
    COUNT: '現在登録されている飲食店は「$count」件です。',
    RESULT: '抽選の結果は、「$name」です！'
};

module.exports = function(args, conn, bot, message) {
    let sub = args[1];
    args.splice(0,2);
    let arg = args.join(' ');
    switch(sub) {
        case 'count':
            Lunch.count({}, function(err, count) {
                if(err) {
                    console.error(err);
                    return false;
                }

                bot.postMessage(message.channel, LunchMessage.COUNT.replace('$count', count), {icon_emoji:':neutral_face:'});
            });
            break;
        case 'add':
            // Add to lunch list
            let lunch = new Lunch();
            let location = appConf.PLACE_REFERENCE;

            googleMapAPI.placeSearch(arg, location)
                .then(function(res) {
                    debug('afterPlaceSarch');
                    if (res.results.length == 0) {
                        bot.postMessage(message.channel, LunchMessage.NOT_FOUND, {icon_emoji:':disappointed:'});
                        return false;
                    }

                    lunch.name = res.results[0].name;
                    lunch.location.lat = res.results[0].geometry.location.lat;
                    lunch.location.lng = res.results[0].geometry.location.lng;
                    lunch.place_id = res.results[0].place_id;

                    let query = Lunch.findOne({name: lunch.name});
                    query.select('name');

                    return query.exec();
                })
                .then(function(lunchFound) {
                    if(lunchFound != null && lunchFound.name == lunch.name) {
                        bot.postMessage(message.channel, LunchMessage.EXISTS.replace('$name',lunch.name), {icon_emoji:':disappointed:'});
                        return Promise.reject();
                    }
                    return googleMapAPI.placeDetail(lunch.place_id);
                })
                .then(function(res) {
                    debug('afterPlaceDetail');
                    lunch.url = res.result.url;
                    lunch.website = res.result.url;
                    lunch.phone = res.result.formatted_phone_number;

                    debug(lunch);
                    lunch.save(function(err, lunch) {
                        if(err) return console.error(err);
                        bot.postMessage(message.channel, LunchMessage.SAVED.replace('$name',lunch.name)+'\n'+lunch.url, {icon_emoji:':blush:'});
                    });
                }).
                catch(function(err) {
                    console.error(err.stack);
                });
            break;
        case 'remove':
            // Remove from lunch list
            let query = Lunch.findOne({name: arg});
            query.select('name');

            query.exec()
                .then(function(lunchFound) {
                    if(lunchFound == null) {
                        bot.postMessage(message.channel, LunchMessage.NOT_FOUND_DB, {icon_emoji:':scream:'});
                    }

                    lunchFound.remove(function(err) {
                        if(err) {
                            console.error(err);
                            return false;
                        }
                    });

                    bot.postMessage(message.channel, LunchMessage.REMOVED.replace('$name',arg), {icon_emoji:':ok_hand:'});
                });
            break;
        default:
            // Search
            let selected = null;
            Lunch.find().exec()
                .then(function(lunches) {
                    if(lunches == null) return false;
                    let max = lunches.length;
                    let rand = Math.floor((Math.random() * max));
                    selected = lunches[rand];
                    debug('rand:',rand);
                    // debug(selected);
                    return googleMapAPI.placeDetail(selected.place_id);
                })
                .then(function(res) {
                    let openStr = '';
                    if(typeof res.result.opening_hours.open_now != 'undefined') {
                        if(res.result.opening_hours.open_now == 'true') {
                            openStr = '(営業中)';
                        }
                        else {
                            openStr = '(営業時間外)';
                        }
                    }
                    bot.postMessage(message.channel, LunchMessage.RESULT.replace('$name',selected.name)
                        + openStr, 
                        {
                            "icon_emoji": ':ok_hand:',
                            "attachments": [
                                {"title": "GoogleMapで位置を確認する",
                                    "title_link": selected.url,
                                    "color": "#ff1111"}
                            ]
                        });
                });
    }

    return '';
};