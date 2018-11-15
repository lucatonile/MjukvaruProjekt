const express = require('express');
const queries = require('../queries/authQueries.js');

const router = express.Router();

router.post('/', (req, res) => {
  queries.authenticate(req, res, (result) => {
    res.send(result);
  });
});

router.post('/adduser/', (req, res) => {
  queries.addUserPost(req, res, (result) => {
    res.send(result);
  });
});

module.exports = router;
