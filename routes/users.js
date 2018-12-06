const express = require('express');
const queries = require('../queries/userQueries');
const cbs = require('../tools/cbs');
const gcs = require('../tools/gcs');
const imgOptimizer = require('../tools/imgOptimizer');

const router = express.Router();

router.get('/getuser/', (req, res) => {
  queries.getUser(req, res, (result) => { res.send(result.message); });
});

router.get('/getallusers/', (req, res) => {
  queries.getAllUsers(req, res, (result) => { res.send(result.message); });
});

router.post('/getuserbyemail/', (req, res) => {
  queries.getUserInfoEmail(req, res, (result) => { res.send(result.message); });
});

router.post('/gethighscores/', (req, res) => {
  queries.getHighscore(req, res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/updatehighscore/', (req, res) => {
  queries.updateHighscore(req, res, (result) => { res.send(result.message); });
});

router.post('/removeuser/', (req, res) => {
  queries.removeUser(req, res, (result) => { res.send(result.message); });
});

router.post('/updateuser/', (req, res) => {
  queries.updateUser(req, res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/setuserlocation/', (req, res) => {
  queries.setUserLocation(req, res, (result) => { res.send(result.message); });
});

router.post('/updateprofilepic/', (req, res) => {
  if (req.files !== undefined && req.files !== null) {
    gcs.uploadImage({ req }, (result) => {
      if (result.error) res.send(result);
      else {
        const imageUrl = process.env.GCS_URL + result.message;

        queries.updateProfilePic(req.body.userId, imageUrl, (result_) => {
          // Done uploading profile pic, send response
          res.send(result_);

          // Behind the hood, optimize image and replace old image with optimized
          imgOptimizer.minimize(req.files.image.data, (miniImg) => {
            if (miniImg) {
              req.files.image.data = miniImg;
              gcs.uploadImage({ req, name: result.message }, () => {});
            }
          });
        });
      }
    });
  } else {
    res.send(cbs.cbMsg(true, 'No image found!'));
  }
});

router.post('/resetpassword/', (req, res) => {
  queries.resetPassword(req, res, (result) => {
    res.send(result);
  });
});
module.exports = router;
