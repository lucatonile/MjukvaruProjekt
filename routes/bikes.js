/* eslint no-underscore-dangle: 0 */
const express = require('express');

const queries = require('../queries/bikeQueries');
const incLostBikesCounter = require('../queries/userQueries').incLostBikeCounter;
const gcs = require('../tools/gcs');
const imgOptimizer = require('../tools/imgOptimizer');

const router = express.Router();

// As defined in the bike Schema.
const STOLEN_FLAG = 'STOLEN';

router.get('/', (req, res) => {
  res.send('handle db tasks');
});

router.post('/preaddbike/', (req, res) => {
  res.send({
    color: 'green',
    frame: 'sport',
    lamp: true,
    rack: true,
    bikeFound: true,
    basket: false,
  });
});

router.post('/addbike/', (req, res) => {
  let { body } = req;
  const { userId } = req.body;

  if (body.json !== undefined) {
    body = JSON.parse(body.json);
    req.body = body;
    req.body.userId = userId;
  }

  if (req.files !== undefined && req.files !== null) {
    gcs.generateUrlIds((urlResult) => {
      if (urlResult.error) res.send(urlResult);
      else {
        req.body.image_url = process.env.GCS_URL + urlResult.message.img;
        req.body.thumbnail_url = process.env.GCS_URL + urlResult.message.thumbnail;

        queries.addBike(req, res,
          (addResult) => {
            if (req.body.type === STOLEN_FLAG) incLostBikesCounter(req.body.userId);
            // Done uploading bike pic, send response
            res.send(addResult);

            // Behind the hood, optimize image, create thumbnail and upload to GCS
            if (!addResult.error) {
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
                        width: parseInt(process.env.bikeThumbnailWidth, 10),
                        height: parseInt(process.env.bikeThumbnailHeight, 10),
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
    queries.addBike(req, res, (result) => {
      if (result.error) {
        res.send(result.message);
      } else {
        if (req.body.type === STOLEN_FLAG) incLostBikesCounter(req.body.userId);
        res.send(result.message);
      }
    });
  }
});

router.post('/removebike/', (req, res) => {
  queries.removeBike(req, res, (result) => { res.send(result.message); });
});

router.post('/getbike/', (req, res) => {
  queries.getBike(req, res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.get('/getbikes/', (req, res) => {
  queries.getBikes(res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.get('/getmybikes/', (req, res) => {
  queries.getMyBikes(req, res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.get('/getstolenbikes/', (req, res) => {
  queries.getStolenBikes(res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.get('/getfoundbikes/', (req, res) => {
  queries.getFoundBikes(res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/updatebike/', (req, res) => {
  queries.updateBike(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

// Returns bikes having the features specified in the request parameters.
router.post('/filterbikes/', (req, res) => { queries.filterBikes(req, res, (result) => { res.send(result.message); }); });

// TODO: only showing results above a certain threshold of similarity to uploaded bike
router.post('/getmatchingbikes/', (req, res) => {
  queries.getMatchingBikes(req.body, (result) => {
    if (result.error) res.send(result.message);
    else {
      const ids = [];
      for (let i = 0; i < result.message.length; i += 1) { ids.push(result.message[i]._id); }
      queries.getBikesWithIdsOrdered(ids, (result_) => {
        if (result_.error) res.send(result_.error);
        else res.send(result_.message);
      });
    }
  });
});

/*
  Comment section
  TODO break out into separate file.
*/

router.post('/addcomment/', (req, res) => {
  queries.addComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/removecomment/', (req, res) => {
  queries.removeComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/ratecomment/', (req, res) => {
  queries.rateComment(req, res, (result) => {
    res.send(result.message);
  });
});

router.post('/editcomment/', (req, res) => {
  queries.editComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/getcomments/', (req, res) => {
  queries.getComments(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

module.exports = router;
