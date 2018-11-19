const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

// TODO: update this later
const expireTime = '365d';

function addUserPost(req, res, callback) {
  const user = new userModel.User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
  });

  user.save((err) => {
    if (err) {
      callback(err);
    } else {
      callback(user);
    }
  });
}

function updateToken(req, token, callback) {
  userModel.User.findOneAndUpdate({ email: req.body.email }, { token }, { new: true },
    (err, userInfo) => {
      if (err) callback(err);
      callback(userInfo);
    });
}

function authenticate(req, res, next) {
  if (req.body.email === undefined || req.body.password === undefined) {
    next({ error: true, message: 'Email and/or password not provided!', data: null });
  } else {
    userModel.User.findOne({ email: req.body.email }, (err, userInfo) => {
      if (err) {
        next(err);
      } else if (bcrypt.compareSync(req.body.password, userInfo.password)) {
        const token = jwt.sign({ id: userInfo.id }, req.app.get('secretKey'), { expiresIn: expireTime });

        const userInfoNoPassword = {
          game_score: userInfo.game_score,
          _id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
          phone_number: userInfo.phone_number,
          create_time: userInfo.create_time,
        };
        next({ error: false, message: 'User found!', data: { user: userInfoNoPassword, token } });
      } else {
        next({ error: true, message: 'Invalid email/password!', data: null });
      }
    }).select('+password');
  }
}

// Checks if the provided token is valid.
// If it is correct the user Id is added to the parameter body.
function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), (err, decoded) => {
    if (err) {
      res.json({ status: 'error', message: err.message, data: null });
    } else {
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
}

module.exports = {
  authenticate,
  validateUser,
  addUserPost,
  updateToken,
};
