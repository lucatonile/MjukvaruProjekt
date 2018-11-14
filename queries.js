/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const models = require('./models.js');

function addBike(data, callback) {
  const bike = new models.Bike({ brand: 'nike', color: 'red' });

  bike.save((err) => {
    if (err) throw new Error(err);
    callback('Success in adding bike!');
  });
}

function getBikes(data, callback) {
  models.Bike.find((err, bikes) => {
    if (err) throw new Error(err);
    callback(bikes);
  }).populate('submitter');
}

function getStolenBikes(data, callback) {
  models.Bike.find({ type: 'STOLEN', active: true },
    (err, bikes) => {
      if (err) {
        callback(err);
        if (err) throw new Error(err);
      }
      callback(bikes);
    }).populate('submitter').populate('comments.author');
}

function getFoundBikes(data, callback) {
  models.Bike.find({ type: 'FOUND', active: true },
    (err, bikes) => {
      if (err) {
        callback(err);
        if (err) throw new Error(err);
      }
      callback(bikes);
    }).populate('submitter');
}

function getUserInfoEmail(req, res, callback) {
  models.User.find({ email: req.body.email },
    (err, user) => {
      if (err) {
        callback(err);
        throw new Error(err);
      }
      callback(user);
    });
}

function addUser(req, res, callback) {
  const user = new models.User({
    username: req.query.username,
    password: req.query.password,
  });

  user.save((err) => {
    if (err) throw new Error(err);
    callback('Success in adding user!');
  });
}

function addUserPost(req, res, callback) {
  const user = new models.User({
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
  models.User.find((err, users) => {
    if (err) throw new Error(err);
    callback(users);
  });
}

module.exports = {
  addBike,
  addUser,
  addUserPost,

  getBikes,
  getStolenBikes,
  getFoundBikes,
  getUsers,
  getUserInfoEmail,
};
