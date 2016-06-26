"use strict";
const URL = "http://www.drk7.jp/weather/json/13.js";
const request = require('../lib/request.js');
const $ = require('jquery');

// module.exports = function(args, conn, bot, message) {
    request.json('weather', URL).then(function(res) {
        res = res.replace(/drk7jpweather\.callback\(/,'');
        res = res.replace(/\)\;/,'');

        let json = JSON.parse(res);

        console.log(json.pref.area.東京地方);
        console.log(json.pref.area.東京地方.info[0].rainfallchance);
    })
    .catch(function(err) {
        console.log(err);
    });
// }