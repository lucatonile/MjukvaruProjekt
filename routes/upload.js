require('dotenv').config();

const express = require('express');

const router = express.Router();

const uuidv1 = require('uuid/v1');
const { Storage } = require('@google-cloud/storage');
const imageQueries = require('../queries/imageQueries');

const storage = new Storage({
  projectId: process.env.GCS_PROJECTID,
  keyFilename: process.env.GCS_KEYFILENAME,
});

const bucketName = process.env.GCS_PROJECTID;

router.post('/', (req, res) => {
  const filename = uuidv1();
  const file = storage.bucket(bucketName).file(filename);

  // Verify that uploaded file is image
  if (req.files.image.mimetype.split('/')[0] !== 'image') {
    res.end('File must be an image!');
    return;
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
      imageQueries.addImage({ name: filename }, () => {
        res.end(`${filename} uploaded to gcs and mongodb`);
      });
    }
  });
});

module.exports = router;
