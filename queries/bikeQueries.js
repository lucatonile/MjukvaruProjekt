/* eslint-disable array-callback-return */
/* eslint no-underscore-dangle: 0 */
const bikeModel = require('../models/bike');
const cbs = require('../tools/cbs');

// Limit for getMatchingBikes results shown
const matchLimit = 5;

function addBike(data, callback) {
  const bike = new bikeModel.Bike(data);
  bike.save((err) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, 'Success in adding bike!'));
  });
}

function getBikeWithId(id, callback) {
  bikeModel.Bike.find(id, (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  }).populate('submitter').populate('comments.author');
}

function getBikesWithIdsOrdered(ids, callback) {
  const query = [
    { $match: { _id: { $in: ids } } },
    { $addFields: { __ids: { $indexOfArray: [ids, '$_id'] } } },
    { $sort: { __ids: 1 } },
    { $project: { __ids: 0 } },
  ];

  bikeModel.Bike.aggregate(query, (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  });
}

function getBikes(data, callback) {
  bikeModel.Bike.find((err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  }).populate('submitter').populate('comments.author');
}

function getStolenBikes(data, callback) {
  bikeModel.Bike.find({ type: 'STOLEN', active: true }, (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  }).populate('submitter').populate('comments.author');
}

function getFoundBikes(data, callback) {
  bikeModel.Bike.find({ type: 'FOUND', active: true },
    (err, bikes) => {
      if (err) callback(cbs.cbMsg(true, err));
      else callback(cbs.cbMsg(false, bikes));
    }).populate('submitter');
}

function getMatchingBikes(data, callback) {
  let type_ = '';
  if (data.type === 'FOUND') type_ = 'STOLEN';
  else if (data.type === 'STOLEN') type_ = 'FOUND';
  else callback(cbs.cbMsg(true, 'bike must be specified as either STOLEN or FOUND'));

  bikeModel.Bike.aggregate([
    {
      $match: {
        $and: [
          {
            type: type_,
          },
          {
            $or: [
              { brand: data.brand },
              { model: data.model },
              { color: data.color },
              { 'keywords.frame_type': data['keywords.frame_type'] === 'true' },
              { 'keywords.sport': data['keywords.sport'] === 'true' },
              { 'keywords.tandem': data['keywords.tandem'] === 'true' },
              { 'keywords.basket': data['keywords.basket'] === 'true' },
              { 'keywords.rack': data['keywords.rack'] === 'true' },
              { 'keywords.mudguard': data['keywords.mudguard'] === 'true' },
              { 'keywords.chain_protection': data['keywords.chain_protection'] === 'true' },
              { 'keywords.net': data['keywords.net'] === 'true' },
              { 'keywords.winter_tires': data['keywords.winter_tires'] === 'true' },
              { 'keywords.light': data['keywords.light'] === 'true' },
              { frame_number: data.frame_number },
              { antitheft_code: data.antitheft_code },
            ],
          },
        ],
      },
    },
    {
      $project: {
        brand_: { $cond: [{ $eq: ['$brand', data.brand] }, 1, 0] },
        model_: { $cond: [{ $eq: ['$model', data.model] }, 1, 0] },
        color_: { $cond: [{ $eq: ['$color', data.color] }, 1, 0] },
        frame_type_: { $cond: [{ $eq: ['$keywords.frame_type', data['keywords.frame_type'] === 'true'] }, 1, 0] },
        sport_: { $cond: [{ $eq: ['$keywords.sport', data['keywords.sport'] === 'true'] }, 1, 0] },
        tandem_: { $cond: [{ $eq: ['$keywords.tandem', data['keywords.tandem'] === 'true'] }, 1, 0] },
        basket_: { $cond: [{ $eq: ['$keywords.basket', data['keywords.basket'] === 'true'] }, 1, 0] },
        rack_: { $cond: [{ $eq: ['$keywords.rack', data['keywords.rack'] === 'true'] }, 1, 0] },
        mudguard_: { $cond: [{ $eq: ['$keywords.mudguard', data['keywords.mudguard'] === 'true'] }, 1, 0] },
        cp_: { $cond: [{ $eq: ['$keywords.chain_protection', data['keywords.chain_protection'] === 'true'] }, 1, 0] },
        net_: { $cond: [{ $eq: ['$keywords.net', data['keywords.net'] === 'true'] }, 1, 0] },
        wt_: { $cond: [{ $eq: ['$keywords.winter_tires', data['keywords.winter_tires'] === 'true'] }, 1, 0] },
        light_: { $cond: [{ $eq: ['$keywords.light', data['keywords.light'] === 'true'] }, 1, 0] },
        // frame/antitheft number give extra high score
        fn_: { $cond: [{ $eq: ['$frame_number', data.frame_number] }, 10, 0] },
        ac_: { $cond: [{ $eq: ['$antitheft_code', data.antitheft_code] }, 10, 0] },
      },
    },
    {
      $project: {
        total: ['$brand_', '$model_', '$color_', '$frame_type_', '$sport_', '$tandem_',
          '$basket_', '$rack_', '$mudguard_', '$cp_', '$net_', '$wt_', '$light_', '$fc_', '$ac_'],
      },
    },
    {
      $project: {
        score: { $sum: '$total' },
      },
    },
    {
      $sort: {
        score: -1,
      },
    },
    {
      $limit: matchLimit,
    },
  ], (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  });
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
  getBikeWithId,
  getBikesWithIdsOrdered,
  getStolenBikes,
  getFoundBikes,
  getMatchingBikes,
};
