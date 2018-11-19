const express = require('express');
const queries = require('../queries/commentQueries');

const router = express.Router();

router.post('/getcommentsforbike/', (req, res) => {
  queries.getCommentsForBike(req, res, (result) => {
    res.send(result);
  });
});

router.post('/remove/', (req, res) => {
  queries.removeComment(req, res, (result) => {
    res.send(result);
  });
});

router.post('/add/', (req, res) => {
  queries.addComment(req, res, (result) => {
    res.send(result);
  });
});

module.exports = router;
