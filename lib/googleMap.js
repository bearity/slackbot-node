"use strict";
const debug = require('debug')('lib:'+ require('path').basename(__filename));
const appConf = require('../conf/app.conf');
const request = require('./request.js');
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
            request('placeSearch', url, true).then(function(res) {
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
            request('placeDetail', url, true).then(function(res) {
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
            request('distanceMatrix', url, true).then(function(res) {
                resolve(res);
            })
            .catch(function(err) {
                reject(err);
            });
        }.bind(this));
    }
};