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
  testData.clearUsers(req, res, (result) => {
    res.send(`user data cleared: ${JSON.stringify(result)}`);
  });
});

router.get('/clearbikedata/', (req, res) => {
  testData.clearBikes(req, res, (result) => {
    res.send(`Bike data cleared: ${JSON.stringify(result)}`);
  });
});

router.get('/clearcommentdata/', (req, res) => {
  testData.clearComments(req, res, (result) => {
    res.send(`Comment data cleared: ${JSON.stringify(result)}`);
  });
});

router.get('/clearratingdata/', (req, res) => {
  testData.clearRatings(req, res, (result) => {
    res.send(`Rating data cleared: ${JSON.stringify(result)}`);
  });
});

router.get('/clearall/', (req, res) => {
  testData.clearAll(req, res, (result) => {
    res.send(`All data cleared: ${JSON.stringify(result)}`);
  });
});

module.exports = router;
