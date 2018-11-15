/* eslint-disable array-callback-return */
const userModel = require('../models/user');

function getUserInfoEmail(req, res, callback) {
  userModel.User.find({ email: req.body.email },
    (err, user) => {
      if (err) { callback(err); }
      callback(user);
    });
}

function getUsers(data, callback) {
  userModel.User.find((err, users) => {
    if (err) callback(err);
    callback(users);
  });
}

// Returns highscore of users sorted by their descending score.
// POST parameter 'limit' sets the number of users returned.
function getHighscore(req, res, callback) {
  userModel.User.find((err, users) => {
    if (err) throw new Error(err);
    callback(users);
  }).sort({ game_score: -1 }).limit(parseInt(req.body.limit, 10));
}

function removeUser(req, res, callback) {
  if (req.body.email === undefined) {
    callback('Email not provided!');
  } else if (req.body.email === '') {
    callback('Empty email provided!');
  } else {
    userModel.User.findOneAndRemove({ email: req.body.email },
      (err) => {
        if (err) { callback(err); }
        callback('User removed (or not found)!');
      }).remove();
  }
}

module.exports = {
  getUsers,
  getUserInfoEmail,
  getHighscore,
  removeUser,
};
