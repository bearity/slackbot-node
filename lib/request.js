"use strict";
const request = require('request');
const debug = require('debug')('slackbot-node:'+ require('path').basename(__filename));

module.exports = {
    json: function(name, url) {
        return new Promise(function (resolve, reject) {
            request({url:url, json:true}, function (err, res, body) {
                if (err) {
                    return reject(err);
                } else if (res.statusCode !== 200) {
                    err = new Error("Unexpected status code: " + res.statusCode);
                    err.res = res;
                    debug('[REJECTED]', name);
                    return reject(err);
                }
                debug('[RESOLVED]', name);
                resolve(body);
            });
        });
    }
}