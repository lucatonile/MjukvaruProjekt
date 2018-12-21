const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bikeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bike',
    required: true,
  },
  isReplyToCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  location: {
    lat: Number,
    long: Number,
  },
  body: {
    type: String,
    required: true,
    trime: true,
  },
});

// Always attach `populate()` to `find()` calls
commentSchema.pre('find', function populateSubmitter() {
  this.populate('author bikeId isReplyToCommentId');
});

const commentModel = mongoose.model('Comment', commentSchema, 'comments');

// Use initial uppercase for models (as with a Class object)
module.exports = {
  Comment: commentModel,
};
