const express = require('express');
const queries = require('../queries/userQueries');

const router = express.Router();

router.post('/getusers/', (req, res) => {
  queries.getUsersPost(res, (result) => { res.send(result.message); });
});

router.post('/getuserinfoemail/', (req, res) => {
  queries.getUserInfoEmail(req, res, (result) => {
    if (result.error) res.send(result.message);
    res.send(result.message);
  });
});

router.post('/getuserinfo/', (req, res) => {
  queries.getUserInfo(req, res, (result) => {
    console.log('getting user info in router');
    if (result.error) res.send(result.message);
    res.send(result.message);
  });
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
