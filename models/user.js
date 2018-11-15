const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('mongoose-type-email');
const uniqueValidator = require('mongoose-unique-validator');

const saltRounds = 10;

/* User model */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
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
    select: false,
    trim: true,
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

userSchema.plugin(uniqueValidator);

// From: https://github.com/DDCSLearning/authenticationIntro/commit/33ac4662c38f7c3115615983cf60effe2ebbd7ed
// hashing a password before saving it to the database
userSchema.pre('save', function encrypt(next) {
  const user = this;
  // eslint-disable-next-line consistent-return
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

const userModel = mongoose.model('User', userSchema, 'users');

// Use initial uppercase for models (as with a Class object)
module.exports = {
  User: userModel,
};
