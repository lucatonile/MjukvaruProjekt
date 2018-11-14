const imageModel = require('../models/image');

function addImage(data, callback){  
    let image = new imageModel.Image({path: data.path});
    image.save(function (err, user) {
        if (err) return console.error(err);
        callback("Success in adding image!");
    })
}

module.exports = {
    addImage
  };