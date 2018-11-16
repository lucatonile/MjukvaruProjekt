/* eslint-disable array-callback-return */
const bikeModel = require('../models/bike');

function addBike(data, callback) {
  const bike = new bikeModel.Bike({ brand: 'nike', color: 'red' });

  bike.save((err) => {
    if (err) throw new Error(err);
    callback('Success in adding bike!');
  });
}

function getBikes(data, callback) {
  bikeModel.Bike.find((err, bikes) => {
    if (err) throw new Error(err);
    callback(bikes);
  }).populate('submitter').populate('comments.author');
}

function getStolenBikes(data, callback) {
  bikeModel.Bike.find({ type: 'STOLEN', active: true },
    (err, bikes) => {
      if (err) {
        callback(err);
        if (err) throw new Error(err);
      }
      callback(bikes);
    }).populate('submitter');
}

function getFoundBikes(data, callback) {
  bikeModel.Bike.find({ type: 'FOUND', active: true },
    (err, bikes) => {
      if (err) {
        callback(err);
        if (err) throw new Error(err);
      }
      callback(bikes);
    }).populate('submitter');
}

function removeBike(req, res, callback) {
  if (req.body.id === undefined) {
    callback('Bike id not provided!');
  } else if (req.body.id === '') {
    callback('Bike id shouldnt be empty!');
  } else {
    bikeModel.Bike.findOneAndDelete({ id: req.body.id },
      (err) => {
        if (err) { callback(err); }
        callback(`Bike ${req.body.id} removed (or not found)!`);
      }).remove();
  }
}

module.exports = {
  addBike,
  removeBike,
  getBikes,
  getStolenBikes,
  getFoundBikes,
};
