"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
module.exports = new Schema({
    id: {type: Number},
    name: {type: String},
    location: {
        lat: {type: Number},
        lng: {type: Number}
    },
    place_id: {type: String},
    url: {type: String},
    website: {type: String},
    phone: {type: String},
    tags: {type: String}
});