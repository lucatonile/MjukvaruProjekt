const express = require('express');
const queries = require('../queries/userQueries');

const router = express.Router();

router.get('/getuser/', (req, res) => {
  queries.getUser(req, res, (result) => { res.send(result.message); });
});

router.get('/getallusers/', (req, res) => {
  queries.getAllUsers(req, res, (result) => { res.send(result.message); });
});

router.post('/getuserbyemail/', (req, res) => {
  queries.getUserInfoEmail(req, res, (result) => { res.send(result.message); });
});

router.post('/gethighscores/', (req, res) => {
  queries.getHighscore(req, res, (result) => { res.send(result.message); });
});

router.post('/updatehighscore/', (req, res) => {
  queries.updateHighscore(req, res, (result) => { res.send(result.message); });
});

router.post('/removeuser/', (req, res) => {
  queries.removeUser(req, res, (result) => { res.send(result.message); });
});

router.post('/updateuser/', (req, res) => {
  queries.updateUser(req, res, (result) => { res.send(result.message); });
});

router.post('/setuserlocation/', (req, res) => {
  queries.setUserLocation(req, res, (result) => { res.send(result.message); });
});

router.post('/updateprofilepic/', (req, res) => {
  queries.updateProfilePic(req, res, (result) => { res.send(result.message); });
});

router.post('/resetpassword/', (req, res) => {
  queries.resetPassword(req, res, (result) => { res.send(result); });
});

router.get('/userhasnotifications/', (req, res) => {
  queries.getUser(req, res, (result) => { res.send(result.message.has_notification); });
});

module.exports = router;
