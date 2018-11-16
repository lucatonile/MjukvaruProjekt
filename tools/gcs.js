require('dotenv').config();

const uuidv1 = require('uuid/v1');
const { Storage } = require('@google-cloud/storage');
const cbs = require('./cbs');

const storage = new Storage({
  projectId: process.env.GCS_PROJECTID,
  keyFilename: process.env.GCS_KEYFILENAME,
});

const bucketName = process.env.GCS_PROJECTID;

function uploadImage(req, callback) {
  const filename = uuidv1();
  const file = storage.bucket(bucketName).file(filename);

  // Verify that uploaded file is image
  if (req.files.image.mimetype.split('/')[0] !== 'image') {
    callback(cbs.cbMsg(true, 'File must be an image!'));
  }

  const metadata = {
    contentType: req.files.image.mimetype,
  };

  // Upload file to gsc and mongodb.
  // To get link to file, use:
  // http://storage.googleapis.com/bikeini/filename (uuid)
  file.save(req.files.image.data, {
    public: true,
    metadata,
  }, (err) => {
    if (!err) {
      // File written successfully.
      callback(cbs.cbMsg(false, filename));
    }
  });
}

module.exports = {
  uploadImage,
};
