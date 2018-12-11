/* eslint no-underscore-dangle: 0 */
const express = require('express');
const queries = require('../queries/bikeQueries');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('handle db tasks');
});

// adds dummy data
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
  queries.addBike(req, res, (result) => { res.send(result.message); });
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
