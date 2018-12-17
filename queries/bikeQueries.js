/* eslint-disable array-callback-return */
/* eslint no-underscore-dangle: 0 */
const bikeModel = require('../models/bike');
const cbs = require('../tools/cbs');
const reverseGeolocation = require('../tools/reverseGeolocation');

// Limit for getMatchingBikes results shown
const matchLimit = 5;

function addBike(req, res, callback) {
  // Model requires submitter Id
  const bikeData = req.body;
  bikeData.submitter = req.body.userId;
  bikeData.image_url = {
    img: req.body.image_url,
    thumbnail: req.body.thumbnail_url,
  };
  const locations = reverseGeolocation.getLocation(req.body.lat, req.body.long);

  if (locations.error !== undefined) {
    callback(cbs.cbMsg(true, locations.error));
    res.status(400).send();
  } else {
    bikeData.location = {
      lat: req.body.lat,
      long: req.body.long,
      city: locations.city,
      neighborhood: locations.neighborhood,
      street: locations.street,
    };

    const bike = new bikeModel.Bike(bikeData);

    bike.save((err, result) => {
      if (err) {
        callback(cbs.cbMsg(true, err));
      } else {
        callback(cbs.cbMsg(false, {
          message: 'Success in adding bike',
          bikeId: result._id,
          bike: result,
        }));
      }
    });
  }
}

function updateBike(req, callback) {
  if (req.body.type !== undefined && (req.body.type !== 'FOUND' && req.body.type !== 'STOLEN')) {
    callback(cbs.cbMsg(true, 'type must be specified as either STOLEN or FOUND'));
  } else {
    bikeModel.Bike.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }, (err, bike) => {
      if (err) callback(cbs.cbMsg(true, err));
      else if (bike === null) callback(cbs.cbMsg(false, `bike with id ${req.body.id} was not found in the db!`));
      else callback(cbs.cbMsg(false, bike));
    });
  }
}

function getBikesWithIdsOrdered(ids, callback) {
  const query = [
    { $match: { _id: { $in: ids } } },
    { $addFields: { __ids: { $indexOfArray: [ids, '$_id'] } } },
    { $sort: { __ids: 1 } },
    { $project: { __ids: 0 } },
  ];

  bikeModel.Bike.aggregate(query, (err, bikes) => {
    if (err) {
      callback(cbs.cbMsg(true, err));
    } else {
      bikeModel.Bike.populate(bikes, 'submitter', (err1, populatedBikes) => {
        if (err1) callback(cbs.cbMsg(true, err1));
        else callback(cbs.cbMsg(false, populatedBikes));
      });
    }
  });
}

// Return a bike with the provided bikeId.
function getBike(req, res, callback) {
  bikeModel.Bike.findOne({ _id: req.body.bikeId }, (err, bike) => {
    if (err) callback(cbs.cbMsg(true, err));
    else if (!bike) callback(cbs.cbMsg(false, 'Bike not found'));
    else callback(cbs.cbMsg(false, bike));
  });
}

function getBikes(data, callback) {
  bikeModel.Bike.find((err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  });
}

function getMyBikes(req, res, callback) {
  bikeModel.Bike.find({ submitter: req.body.userId }, (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  });
}

function getStolenBikes(data, callback) {
  bikeModel.Bike.find({ type: 'STOLEN', active: true }, (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  });
}

function getFoundBikes(data, callback) {
  bikeModel.Bike.find({ type: 'FOUND', active: true },
    (err, bikes) => {
      if (err) callback(cbs.cbMsg(true, err));
      else callback(cbs.cbMsg(false, bikes));
    });
}

function getMatchingBikes(data, callback) {
  let type_ = '';
  if (data.type === 'FOUND') type_ = 'STOLEN';
  else if (data.type === 'STOLEN') type_ = 'FOUND';
  else callback(cbs.cbMsg(true, 'bike must be specified as either STOLEN or FOUND'));

  bikeModel.Bike.aggregate([
    {
      $match: {
        $and: [
          {
            type: type_,
          },
          {
            $or: [
              { brand: data.brand },
              { model: data.model },
              { color: data.color },
              { 'keywords.frame_type': data['keywords.frame_type'] === 'true' },
              { 'keywords.sport': data['keywords.sport'] === 'true' },
              { 'keywords.tandem': data['keywords.tandem'] === 'true' },
              { 'keywords.basket': data['keywords.basket'] === 'true' },
              { 'keywords.rack': data['keywords.rack'] === 'true' },
              { 'keywords.mudguard': data['keywords.mudguard'] === 'true' },
              { 'keywords.chain_protection': data['keywords.chain_protection'] === 'true' },
              { 'keywords.net': data['keywords.net'] === 'true' },
              { 'keywords.winter_tires': data['keywords.winter_tires'] === 'true' },
              { 'keywords.light': data['keywords.light'] === 'true' },
              { frame_number: data.frame_number },
              { antitheft_code: data.antitheft_code },
            ],
          },
        ],
      },
    },
    {
      $project: {
        brand_: { $cond: [{ $eq: ['$brand', data.brand] }, 1, 0] },
        model_: { $cond: [{ $eq: ['$model', data.model] }, 1, 0] },
        color_: { $cond: [{ $eq: ['$color', data.color] }, 1, 0] },
        frame_type_: { $cond: [{ $eq: ['$keywords.frame_type', data['keywords.frame_type'] === 'true'] }, 1, 0] },
        sport_: { $cond: [{ $eq: ['$keywords.sport', data['keywords.sport'] === 'true'] }, 1, 0] },
        tandem_: { $cond: [{ $eq: ['$keywords.tandem', data['keywords.tandem'] === 'true'] }, 1, 0] },
        basket_: { $cond: [{ $eq: ['$keywords.basket', data['keywords.basket'] === 'true'] }, 1, 0] },
        rack_: { $cond: [{ $eq: ['$keywords.rack', data['keywords.rack'] === 'true'] }, 1, 0] },
        mudguard_: { $cond: [{ $eq: ['$keywords.mudguard', data['keywords.mudguard'] === 'true'] }, 1, 0] },
        cp_: { $cond: [{ $eq: ['$keywords.chain_protection', data['keywords.chain_protection'] === 'true'] }, 1, 0] },
        net_: { $cond: [{ $eq: ['$keywords.net', data['keywords.net'] === 'true'] }, 1, 0] },
        wt_: { $cond: [{ $eq: ['$keywords.winter_tires', data['keywords.winter_tires'] === 'true'] }, 1, 0] },
        light_: { $cond: [{ $eq: ['$keywords.light', data['keywords.light'] === 'true'] }, 1, 0] },
        // frame/antitheft number give extra high score
        fn_: { $cond: [{ $eq: ['$frame_number', data.frame_number] }, 10, 0] },
        ac_: { $cond: [{ $eq: ['$antitheft_code', data.antitheft_code] }, 10, 0] },
      },
    },
    {
      $project: {
        total: ['$brand_', '$model_', '$color_', '$frame_type_', '$sport_', '$tandem_',
          '$basket_', '$rack_', '$mudguard_', '$cp_', '$net_', '$wt_', '$light_', '$fc_', '$ac_'],
      },
    },
    {
      $project: {
        score: { $sum: '$total' },
      },
    },
    {
      $sort: {
        score: -1,
      },
    },
    {
      $limit: matchLimit,
    },
  ], (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  });
}

function removeBike(req, res, callback) {
  if (req.body.bikeId === undefined) {
    callback(cbs.cbMsg(true, { error: 'bikeId not provided!' }));
  } else if (req.body.bikeId === '') {
    callback(cbs.cbMsg(true, { error: 'Empty bikeId provided!' }));
  } else {
    bikeModel.Bike.findOneAndRemove({ _id: req.body.bikeId },
      (err) => {
        if (err) cbs.cbMsg(true, err);
        callback(cbs.cbMsg(false, { message: 'Bike removed (or not found)!' }));
      }).remove();
  }
}

// Search for bikes in bikeModel with features matching the parameters provided by the caller.
function filterBikes(req, res, callback) {
  if (req.body === undefined) { callback(cbs.cbMsg(true, 'Req.body undefined!')); }
  delete req.body.userId;

  bikeModel.Bike.find(req.body, (err, result) => {
    if (err) cbs.cbMsg(true, err);
    else if (result === null) callback(cbs.cbMsg(false, 'Nothing found!'));
    else res.send(cbs.cbMsg(false, result));
  });
}

/*
  Comment section
  TODO break this out to a separate file.
*/

function addComment(req, callback) {
  if (req.body.bikeId === undefined) {
    callback(cbs.cbMsg(true, 'bikeId not provided!'));
  } else if (req.body.bikeId === '') {
    callback(cbs.cbMsg(true, 'Empty bikeId provided!'));
  } else {
    const comment = {
      author: req.body.userId,
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

    bikeModel.Bike.findOneAndUpdate({ _id: req.body.bikeId }, { $push: { comments: comment } },
      { upsert: false, new: true }, (err, result) => {
        if (err) callback(cbs.cbMsg(true, err));
        else if (result === null) callback(cbs.cbMsg(true, 'Bike was not found in the database!'));
        else callback(cbs.cbMsg(false, result.comments[result.comments.length - 1]));
      });
  }
}

function removeComment(req, callback) {
  bikeModel.Bike.updateOne(
    { _id: req.body.bikeId },
    { $pull: { comments: { _id: req.body.commentId } } }, (err, result) => {
      if (err) callback(cbs.cbMsg(true, err));
      else if (result.nModified === 0) callback(cbs.cbMsg(true, 'Comment was not removed! Perhaps a non existant bike/comment id was given'));
      else callback(cbs.cbMsg(false, 'Removed comment!'));
    },
  );
}

function editComment(req, callback) {
  bikeModel.Bike.updateOne(
    {
      _id: req.body.bikeId,
      'comments._id': req.body.commentId,
    },
    {
      $set: {
        'comments.$.body': req.body.body,
      },
    }, (err, result) => {
      if (err) callback(cbs.cbMsg(true, err));
      else if (result.nModified === 0) callback(cbs.cbMsg(true, 'No changes made! Perhaps a non existant bike/comment id was given'));
      else callback(cbs.cbMsg(false, 'Edited comment!'));
    },
  );
}

// Remove the rating specified by upOrDown from user userId on comment commentId.
function removeRatingAux(commentId, userId, cb, upOrDown) {
  const queryPath = `comments.rating.${upOrDown}.userId`;
  const pullPath = `comments.$.rating.${upOrDown}`;
  bikeModel.Bike.updateOne(
    {
      'comments._id': commentId,
      [queryPath]: userId,
    },
    { $pull: { [pullPath]: { userId } } },
    (err) => {
      if (err) {
        cb(cbs.cbMsg(false, err));
      } else {
        cb(cbs.cbMsg(true, `${upOrDown}-vote removed!`));
      }
    },
  );
}

// If no rating of given value (up or donw) is cast, add it. Otherwise remove the existing rating.
function rateCommentAux(req, res, cb) {
  const findUpdateQueryPath = `comments.rating.${req.body.value}.userId`;
  const findUpdatePushPath = `comments.$.rating.${req.body.value}`;

  bikeModel.Bike.findOneAndUpdate(
    {
      'comments._id': req.body.commentId,
      [findUpdateQueryPath]: { $ne: req.body.userId },
    },
    { $push: { [findUpdatePushPath]: { userId: req.body.userId } } },
    { new: true },
    (err, result) => {
      if (err) {
        cb(cbs.cbMsg(true, err));
      } else if (result === null) {
        // Couldnt add vote because it was already there.
        // Instead call function to remove vote.
        removeRatingAux(req.body.commentId, req.body.userId, cb, req.body.value);
      } else {
        // Downvote was added. Returning the bike object.
        cb(cbs.cbMsg(false, result));
      }
    },
  ).populate('_id');
}

// Validate direction input and call auxillary function.
function rateComment(req, res, callback) {
  const validValues = ['up', 'down'];
  if (req.body.value === undefined) {
    res.status(500).send(cbs.cbMsg(true, 'Value undefined'));
  } else if (validValues.includes(req.body.value)) {
    rateCommentAux(req, res, callback);
  } else {
    res.status(500).send(cbs.cbMsg(true, `Invalid value: ${req.body.value}`));
  }
}

function getComments(req, callback) {
  if (req.body.bikeId === undefined) {
    callback(cbs.cbMsg(true, 'bikeId not provided!'));
  } else if (req.body.bikeId === '') {
    callback(cbs.cbMsg(true, 'Empty bikeId provided!'));
  } else {
    bikeModel.Bike.findOne({ _id: req.body.bikeId }, { comments: 1 },
      (err, result) => {
        if (err) cbs.cbMsg(true, err);
        else if (result === null) callback(cbs.cbMsg(false, 'Bike was not found in database!'));
        else if (result.comments === undefined || result.comments === null) {
          callback(cbs.cbMsg(false, 'No comments for this bike'));
        } else {
          callback(cbs.cbMsg(false, result.comments));
        }
      }).populate('comments.author');
  }
}

module.exports = {
  addBike,
  removeBike,
  updateBike,
  getBike,
  getBikes,
  getMyBikes,
  getBikesWithIdsOrdered,
  getStolenBikes,
  getFoundBikes,
  getMatchingBikes,
  addComment,
  editComment,
  removeComment,
  getComments,
  rateComment,
  filterBikes,
};
