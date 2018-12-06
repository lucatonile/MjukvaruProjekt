/* eslint-disable array-callback-return */
const bcrypt = require('bcryptjs');
const randomString = require('randomstring');
const nodeMailer = require('nodemailer');
const userModel = require('../models/user');
const cbs = require('../tools/cbs');
const gcs = require('../tools/gcs');

const DECIMAL_FLAG = 10;
const DESCENDING_FLAG = -1;

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
// Parameters location sets the geographical scope of the search.
function getHighscore(req, res, callback) {
  if (req.body.location) {
    userModel.User.find({ location: req.body.location }, (err, users) => {
      if (err) callback(cbs.cbMsg(true, err));
      else callback(cbs.cbMsg(false, users));
    }).sort({ 'game_score.total_score': DESCENDING_FLAG }).limit(parseInt(req.body.limit, DECIMAL_FLAG));
  } else {
    userModel.User.find((err, users) => {
      if (err) callback(cbs.cbMsg(true, err));
      else callback(cbs.cbMsg(false, users));
    }).sort({ 'game_score.total_score': DESCENDING_FLAG }).limit(parseInt(req.body.limit, DECIMAL_FLAG));
  }
}

// Increments thumb, bike and total score if they are provided.
function updateHighscore(req, res, callback) {
  let bikeScore = 0;
  let thumbScore = 0;
  let totalScore = 0;

  if (req.body.thumb_score !== undefined) thumbScore = JSON.parse(req.body.thumb_score);
  if (req.body.bike_score !== undefined) bikeScore = JSON.parse(req.body.bike_score);

  // if bike or thumb score arent provided they are 0 and doesn't change totalScore (that start=0)
  totalScore += (bikeScore + thumbScore);

  userModel.User.findOneAndUpdate(
    { username: req.body.user_name },
    {
      $inc: {
        'game_score.thumb_score': thumbScore,
        'game_score.bike_score': bikeScore,
        'game_score.total_score': totalScore,
      },
    },
    { new: true },
    (err, user) => {
      if (err) callback(cbs.cbMsg(true, err));
      else if (!user) callback(cbs.cbMsg(true, 'No user by that Id found'));
      else callback(cbs.cbMsg(false, user));
    },
  );
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
  // eslint-disable-next-line no-underscore-dangle
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
    if (error) {
      callback(cbs.cbMsg(true, error));
    } else if (!doc) {
      callback(cbs.cbMsg(true, { error: 'No document was found' }));
    } else {
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

function incLostBikeCounter(userId) {
  userModel.User.findOneAndUpdate(
    { _id: userId },
    { $inc: { 'game_score.bikes_lost': 1 } },
    { new: true },
    (err, user) => {
      if (err) return err;
      return user;
    },
  );
}

function updateProfilePic(userId, imageUrl, callback) {
  userModel.User.findOneAndUpdate(
    { _id: userId },
    { avatar_url: imageUrl },
    { new: true, projection: { avatar_url: 1 } },
    (err, user) => {
      if (err) callback(cbs.cbMsg(true, err));
      else callback(cbs.cbMsg(false, user));
    },
  );
}

function resetPassword(req, res, callback) {
  const pw = randomString.generate({
    length: 32,
    charset: 'abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ!#&/()_,.:;<>?£$@*^~12345678910',
  });

  req.body.password = pw;

  // Verify username/mail
  userModel.User.find(
    {
      $or: [{ username: req.body.email_username }, { email: req.body.email_username }],
    },
    (err, users) => {
      if (err) res.send(err);
      else if (users.length === 0) callback(cbs.cbMsg(true, 'Username/Email not found'));
      else {
        // Update user password to the new one and send it to their mail
        updateUser(req, res, (result) => {
          const { email } = result.message;

          const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          const emailMessage = {
            from: 'support@bikeini.com',
            to: email,
            subject: 'New Password',
            text: `Your new password is: ${pw}`,
          };

          transporter.sendMail(emailMessage, (error) => {
            if (error) {
              callback(cbs.cbMsg(true, `Something went wrong when sending your new password to ${email}`));
            } else {
              callback(cbs.cbMsg(false, `An email containing your new password was sent to ${email}`));
            }
          });
        });
      }
    },
  );

  
}

module.exports = {
  getUserInfoEmail,
  getHighscore,
  updateHighscore,
  removeUser,
  updateUser,
  getUser,
  getAllUsers,
  setUserLocation,
  getUserInfo,
  incLostBikeCounter,
  updateProfilePic,
  resetPassword,
};
