const mongoose = require('mongoose');

/* Rating model */

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  direction: {
    type: String,
    enum: ['UP', 'DOWN'],
  },
});

// Always attach `populate()` to `find()` calls
ratingSchema.pre('find', function populateSubmitter() {
  this.populate('userId');
});

const ratingModel = mongoose.model('Rating', ratingSchema, 'ratings');

// Use initial uppercase for models (as with a Class object)
module.exports = {
  Rating: ratingModel,
};
