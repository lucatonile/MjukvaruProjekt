/* eslint-disable array-callback-return */
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const cbs = require('../tools/cbs');

function getUserInfoEmail(req, res, callback) {
  userModel.User.find({ email: req.body.email },
    (err, user) => {
      if (err) { callback(cbs.cbMsg(true, err)); }
      callback(cbs.cbMsg(false, user));
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
    callback(cbs.cbMsg(false, users));
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

function updateUser(req, res, callback) {
  const userId = req.body.id;
  const conditions = {
    _id: userId,
  };

  const update = {
    phone_number: req.body.phone_number,
  };

  // Only call hash function if a password was actually provided in the request.
  if (req.body.password !== undefined) {
    const secretpw = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
    update.password = secretpw;
  }

  userModel.User.findOneAndUpdate(conditions, update, (error, result) => {
    if (error) {
      callback(cbs.cbMsg(true, `Update failed: ${error}`));
    } else {
      callback(cbs.cbMsg(false, result));
    }
  });
}

module.exports = {
  getUsers,
  getUserInfoEmail,
  getHighscore,
  removeUser,
  updateUser,
};
