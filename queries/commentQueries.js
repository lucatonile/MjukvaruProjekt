const commentModel = require('../models/comment');
const cbs = require('../tools/cbs');

function getCommentsForBike(req, res, callback) {
  if (req.body.id === undefined) {
    callback('Bike id not provided!');
  } else if (req.body.id === '') {
    callback('Bike id shouldnt be empty!');
  } else {
    const result = commentModel.Comment.find({ id: req.body.id }).populate('user').populate('bike');
    callback(result);
  }
}

function removeComment(req, res, callback) {
  if (req.body.id === undefined || req.body.id === '') {
    callback(cbs.cbMsg(true, 'Id not provided'));
  } else {
    commentModel.Comment.findOneAndRemove({ id: req.body.id },
      (err) => {
        if (err) cbs.cbMsg(true, err);
        callback(cbs.cbMsg(false, 'Comment removed (or not found!)'));
      });
  }
}

function addComment(req, res, callback) {
  if (req.body.bikeid === undefined || req.body.body === undefined) {
    callback(cbs.cbMsg(true, 'Provide user id, bike id and comment body!'));
  } else {
    // stuff
  }
}

module.exports = {
  getCommentsForBike,
  removeComment,
  addComment,
};
