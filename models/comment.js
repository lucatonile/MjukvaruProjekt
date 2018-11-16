const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
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
    required: true,
  },
});

const commentModel = mongoose.model('Comment', commentSchema, 'comments');

// Use initial uppercase for models (as with a Class object)
module.exports = {
  Comment: commentModel,
};
