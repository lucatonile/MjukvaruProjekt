var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('mongoose-type-email');

var ObjectId = mongoose.Schema.Types.ObjectId;

var bikeSchema = new mongoose.Schema({
    submitter: {
        type: ObjectId,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String, 
        enum: ['FOUND', 'STOLEN'],
        required: true,
    },
    brand: {
        type: String,
        trim: true,
    },
    model: {
        type: String,
        trim: true,
    },
    color: {
        type: String,
        trim: true,
    },
    frame_number: Number,
    antitheft_code: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    location: { 
        lat: Number,
        long: Number,
    },
    image_url: {
        type: String,
        trim: true,
    },
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
        light: Boolean,
    },
    comments: [{
        author: {
            type: ObjectId,
            required: true,
        },
        body: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        }
    }]
});

var bikeModel = mongoose.model('Bike', bikeSchema, "bikes");

/* User model */

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true,
        dropDups: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    create_time: {
        type: Date,
        default: Date.now,
    },
    phone_number: Number,
    game_score: {
        type: Number,
        default: 0,
    },
});

// From: https://github.com/DDCSLearning/authenticationIntro/commit/33ac4662c38f7c3115615983cf60effe2ebbd7ed
// hashing a password before saving it to the database
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
});

var userModel = mongoose.model('User', userSchema, "users");

module.exports = {
    bike: bikeModel,
    user: userModel
}