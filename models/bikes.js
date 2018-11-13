var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bikeSchema = new Schema({
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
        date: Date}],
    created_date: {
        type: Date,
        default: Date.now
        },
});

mongoose.model('Bike', bikeSchema, "bikes");
