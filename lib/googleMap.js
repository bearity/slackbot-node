"use strict";
const rp = require('request-promise');
const request = require('request');
const debug = require('debug')('slackbot-node:'+ require('path').basename(__filename));
const appConf = require('../conf/app.conf');
const API_URL = {
    HOST: 'https://maps.googleapis.com',
    PLACE_NEARBY: '/maps/api/place/nearbysearch/json',
    PLACE_DETAIL: '/maps/api/place/details/json',
    DISTANCE_MATRIX: '/maps/api/distancematrix/json'
};

module.exports = {
    placeSearch: function(name, location) {
        return new Promise(function(resolve, reject) {
            debug('[START] placeSearch(PROMISE)');
            debug('name:',name,'location:',location);
            let url = API_URL.HOST + API_URL.PLACE_NEARBY
                + '?location=' + location
                + '&name=' + encodeURIComponent(name)
                + '&key='+ appConf.GOOGLE_API_KEY
                + '&types=food'
                + '&rankby=distance';
            debug('[REQUEST]',url);
            this._request('placeSearch', url).then(function(res) {
                resolve(res);
            })
            .catch(function(err) {
                reject(err);
            });
        }.bind(this));
    },
    placeDetail: function(placeId) {
        return new Promise(function(resolve, reject) {
            debug('[START] placeDetail (PROMISE)');
            debug('placeid',placeId);
            let url = API_URL.HOST + API_URL.PLACE_DETAIL
                + '?placeid=' + placeId
                + '&key=' + appConf.GOOGLE_API_KEY;

            debug('[REQUEST]',url);
            this._request('placeDetail', url).then(function(res) {
                resolve(res);
            })
            .catch(function(err) {
                reject(err);
            });
        }.bind(this));
    },
    distanceMatrix: function(origin, destination) {
        return new Promise(function(resolve, reject) {
            debug('[START] distanceMatrix(PROMISE)');
            debug('origin:',origin, 'destination:',destination);
            let url = API_URL.HOST + API_URL.DISTANCE_MATRIX
                + '?origins=' + origin
                + '&destinations=' + destination
                + '&mode=walking'
                + '&key=' + appConf.GOOGLE_API_KEY;

            debug('[REQUEST]',url); 
            this._request('distanceMatrix', url).then(function(res) {
                resolve(res);
            })
            .catch(function(err) {
                reject(err);
            });
        }.bind(this));
    },
    _request: function(name, url) {
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
};