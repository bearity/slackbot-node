"use strict";
const mongoose = require('mongoose');
const host = require('../conf/mongodb.conf');
const debug = require('debug')('lib:'+ require('path').basename(__filename));

module.exports = {
    _conn: null,
    init: function() {
        if(this._conn != null) return this._conn;
        mongoose.connect(host);

        this._conn = mongoose.connection;
    },
    getConnection: function() {
        return this._conn;
    },
    close: function() {
        this._db.close();
        this._db = null;
    }
}