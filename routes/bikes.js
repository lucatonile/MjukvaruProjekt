const express = require('express');
const queries = require('../queries/bikeQueries');
const gcs = require('../tools/gcs');
const cbs = require('../tools/cbs');

const router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
  res.send('handle db tasks');
});

router.post('/addbike/', (req, res) => {
  const data = req.body;
  data.submitter = '5bed5b29e44a970ab4d42254';
  data.brand = 'crescent';
  data.type = 'STOLEN';

  if (req.files !== undefined) {
    gcs.uploadImage(req, (result) => {
      if (result.error) {
        res.send(result.message);
      }
      data.image_url = process.env.GCS_URL+result.message;

      queries.addBike(data, (result_) => {
        if (result_.error) res.send(result_.message);
        res.send(result_.message);
      });
    });
  } else {
    queries.addBike(data, (result) => {
      if (result.error) res.send(result.message);
      res.send(result.message);
    });
  }
});

router.get('/removebike/', (req, res) => {
  res.send('remove bike from db');
});

router.get('/getbikes/', (req, res) => {
  queries.getBikes(res, (result) => {
    if (result.error) res.send(result.message);
    res.send(result.message);
  });
});

router.get('/getstolenbikes/', (req, res) => {
  queries.getStolenBikes(res, (result) => {
    if (result.error)  res.send(result.message);
    res.send(result.message);
  });
});

router.get('/getfoundbikes/', (req, res) => {
  queries.getFoundBikes(res, (result) => {
    if (result.error)  res.send(result.message);
    res.send(result.message);
  });
});


module.exports = router;
