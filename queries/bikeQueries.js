/* eslint-disable array-callback-return */
const bikeModel = require('../models/bike');
const cbs = require('../tools/cbs');

function addBike(data, callback) {
  const bike = new bikeModel.Bike(data);
  bike.save((err) => {
    if (err) callback(cbs.cbMsg(true, err));
    callback(cbs.cbMsg(false, { message: 'Success in adding bike!' }));
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

function removeBike(req, res, callback) {
  if (req.body.bikeId === undefined) {
    callback(cbs.cbMsg(true, { error: 'bikeId not provided!' }));
  } else if (req.body.bikeId === '') {
    callback(cbs.cbMsg(true, { error: 'Empty bikeId provided!' }));
  } else {
    bikeModel.Bike.findOneAndRemove({ email: req.body.bikeId },
      (err) => {
        if (err) cbs.cbMsg(true, err);
        callback(cbs.cbMsg(false, { message: 'Bike removed (or not found)!' }));
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
