const express = require('express');
const queries = require('../queries/userQueries');

const router = express.Router();

router.get('/getusers/', (req, res) => {
  queries.getUsers(res, (result) => {
    res.send(result);
  });
});

router.post('/getuserinfoemail/', (req, res) => {
  queries.getUserInfoEmail(req, res, (result) => {
    res.send(result);
  });
});

router.post('/gethighscores/', (req, res) => {
  queries.getHighscore(req, res, (result) => {
    res.send(result);
  });
});

router.post('/removeuser/', (req, res) => {
  queries.removeUser(req, res, (result) => {
    res.send(result);
  });
});

module.exports = router;
