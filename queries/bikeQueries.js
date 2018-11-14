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
  }).populate('submitter');
}

function getStolenBikes(data, callback) {
  bikeModel.Bike.find({ type: 'STOLEN', active: true },
    (err, bikes) => {
      if (err) {
        callback(err);
        if (err) throw new Error(err);
      }
      callback(bikes);
    }).populate('submitter').populate('comments.author');
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

module.exports = {
  addBike,
  getBikes,
  getStolenBikes,
  getFoundBikes,
};
