require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('../models/user');
const bikeModel = require('../models/bike');
const ratingModel = require('../models/rating');
const commentModel = require('../models/comment');

const mongoDB = process.env.DATABASE_URL;

mongoose.connect(mongoDB, { useNewUrlParser: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

// Get the default connection
const db = mongoose.connection;

/*
  Prevents deprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
  https://stackoverflow.com/questions/51916630/mongodb-mongoose-collection-find-options-deprecation-warning
*/
mongoose.set('useCreateIndex', true);

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function randomStolenOrFound() {
  if (Math.random() >= 0.5) return 'STOLEN';
  return 'FOUND';
}

function generateBikeData(index) {
  return {
    keywords: {
      child: Math.random() >= 0.5,
      sport: Math.random() >= 0.5,
      tandem: Math.random() >= 0.5,
      basket: Math.random() >= 0.5,
      rack: Math.random() >= 0.5,
      mudguard: Math.random() >= 0.5,
      chain_protection: Math.random() >= 0.5,
      net: Math.random() >= 0.5,
      winter_tires: Math.random() >= 0.5,
      light: Math.random() >= 0.5,
    },
    active: true,
    type: randomStolenOrFound(),
    title: `TestTitle ${index}`,
    brand: `TestBrand ${index}`,
    model: `TestModel ${index}`,
    color: `TestColor ${index}`,
    frame_number: index * 1000,
    submitter: '5c06751bf904906435db2743',
    antitheft_code: `TestAntitheft code ${index}`,
    description: `TestDescription string ${index}`,
    image_url: 'http://storage.googleapis.com/bikeini/9b041e90-f17b-11e8-bcca-3b559bc5e5ff',
  };
}

function generateUserData(index) {
  return {
    game_score: {
      bike_score: 0,
      bikes_lost: 0,
      thumb_score: 0,
      total_score: 0,
    },
    username: `TestUser${index}`,
    email: `${index}@testmail.test`,
    phone_number: index * 1111,
    location: 'Uppsala',
    password: index,
  };
}

function insertUserData(num) {
  for (let i = 0; i < num; i += 1) {
    const user = new userModel.User(generateUserData(i));
    user.save((err) => {
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        console.log(`User ${num} added!`);
      }
    });
  }
}

function insertBikeData(num) {
  for (let i = 0; i < num; i += 1) {
    const bike = new bikeModel.Bike(generateBikeData(i));
    bike.save((err) => {
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        console.log(`Bike ${num} added!`);
      }
    });
  }
}

function clearBikes(req, res, callback) {
  bikeModel.Bike.remove({},
    (err, removed) => {
      if (err) callback(err);
      else callback(removed);
    });
}

function clearUsers(req, res, callback) {
  userModel.User.remove({},
    (err, removed) => {
      if (err) callback(err);
      else callback(removed);
    });
}

function clearRatings(req, res, callback) {
  ratingModel.Rating.remove({},
    (err, removed) => {
      if (err) callback(err);
      else callback(removed);
    });
}

function clearComments(req, res, callback) {
  commentModel.Comment.remove({},
    (err, removed) => {
      if (err) callback(err);
      else callback(removed);
    });
}

function clearAll(req, res, callback) {
  commentModel.Comment.remove({}, (err) => {
    if (err) console.log(err);
    console.log('Comments removed');
  });
  ratingModel.Rating.remove({}, (err) => {
    if (err) console.log(err);
    console.log('Ratings removed');
  });
  userModel.User.remove({}, (err) => {
    if (err) console.log(err);
    console.log('User removed');
  });
  bikeModel.Bike.remove({}, (err) => {
    if (err) console.log(err);
    console.log('Bike removed');
  });
  callback('All cleared!');
}

module.exports = {
  insertBikeData,
  insertUserData,
  clearAll,
  clearBikes,
  clearUsers,
  clearRatings,
  clearComments,
};
