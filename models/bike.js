const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  submitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    enum: ['FOUND', 'STOLEN'],
    required: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  model: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  frame_number: Number,
  antitheft_code: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    lat: Number,
    long: Number,
  },
  image_url: {
    type: String,
    trim: true,
  },
  keywords: {
    male: Boolean,
    female: Boolean,
    child: Boolean,
    sport: Boolean,
    tandem: Boolean,
    basket: Boolean,
    rack: Boolean,
    mudguard: Boolean,
    chain_protection: Boolean,
    net: Boolean,
    winter_tires: Boolean,
    light: Boolean,
  },
});

const bikeModel = mongoose.model('Bike', bikeSchema, 'bikes');

// Use initial uppercase for models (as with a Class object)
module.exports = {
  Bike: bikeModel,
};
