const express = require('express');
// const db = require('../db.js');
// TODO DB unreachable if this is removed even though lint says unused? WTF!
const queries = require('../queries.js');

const router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
  res.send('handle db tasks');
});

router.get('/addbike/', (req) => {
  queries.addBike(req, (result) => {
    console.log(result);
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

router.get('/adduser/', (req, res) => {
  queries.addUser(req, res, (result) => {
    res.send(result);
  });
});

router.post('/adduser/', (req, res) => {
  queries.addUserPost(req, res, (result) => {
    res.send(result);
  });
});

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

module.exports = router;
