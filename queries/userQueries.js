/* eslint-disable array-callback-return */
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const cbs = require('../tools/cbs');

// Returns the user document from the DB with the corresponding email provided in the body.
function getUserInfoEmail(req, res, callback) {
  userModel.User.findOne({ email: req.body.email },
    (err, user) => {
      if (err) {
        callback(cbs.cbMsg(true, err));
      } else if (!user) {
        callback(cbs.cbMsg(true, { error: `No user by email: ${req.body.email} found.` }));
      } else {
        callback(cbs.cbMsg(false, user));
      }
    });
}

// Finds the authenticated user making the API call based on their provided token.
function getUser(req, res, callback) {
  userModel.User.findOne({ _id: req.body.userId }, (err, users) => {
    if (err) {
      callback(cbs.cbMsg(true, err));
    } else {
      callback(cbs.cbMsg(false, users));
    }
  });
}

// Returns all user documents in the database.
function getAllUsers(req, res, callback) {
  userModel.User.find((err, users) => {
    if (err) callback(cbs.cbMsg(true, err));
    if (!users || users === [] || users.length === 0) {
      callback(cbs.cbMsg(true, { error: 'No users found!' }));
    } else {
      callback(cbs.cbMsg(false, users));
    }
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

// Deletes the user associated with the provided email field of the body.
function removeUser(req, res, callback) {
  if (req.body.email === undefined) {
    callback(cbs.cbMsg(true, { error: 'Email not provided!' }));
  } else if (req.body.email === '') {
    callback(cbs.cbMsg(true, { error: 'Empty email provided!' }));
  } else {
    userModel.User.findOneAndRemove({ email: req.body.email },
      (err) => {
        if (err) cbs.cbMsg(true, err);
        callback(cbs.cbMsg(false, { message: 'User removed (or not found)!' }));
      }).remove();
  }
}

// General function for updating a user document with the provided paramters.
function updateUser(req, res, callback) {
  const conditions = {
    _id: req.body.userId,
  };

  const update = req.body;
  delete update._id;

  // Only call hash function if a password was actually provided in the request.
  if (req.body.password !== undefined) {
    const secretpw = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
    update.password = secretpw;
  }

  if (req.body.location !== undefined) {
    if (req.body.location === '') {
      // handle empty string
    } else {
      update.location = req.body.location;
    }
  }

  userModel.User.findOneAndUpdate(conditions, update, { new: true }, (error, updatedUserRecord) => {
    if (error) {
      callback(cbs.cbMsg(true, `Update failed: ${error}`));
    } else if (!updatedUserRecord) {
      callback(cbs.cbMsg(true, { error: 'No matching user was found' }));
    } else {
      callback(cbs.cbMsg(false, updatedUserRecord));
    }
  });
}

function setUserLocation(req, res, callback) {
  if (req.body.location === '' || req.body.location === undefined) {
    callback(cbs.cbMsg(true, { error: 'Provide a location!' }));
  }
  const conditions = { _id: req.body.userId };

  // Update defines what fields to be changed in the database document.
  const update = {
    location: req.body.location,
  };

  // This option new: true ensures the updated user document is returned.
  const options = { new: true };

  userModel.User.findOneAndUpdate(conditions, update, options, (error, doc) => {
    console.log(doc.phone_number);
    if (error) {
      callback(cbs.cbMsg(true, error));
    } else if (!doc) {
      callback(cbs.cbMsg(true, { error: 'No document was found' }));
    } else {
      console.log(doc);
      callback(cbs.cbMsg(false, doc));
    }
  });
}

// Finds the authenticated user and sends the user information. Based on provided token.
function getUserInfo(req, res, callback) {
  userModel.User.findOne({ _id: req.body.userId }, (err, users) => {
    if (err) callback(cbs.cbMsg(true, err));
    callback(cbs.cbMsg(false, users));
  });
}

module.exports = {
  getUserInfoEmail,
  getHighscore,
  removeUser,
  updateUser,
  getUser,
  getAllUsers,
  setUserLocation,
  getUserInfo,
};
