const commentModel = require('../models/comment');
const cbs = require('../tools/cbs');
const reverseGeolocation = require('../tools/reverseGeolocation');

function addComment(req, callback) {
  if (req.body.bikeId === undefined) {
    callback(cbs.cbMsg(true, 'bikeId not provided!'));
  } else if (req.body.bikeId === '') {
    callback(cbs.cbMsg(true, 'Empty bikeId provided!'));
  } else {
    const comment = {
      author: req.body.userId,
      bikeId: req.body.bikeId,
      body: req.body.body,
    };

    // If comment is a reply to another comment, set the id of comment it replies to.
    if (req.body.replyCommentId) comment.isReplyToCommentId = req.body.replyCommentId;

    // If lat and long is provided, validate and add it to the comment location.
    if (reverseGeolocation.validateCoordinates(req.body.lat, req.body.long) === 'success') {
      comment.location = {
        lat: req.body.lat,
        long: req.body.long,
      };
    }

    const commentRecord = new commentModel.Comment(comment);
    commentRecord.save((err, result) => {
      if (err) {
        callback(cbs.cbMsg(true, { error: err }));
      } else if (!result) {
        callback(cbs.cbMsg(true, { error: 'no result from save' }));
      } else {
        callback(cbs.cbMsg(false, { message: result }));
      }
    });
  }
}

function removeComment(req, callback) {
  const commentId = req.body.commentId;
  if (!commentId) {
    callback(cbs.cbMsg(true, { error: 'CommentId not provided' }));
  } else {
    commentModel.Comment.remove({ _id: req.body.commentId }, callback, (err) => {
      if (err) {
        callback(true, { error: err });
      } else {
        callback(false, { error: `Comment ${commentId} removed.` });
      }
    });
  }
}

function editComment(req, callback) {
  commentModel.Comment.updateOne(
    {
      _id: req.body.commentId,
      bikeId: req.body.commentId,
      author: req.body.userId,
    },
    {
      $set: { body: req.body.body },
    },
    (error, result) => {
      if (error) callback(cbs.cbMsg(true, { error }));
      else if (result.nModified === 0) callback(cbs.cbMsg(true, { error: 'update failed' }));
      else callback(cbs.cbMsg(false, { message: `Comment ${req.body.commentId} updated.` }));
    },
  );
}

function getComments(req, callback) {
  if (req.body.bikeId === undefined) {
    callback(cbs.cbMsg(true, 'bikeId not provided!'));
  } else if (req.body.bikeId === '') {
    callback(cbs.cbMsg(true, 'Empty bikeId provided!'));
  } else {
    const bikeId = req.body.bikeId;
    commentModel.Comment.find(
      { bikeId },
      (error, result) => {
        if (error) callback(cbs.cbMsg(true, { error }));
        else if (!result) callback(cbs.cbMsg(false, { message: `No results found for ${bikeId}` }));
        else callback(false, { result });
      },
    );
  }
}

function rateCommentAux(req, res, callback) {
  // Check if rating exists. If it does, remove it. If not, add it.
}

// Validate direction input and call auxillary function.
function rateComment(req, res, callback) {
  const validValues = ['UP', 'DOWN'];
  if (req.body.value === undefined) {
    res.status(500).send(cbs.cbMsg(true, 'Value undefined'));
  } else if (validValues.includes(req.body.value)) {
    rateCommentAux(req, res, callback);
  } else {
    res.status(500).send(cbs.cbMsg(true, `Invalid value: ${req.body.value}`));
  }
}

module.exports = {
  addComment,
  editComment,
  removeComment,
  getComments,
  rateComment,
};
