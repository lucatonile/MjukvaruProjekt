const express = require('express');
const testData = require('../tools/testDataHandler');

const router = express.Router();

router.post('/addbiketestdata/', (req, res) => {
  testData.insertBikeData(req.body.count);
  res.send(`${req.body.count} users added`);
});

router.post('/addusertestdata/', (req, res) => {
  testData.insertUserData(req.body.count);
  res.send(`${req.body.count} bikes added`);
});

router.get('/clearuserdata/', (req, res) => {
  testData.clearUserData(req, res, (result) => {
    res.send(`user data cleared: ${JSON.stringify(result)}`);
  });
});

router.get('/clearbikedata/', (req, res) => {
  testData.clearBikeData(req, res, (result) => {
    res.send(`Bike data cleared: ${JSON.stringify(result)}`);
  });
});

module.exports = router;
