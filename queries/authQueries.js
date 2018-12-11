const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const cb = require('../tools/cbs');

// TODO: update this later
const expireTime = '365d';

function addUserPost(req, res, callback) {
  const user = new userModel.User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
    location: req.body.location,
  });

  user.save((err) => {
    if (err) {
      callback(cb.cbMsg(true, err));
    } else {
      callback(cb.cbMsg(false, { message: `User ${req.body.username} added!` }));
    }
  });
}

function authenticate(req, res, next) {
  if (req.body.email === undefined || req.body.password === undefined) {
    res.json({ status: 'error', message: 'Email and/or password not provided!', data: null });
  } else {
    userModel.User.findOne({ email: req.body.email }, (err, userInfo) => {
      if (err) {
        next(err);
      } else if (!userInfo || !userInfo.password) {
        next({ error: 'No user with that email exists' });
      } else if (!req.body.password) {
        next({ error: 'Provided a password!' });
      } else if (bcrypt.compareSync(req.body.password, userInfo.password)) {
        const token = jwt.sign(
          { id: userInfo.id },
          process.env.SECRET_KEY,
          { expiresIn: expireTime },
        );

        // Return user but without password field.
        const userInfoNoPassword = userInfo;
        delete userInfoNoPassword.password;

        res.json({ status: 'success', message: 'User found!', data: { user: userInfoNoPassword, token } });
      } else {
        res.json({ status: 'error', message: 'Invalid email/password!', data: null });
      }
    }).select('+password');
  }
}

// Checks if the provided token is valid.
// If it is correct the user Id is added to the parameter body.
function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY, (err, decoded) => {
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
};
