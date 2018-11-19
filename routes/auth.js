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
    queries.authenticate(req, res, (result_) => {
      if (result_.error) res.send(result_.message);
      else {
        // set generated token to user in request
        queries.updateToken(req, result_.data.token, (result__) => {
          res.end(result__);
        });
      }
    });
    res.send(result);
  });
});


module.exports = router;
