var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    create_time: Date,
    phone_number: Number,
    game_score: Number,
    created_date: {
      type: Date,
      default: Date.now
    },
});

mongoose.model('users', userSchema);
