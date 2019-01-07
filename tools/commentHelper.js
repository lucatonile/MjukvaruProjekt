const bikeModel = require('../models/bike');
const cbs = require('../tools/cbs');

function incrementBikeCommentCount(bikeId, value, cb, res) {
  bikeModel.Bike.findOneAndUpdate(
    {
      _id: bikeId,
    },
    {
      $inc: { commentCount: value },
    },
    (error, result) => {
      if (error) cb(cbs.cbMsg(true, { error }));
      else if (!result) cb(cbs.cbMsg(true, { error: 'no result from search in incr bike comment' }));
      else cb(cbs.cbMsg(false, { result: res }));
    },
  );
}

module.exports = {
  incrementBikeCommentCount,
};
