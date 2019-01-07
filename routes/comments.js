const express = require('express');
const queries = require('../queries/commentQueries');

const router = express.Router();

router.post('/add/', (req, res) => {
  queries.addComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/remove/', (req, res) => {
  queries.removeComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/rate/', (req, res) => {
  queries.rateComment(req, res, (result) => {
    res.send(result.message);
  });
});

router.post('/edit/', (req, res) => {
  queries.editComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/getbikecomments/', (req, res) => {
  queries.getComments(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/getratings/', (req, res) => {
  queries.getCommentRatings(req, (result) => { res.send(result.message); });
});

module.exports = router;
