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
      userId: req.body.userId,
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
        callback(cbs.cbMsg(true, { error: err, message: 'error in commentRecord save' }));
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
    commentModel.Comment.find(
      { bikeId: req.body.bikeId },
      (error, result) => {
        console.log('handling result');
        console.log(result);
        if (error) callback(cbs.cbMsg(true, { error, message: 'Error in comment find call' }));
        else if (!result) callback(cbs.cbMsg(false, { message: `No results found for ${req.body.bikeId}` }));
        else console.log('lel'); callback(cbs.cbMsg(false, { result, message: `The resulting comments for bike ${req.body.bikeId}` }));
      },
    );
  }
}

function getCommentRatings(req, callback) {
  if (req.body.commentId === undefined || req.body.commentId === '') {
    callback(cbs.cbMsg(true, { error: 'commentId not provided' }));
  } else {
    ratingModel.Rating.find(
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
  let newDirection = 'UP';
  if (req.body.direction === 'UP') newDirection = 'DOWN';
  // Check if rating exists. If it does, remove it. If not, add it.
  const query = {
    commentId: req.body.commentId,
    userId: req.body.userId,
  };
  const update = {
    $set: { direction: newDirection },
  };

  ratingModel.Rating.findOneAndUpdate(query, update, { new: true }, (error, result) => {
    if (error) {
      cb(cbs.cbMsg(error, { message: 'update error' }));
    } else if (result) {
    } else {
      const newRating = new ratingModel.Rating(
        {
          userId: req.body.userId,
          commentId: req.body.commentId,
          direction: req.body.direction,
        },
      );
      newRating.save((saveError, saveResult) => {
        if (saveError) cb(cbs.cbMsg(true, { saveError, message: 'newRatign save error' }));
        else if (saveResult) cb(cbs.cbMsg(false, { result: saveResult }));
        else cb(cbs.cbMsg(true, { error: 'wtf happend? new Rating save gave undefined result' }));
      });
    }
  });
}

// TODO: If an UP rating is called when a DOWN rating is in place they should be swapped
// Instead of removed as the current implementation does.
// Swap can be done by changing direction value!

// Validate direction input and call auxillary function.
function rateComment(req, res, callback) {
  const validDirections = ['UP', 'DOWN'];
  if (req.body.direction === undefined) {
    res.status(500).send(cbs.cbMsg(true, { error: 'direction parameter undefined' }));
  } else if (validDirections.includes(req.body.direction)) {
    if (!req.body.userId || !req.body.commentId) {
      res.status(500).send(cbs(cbs.cbMsg(true, { error: 'userId or commentId not defined' })));
    } else {
      rateCommentAux(req, res, callback);
    }
  } else {
    res.status(500).send(cbs.cbMsg(true, { error: `Invalid direction: ${req.body.direction}. Should be UP or DOWN.` }));
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
