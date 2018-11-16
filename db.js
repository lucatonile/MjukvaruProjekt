require('dotenv').config();

const mongoose = require('mongoose');

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

module.exports = db;
