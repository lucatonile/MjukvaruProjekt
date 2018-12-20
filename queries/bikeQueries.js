/* eslint-disable array-callback-return */
/* eslint no-underscore-dangle: 0 */
const bikeModel = require('../models/bike');
const cbs = require('../tools/cbs');
const reverseGeolocation = require('../tools/reverseGeolocation');
const gcs = require('../tools/gcs');
const imgOptimizerMinimize = require('../tools/imgOptimizer').minimize;
const incLostBikesCounter = require('../queries/userQueries').incLostBikeCounter;

// Limit for getMatchingBikes results shown
const matchLimit = 5;

// Flag for marking a bike as stolen or found for the database
const STOLEN_FLAG = 'STOLEN';
const FOUND_FLAG = 'FOUND';

// Flag for choosing decimal representation
const DECIMAL_FLAG = 10;

function saveBikeToDB(req, res, callback) {
  // Model requires submitter Id
  const bikeData = req.body;
  bikeData.submitter = req.body.userId;
  bikeData.image_url = {
    img: req.body.image_url,
    thumbnail: req.body.thumbnail_url,
  };
  const locations = reverseGeolocation.getLocation(req.body.lat, req.body.long);

  if (locations.error !== undefined) {
    callback(cbs.cbMsg(true, locations.error));
    res.status(400).send();
  } else {
    bikeData.location = {
      lat: req.body.lat,
      long: req.body.long,
      city: locations.city,
      neighborhood: locations.neighborhood,
      street: locations.street,
    };

    const bike = new bikeModel.Bike(bikeData);

    bike.save((err, result) => {
      if (err) {
        callback(cbs.cbMsg(true, err));
      } else {
        callback(cbs.cbMsg(false, {
          message: 'Success in adding bike',
          bikeId: result._id,
          bike: result,
        }));
      }
    });
  }
}

function addBike(req, res, callback) {
  let { body } = req;
  const { userId } = req.body;

  if (body.json !== undefined) {
    body = JSON.parse(body.json);
    req.body = body;
    req.body.userId = userId;
  }

  if (req.files !== undefined && req.files !== null) {
    if (req.files.image.mimetype.split('/')[0] !== 'image') {
      callback(cbs.cbMsg(true, 'File must be an image!'));
    } else {
      gcs.generateUrlIds((urlResult) => {
        if (urlResult.error) callback(urlResult);
        else {
          req.body.image_url = process.env.GCS_URL + urlResult.message.img;
          req.body.thumbnail_url = process.env.GCS_URL + urlResult.message.thumbnail;

          saveBikeToDB(req, res,
            (addResult) => {
              if (addResult.error) callback(addResult);
              else {
                if (req.body.type === STOLEN_FLAG) incLostBikesCounter(req.body.userId);
                // Done uploading bike pic, send response
                callback(addResult);

                // Behind the hood, optimize image, create thumbnail and upload to GCS
                imgOptimizerMinimize(req.files.image.data, (minResult) => {
                  if (minResult.error) {
                    // handle minResult error
                    console.log(minResult);
                  } else {
                    req.files.image.data = minResult.message;
                    gcs.uploadImage(
                      {
                        req,
                        imgName: urlResult.message.img,
                        thumbnail: {
                          name: urlResult.message.thumbnail,
                          width: parseInt(process.env.BIKE_THUMBNAIL_WIDTH, DECIMAL_FLAG),
                          height: parseInt(process.env.BIKE_THUMBNAIL_HEIGHT, DECIMAL_FLAG),
                        },
                      },
                      (uploadResult) => {
                        // handle uploadResult error
                        if (uploadResult.error) console.log(uploadResult);
                      },
                    );
                  }
                });
              }
            });
        }
      });
    }
  } else {
    saveBikeToDB(req, res, (result) => {
      if (result.error) {
        callback(result);
      } else {
        if (req.body.type === STOLEN_FLAG) incLostBikesCounter(req.body.userId);
        callback(result);
      }
    });
  }
}

function updateBike(req, callback) {
  if (req.body.type !== undefined
    && (req.body.type !== FOUND_FLAG && req.body.type !== STOLEN_FLAG)) {
    callback(cbs.cbMsg(true, 'type must be specified as either STOLEN or FOUND'));
  } else {
    bikeModel.Bike.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }, (err, bike) => {
      if (err) callback(cbs.cbMsg(true, err));
      else if (bike === null) callback(cbs.cbMsg(false, `bike with id ${req.body.id} was not found in the db!`));
      else callback(cbs.cbMsg(false, bike));
    });
  }
}

function getBikesWithIdsOrdered(ids, callback) {
  const query = [
    { $match: { _id: { $in: ids } } },
    { $addFields: { __ids: { $indexOfArray: [ids, '$_id'] } } },
    { $sort: { __ids: 1 } },
    { $project: { __ids: 0 } },
  ];

  bikeModel.Bike.aggregate(query, (err, bikes) => {
    if (err) {
      callback(cbs.cbMsg(true, err));
    } else {
      bikeModel.Bike.populate(bikes, 'submitter', (err1, populatedBikes) => {
        if (err1) callback(cbs.cbMsg(true, err1));
        else callback(cbs.cbMsg(false, populatedBikes));
      });
    }
  });
}

// Return a bike with the provided bikeId.
function getBike(req, res, callback) {
  bikeModel.Bike.findOne({ _id: req.body.bikeId }, (err, bike) => {
    if (err) callback(cbs.cbMsg(true, err));
    else if (!bike) callback(cbs.cbMsg(false, 'Bike not found'));
    else callback(cbs.cbMsg(false, bike));
  });
}

function getBikes(data, callback) {
  bikeModel.Bike.find((err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  });
}

function getMyBikes(req, res, callback) {
  bikeModel.Bike.find({ submitter: req.body.userId }, (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  });
}

function getStolenBikes(data, callback) {
  bikeModel.Bike.find({ type: STOLEN_FLAG, active: true }, (err, bikes) => {
    if (err) callback(cbs.cbMsg(true, err));
    else callback(cbs.cbMsg(false, bikes));
  });
}

function getFoundBikes(data, callback) {
  bikeModel.Bike.find({ type: FOUND_FLAG, active: true },
    (err, bikes) => {
      if (err) callback(cbs.cbMsg(true, err));
      else callback(cbs.cbMsg(false, bikes));
    });
}

function getMatchingBikes(data, callback) {
  let type_ = '';
  if (data.type === FOUND_FLAG) type_ = STOLEN_FLAG;
  else if (data.type === STOLEN_FLAG) type_ = FOUND_FLAG;
  else callback(cbs.cbMsg(true, `bike must be specified as either ${STOLEN_FLAG} or ${FOUND_FLAG}`));

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
      $match: {
        score: {
          // score = number_of_keyword_matches
          $gte: parseInt(process.env.MINIMUM_BIKEMATCH_SCORE, 10),
        },
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
    bikeModel.Bike.findOneAndRemove({ _id: req.body.bikeId },
      (err) => {
        if (err) cbs.cbMsg(true, err);
        callback(cbs.cbMsg(false, { message: 'Bike removed (or not found)!' }));
      }).remove();
  }
}

// Search for bikes in bikeModel with features matching the parameters provided by the caller.
function filterBikes(req, res, callback) {
  if (req.body === undefined) { callback(cbs.cbMsg(true, 'Req.body undefined!')); }
  delete req.body.userId;

  bikeModel.Bike.find(req.body, (err, result) => {
    if (err) cbs.cbMsg(true, err);
    else if (result === null) callback(cbs.cbMsg(false, 'Nothing found!'));
    else res.send(cbs.cbMsg(false, result));
  });
}

module.exports = {
  addBike,
  removeBike,
  updateBike,
  getBike,
  getBikes,
  getMyBikes,
  getBikesWithIdsOrdered,
  getStolenBikes,
  getFoundBikes,
  getMatchingBikes,
  filterBikes,
};
