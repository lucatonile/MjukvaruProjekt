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
    gcs.generateUrlIds((urlResult) => {
      if (urlResult.error) res.send(urlResult);
      else {
        const imageUrl = process.env.GCS_URL + urlResult.message.img;
        const thumbnailUrl = process.env.GCS_URL + urlResult.message.thumbnail;

        queries.updateProfilePic(req.body.userId, { img: imageUrl, thumbnail: thumbnailUrl },
          (updateResult) => {
            // Done uploading profile pic, send response
            res.send(updateResult);

            // Behind the hood, optimize image, create thumbnail and upload to GCS
            if (!updateResult.error) {
              imgOptimizer.minimize(req.files.image.data, (minResult) => {
                if (minResult.error) {
                  // handle minResult error
                } else {
                  req.files.image.data = minResult.message;
                  gcs.uploadImage(
                    {
                      req,
                      imgName: urlResult.message.img,
                      thumbnail: {
                        name: urlResult.message.thumbnail,
                        width: parseInt(process.env.USER_THUMBNAIL_WIDTH, 10),
                        height: parseInt(process.env.USER_THUMBNAIL_HEIGHT, 10),
                      },
                    },
                    (uploadResult) => {
                      // handle uploadResult error
                    },
                  );
                }
              });
            }
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
