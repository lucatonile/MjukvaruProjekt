/* eslint no-underscore-dangle: 0 */
const express = require('express');
const queries = require('../queries/bikeQueries');
const gcs = require('../tools/gcs');

const router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
  res.send('handle db tasks');
});

router.post('/addbike/', (req, res) => {
  const data = req.body;

  if (req.files !== undefined && req.files !== null) {
    gcs.uploadImage(req, (result) => {
      if (result.error) res.send(result.message);
      else {
        data.image_url = process.env.GCS_URL + result.message;

        queries.addBike(data, (result_) => {
          if (result_.error) res.send(result_.message);
          else res.send(result_.message);
        });
      }
    });
  } else {
    queries.addBike(data, (result) => {
      if (result.error) res.send(result.message);
      else res.send(result.message);
    });
  }
});

router.post('/removebike/', (req, res) => {
  queries.removeBike(req, res, (result) => { res.send(result.message); });
});

router.get('/getbikes/', (req, res) => {
  queries.getBikes(res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

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

router.post('/editcomment/', (req, res) => {
  queries.editComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.get('/getcomments/', (req, res) => {
  queries.getComments(req, (result) => {
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

// TODO: only showing results above a certain threshold of similarity to uploaded bike
router.get('/getmatchingbikes/', (req, res) => {
  queries.getMatchingBikes(req.body, (result) => {
    if (result.error) res.send(result.message);
    const ids = [];
    for (let i = 0; i < result.message.length; i += 1) {
      ids.push(result.message[i]._id);
    }
    queries.getBikesWithIdsOrdered(ids, (result_) => {
      if (result_.error) res.send(result_.error);
      else res.send(result_.message);
    });
  });
});
module.exports = router;
