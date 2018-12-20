const commentModel = require('../models/comment');
const ratingModel = require('../models/rating');
const cbs = require('../tools/cbs');
const reverseGeolocation = require('../tools/reverseGeolocation');
const incrBikeCount = require('../tools/commentHelper').incrementBikeCommentCount;

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
        incrBikeCount(req.body.bikeId, 1, callback, result);
      }
    });
  }
}

function removeComment(req, callback) {
  const { commentId } = req.body.commentId;
  if (!commentId) {
    callback(cbs.cbMsg(true, { error: 'CommentId not provided' }));
  } else {
    commentModel.Comment.remove({ _id: req.body.commentId }, callback, (error) => {
      if (error) callback(true, { error });
      else callback(false, { error: `Comment ${commentId} removed.` });
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
  console.log('getting comments');
  if (req.body.bikeId === undefined) {
    callback(cbs.cbMsg(true, { error: 'bikeId not provided!' }));
  } else if (req.body.bikeId === '') {
    callback(cbs.cbMsg(true, { error: 'Empty bikeId provided!' }));
  } else {
    console.log('searching');
    const { bikeId } = req.body.bikeId;
    commentModel.Comment.find(
      { bikeId },
      (error, result) => {
        console.log('handling result');
        console.log(error);
        console.log(result);
        if (error) callback(cbs.cbMsg(true, { error, message: 'Error in comment find call' }));
        else if (!result) callback(cbs.cbMsg(false, { message: `No results found for ${bikeId}` }));
        else callback(false, { result, message: `The resulting comments for bike ${req.body.bikeId}` });
      },
    );
  }
}

function getCommentRatings(req, callback) {
  if (req.body.commentId === undefined || req.body.commentId === '') {
    callback(cbs.cbMsg(true, { error: 'commentId not provided' }));
  } else {
    ratingModel.Model.find(
      { commentId: req.body.commentId },
      (error, result) => {
        if (error) callback(cbs.cbMsg(true, { error }));
        else if (!result) callback(cbs.cbMsg(false, { message: 'No ratings found' }));
        else callback(cbs.cbMsg(false, { result }));
      },
    );
  }
}

function rateCommentAux(req, res, cb) {
  console.log('in rateCommentAux');
  // Check if rating exists. If it does, remove it. If not, add it.
  ratingModel.Rating.findOneAndDelete(
    {
      commentId: req.body.commentId,
      userId: req.body.userId,
    },
    (searchError, searchResult) => {
      console.log('search and deleting');
      if (searchError) {
        cb(cbs.cbMsg(true, { error: searchError, message: 'in search result with error' }));
      } else if (!searchResult) {
        const newRating = new ratingModel.Rating(
          {
            userId: req.body.userId,
            commentId: req.body.commentId,
            bikeId: req.body.bikeId,
          },
        );
        newRating.save((error, result) => {
          if (error) cb(cbs.cbMsg(true, { error }));
          else if (!result) cb(cbs.cbMsg(true, { error: 'no result' }));
          else cb(cbs.cbMsg(false, { result, message: 'a rating was added for this user/comment combo' }));
        });
      } else {
        cb(cbs.cbMsg(false, { message: `Rating by user ${req.body.userId} removed from comment ${req.body.commentId}` }));
      }
    },
  );
}

// TODO: If an UP rating is called when a DOWN rating is in place they should be swapped
// Instead of removed as the current implementation does.

// Validate direction input and call auxillary function.
function rateComment(req, res, callback) {
  console.log('rating comment');
  const validValues = ['UP', 'DOWN'];
  if (req.body.value === undefined) {
    res.status(500).send(cbs.cbMsg(true, { error: 'Value undefined' }));
  } else if (validValues.includes(req.body.value)) {
    console.log('calling rateCommentAux');
    rateCommentAux(req, res, callback);
  } else {
    res.status(500).send(cbs.cbMsg(true, { error: `Invalid value: ${req.body.value}` }));
  }
}

module.exports = {
  addComment,
  getCommentRatings,
  editComment,
  removeComment,
  getComments,
  rateComment,
};
