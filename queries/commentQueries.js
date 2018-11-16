const commentModel = require('../models/comment');

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
module.exports = {
  getCommentsForBike,
};
