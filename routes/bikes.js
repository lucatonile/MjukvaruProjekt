/* eslint no-underscore-dangle: 0 */
const express = require('express');
/* const { spawn } = require('child_process');
const path = require('path');
*/

// const py = spawn('python', ['-u', path.join(__dirname, '../bfr', 'test.py')]);
// py.stdout.pipe(py.stdin, { end: false });
// py.stdin.pipe(py.stdout, { end: false });
const queries = require('../queries/bikeQueries');
const incLostBikesCounter = require('../queries/userQueries').incLostBikeCounter;
const gcs = require('../tools/gcs');

const router = express.Router();

// As defined in the bike Schema.
const STOLEN_FLAG = 'STOLEN';

router.get('/', (req, res) => {
  res.send('handle db tasks');
});
/*
router.post('/preaddbike/', (req, res) => {
  py.stdin.write(JSON.stringify([...req.files.image.data]));

  py.stdin.end();

  py.stdout.on('data', (data) => {
    res.end(data.toString());
  });
});
*/

router.post('/addbike/', (req, res) => {
  const data = req.body;
  if (req.files !== undefined && req.files !== null) {
    gcs.uploadImage(req, (result) => {
      if (result.error) res.send(result.message);
      else {
        data.image_url = process.env.GCS_URL + result.message;

        queries.addBike(req, res, (result_) => {
          if (result_.error) {
            res.send(result_.message);
          } else {
            if (req.body.type === STOLEN_FLAG) incLostBikesCounter(req.body.userId);
            res.send(result_.message);
          }
        });
      }
    });
  } else {
    queries.addBike(req, res, (result) => {
      if (result.error) {
        res.send(result.message);
      } else {
        incLostBikesCounter(req.body.userId);
        res.send(result.message);
      }
    });
  }
});

router.post('/addbike2/', (req, res) => {
  const data = JSON.parse(req.body.json);
  data.userId = req.body.userId;

  if (req.files !== undefined && req.files !== null) {
    gcs.uploadImage(req, (result) => {
      if (result.error) res.send(result.message);
      else {
        data.image_url = process.env.GCS_URL + result.message;

        queries.addBike2(data, (result_) => {
          if (result_.error) res.send(result_.message);
          else res.send(result_.message);
        });
      }
    });
  } else {
    queries.addBike2(data, (result) => {
      if (result.error) res.send(result.message);
      else res.send(result.message);
    });
  }
});

router.post('/removebike/', (req, res) => {
  queries.removeBike(req, res, (result) => { res.send(result.message); });
});

router.post('/getbike/', (req, res) => {
  queries.getBike(req, res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.get('/getbikes/', (req, res) => {
  queries.getBikes(res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.get('/getmybikes/', (req, res) => {
  queries.getMyBikes(req, res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/addcomment/', (req, res) => {
  queries.addComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/removecomment/', (req, res) => {
  queries.removeComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/editcomment/', (req, res) => {
  queries.editComment(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/getcomments/', (req, res) => {
  queries.getComments(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.get('/getstolenbikes/', (req, res) => {
  queries.getStolenBikes(res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.get('/getfoundbikes/', (req, res) => {
  queries.getFoundBikes(res, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

router.post('/updatebike/', (req, res) => {
  queries.updateBike(req, (result) => {
    if (result.error) res.send(result.message);
    else res.send(result.message);
  });
});

// Returns bikes having the features specified in the request parameters.
router.post('/filterbikes/', (req, res) => { queries.filterBikes(req, res, (result) => { res.send(result.message); }); });

// TODO: only showing results above a certain threshold of similarity to uploaded bike
router.post('/getmatchingbikes/', (req, res) => {
  queries.getMatchingBikes(req.body, (result) => {
    if (result.error) res.send(result.message);
    else {
      const ids = [];
      for (let i = 0; i < result.message.length; i += 1) { ids.push(result.message[i]._id); }
      queries.getBikesWithIdsOrdered(ids, (result_) => {
        if (result_.error) res.send(result_.error);
        else res.send(result_.message);
      });
    }
  });
});

// Neural network
// py.stdout.on('data', (data) => {
//   console.log(data.toString())
// });

/*

py.stdout.on('end', () => {
  py.stdout.pipe(py.stdin, { end: false });
  py.stdin.pipe(py.stdout, { end: false });
  console.log('STREAM DONE!!!');
});

py.stderr.on('data', (data) => {
  console.log(JSON.stringify(data.toString()));
});
*/

module.exports = router;
