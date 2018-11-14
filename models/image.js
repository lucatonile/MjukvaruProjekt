const mongoose = require('mongoose');

let imageSchema = new mongoose.Schema({
    //unique id
    name: String
});

let imageModel = mongoose.model('image', imageSchema, "images");

// Use initial uppercase for models (as with a Class object)
module.exports = {
    Image: imageModel,
  };