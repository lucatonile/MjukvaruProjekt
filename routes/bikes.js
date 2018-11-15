const express = require('express');
const queries = require('../queries/bikeQueries');

const router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
  res.send('handle db tasks');
});

router.get('/addbike/', (req) => {
  queries.addBike(req, () => {
  });
});

router.get('/removebike/', (req, res) => {
  res.send('remove bike from db');
});

router.get('/getbikes/', (req, res) => {
  queries.getBikes(res, (result) => {
    res.send(result);
  });
});

router.post('/getbikes/', (req, res) => {
  queries.getBikes(res, (result) => {
    res.send(result);
  });
});

router.get('/getstolenbikes/', (req, res) => {
  queries.getStolenBikes(res, (result) => {
    res.send(result);
  });
});

router.get('/getfoundbikes/', (req, res) => {
  queries.getFoundBikes(res, (result) => {
    res.send(result);
  });
});


module.exports = router;
