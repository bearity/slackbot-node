"use strict";
const mongoose = require('mongoose');
const host = require('../conf/mongodb.conf');
const debug = require('debug')('slackbot-node:'+ require('path').basename(__filename));

module.exports = {
    _conn: null,
    init: function() {
        if(this._conn != null) return this._conn;
        mongoose.connect('mongodb://54.199.181.84:27017/test');

        this._conn = mongoose.connection;
    },
    getConnection: function() {
        return this._conn;
    },
    close: function() {
        this._db.close();
        this._db = null;
    },
    insert: function(document, data) {
        return Promise(function(resolve, reject) {
            this._db.collection(document).insertOne(data, function(err, result) {
                if(err) {
                    debug('[rejected] Error occured while insert data.')
                    console.log(err.message);
                    reject(err);
                }
                else {
                    debug('[resolved] Insert data')
                    resolve();
                }
            });
        });
    }
}