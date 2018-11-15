/* eslint-disable array-callback-return */
const userModel = require('../models/user');
const cbs = require('../tools/cbs');

function getUserInfoEmail(req, res, callback) {
  userModel.User.find({ email: req.body.email },
    (err, user) => {
      if (err) { callback(cbs.cbMsg(true, err)); }
      cbs.cbMsg(false, user);
    });
}

function getUsers(data, callback) {
  userModel.User.find((err, users) => {
    if (err) callback(cbs.cbMsg(true, err));
    callback(cbs.cbMsg(true, users));
  });
}

// Returns highscore of users sorted by their descending score.
// POST parameter 'limit' sets the number of users returned.
function getHighscore(req, res, callback) {
  userModel.User.find((err, users) => {
    if (err) callback(cbs.cbMsg(true, err));
    cbs.cbMsg(false, users);
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
        if (err) cbs.cbMsg(true, err);
        callback(cbs.cbMsg(false, 'User removed (or not found)!'));
      }).remove();
  }
}

module.exports = {
  getUsers,
  getUserInfoEmail,
  getHighscore,
  removeUser,
};
