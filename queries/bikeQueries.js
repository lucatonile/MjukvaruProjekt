/* eslint-disable array-callback-return */
const bikeModel = require('../models/bike');
const cbs = require('../tools/cbs');

function addBike(data, callback) {
  const bike = new bikeModel.Bike(data);
  bike.save((err) => {
    if (err) callback(cbs.cbMsg(true, err));
    callback(cbs.cbMsg(false, 'Success in adding bike!'));
  });
}

function getBikes(data, callback) {
  bikeModel.Bike.find((err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    callback(cbs.cbMsg(false, bikes));
  }).populate('submitter').populate('comments.author');
}

function getStolenBikes(data, callback) {
  bikeModel.Bike.find({ type: 'STOLEN', active: true }, (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    callback(cbs.cbMsg(false, bikes));
  }).populate('submitter').populate('comments.author');
}

function getFoundBikes(data, callback) {
  bikeModel.Bike.find({ type: 'FOUND', active: true },
    (err, bikes) => {
      if (err) {
        callback(cbs.cbMsg(true, err));
      }
      callback(cbs.cbMsg(false, bikes));
    }).populate('submitter');
}

module.exports = {
  addBike,
  getBikes,
  getStolenBikes,
  getFoundBikes,
};
