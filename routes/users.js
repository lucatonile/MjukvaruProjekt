const express = require('express');
const queries = require('../queries/userQueries');

const router = express.Router();

router.get('/getuser/', (req, res) => {
  queries.getUser(req, res, (result) => { res.send(result.message); });
});

router.post('/getuserbyemail/', (req, res) => {
  queries.getUserInfoEmail(req, res, (result) => { res.send(result.message); });
});

router.post('/gethighscores/', (req, res) => {
  queries.getHighscore(req, res, (result) => {
    if (result.error) res.send(result.message);
    res.send(result.message);
  });
});

router.post('/removeuser/', (req, res) => {
  queries.removeUser(req, res, (result) => { res.send(result.message); });
});

router.post('/updateuser/', (req, res) => {
  queries.updateUser(req, res, (result) => {
    if (result.error) res.send(result.message);
    res.send(result.message);
  });
});

router.post('/setuserlocation/', (req, res) => {
  queries.setUserLocation(req, res, (result) => { res.send(result.message); });
});

module.exports = router;
