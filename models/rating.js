const mongoose = require('mongoose');

/* Rating model */

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
  direction: {
    type: String,
    enum: ['UP', 'DOWN'],
  },
});

// Always attach `populate()` to `find()` calls
ratingSchema.pre('find', function populateSubmitter() {
  this.populate('userId commentId');
});

// A user can only rate each comment once.
// Hence the combination of user and comment id is required to be unique.
ratingSchema.index({ userId: 1, commentId: 1 }, { unique: true });

const ratingModel = mongoose.model('Rating', ratingSchema, 'ratings');

// Use initial uppercase for models (as with a Class object)
module.exports = {
  Rating: ratingModel,
};
