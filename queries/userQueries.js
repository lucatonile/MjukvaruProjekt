/* eslint-disable array-callback-return */
const userModel = require('../models/user');

function getUserInfoEmail(req, res, callback) {
  userModel.User.find({ email: req.body.email },
    (err, user) => {
      if (err) {
        callback(err);
        throw new Error(err);
      }
      callback(user);
    });
}

function addUser(req, res, callback) {
  const user = new userModel.User({
    username: req.query.username,
    password: req.query.password,
  });

  user.save((err) => {
    if (err) throw new Error(err);
    callback('Success in adding user!');
  });
}

function addUserPost(req, res, callback) {
  const user = new userModel.User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
  });

  user.save((err) => {
    if (err) {
      callback(`Error: ${err}`);
      if (err) throw new Error(err);
    }
    callback('Success in adding user via POST!');
  });
}

function getUsers(data, callback) {
  userModel.User.find((err, users) => {
    if (err) throw new Error(err);
    callback(users);
  });
}

module.exports = {
  addUser,
  addUserPost,
  getUsers,
  getUserInfoEmail,
};
