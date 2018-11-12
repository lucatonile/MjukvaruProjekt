var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');

var bikeSchema = new mongoose.Schema({
    submitter: ObjectId,
    active: Boolean,
    type: {
        type: String, 
        enum: ['FOUND', 'STOLEN']},
    brand: String,
    model: String,
    color: String,
    frame_number: Number,
    antitheft_code: String,
    description: String,
    location: { 
        lat: Number,
        long: Number},
    image_url: String,
    keywords: {
        male: Boolean,
        female: Boolean,
        sport: Boolean,
        tandem: Boolean,
        basket: Boolean,
        rack: Boolean,
        mudguard: Boolean,
        chain_protection: Boolean,
        net: Boolean,
        winter_tires: Boolean,
        light: Boolean
    },
    comments: [{
        author: ObjectId,
        body: String, 
        date: Date}]
});

var bikeModel = mongoose.model('Bike', bikeSchema, "bikes");

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    create_time: Date,
    phone_number: Number,
    game_score: Number
});

var userModel = mongoose.model('User', userSchema, "users");

module.exports = {
    bike: bikeModel,
    user: userModel
}