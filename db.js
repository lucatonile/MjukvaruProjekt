var mongoose = require('mongoose');

var mongoDB = 'mongodb://heroku_s6frx9gr:72tejkhqkoq8r9pn9kqbkquid0@ds063879.mlab.com:63879/heroku_s6frx9gr';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;