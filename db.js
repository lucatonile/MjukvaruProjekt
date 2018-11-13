var mongoose = require('mongoose');

var mongoDB = 'mongodb://heroku_s6frx9gr:72tejkhqkoq8r9pn9kqbkquid0@ds063879.mlab.com:63879/heroku_s6frx9gr';
const localDB = 'mongodb://localhost:27017/bikeifyDB';
const testEnv = false;

if (testEnv) {
  mongoose.connect(localDB, { useNewUrlParser: true });
  console.log('connection established');
} else {
  mongoose.connect(mongoDB, { useNewUrlParser: true });
}

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
var db = mongoose.connection;

/*
  Prevents deprecationWarning: collection.ensureIndex is deprecated.
  Use createIndexes instead.
  https://stackoverflow.com/questions/51916630/mongodb-mongoose-collection-find-options-deprecation-warning
*/
mongoose.set('useCreateIndex', true);

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
