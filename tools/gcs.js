require('dotenv').config();

const uuidv1 = require('uuid/v1');
const { Storage } = require('@google-cloud/storage');
const cbs = require('./cbs');

const storage = new Storage({
  projectId: process.env.GCS_PROJECTID,
  keyFilename: process.env.GCS_KEYFILENAME,
});

const bucketName = process.env.GCS_PROJECTID;

// args = { req: http request(json), name: explicit filename (optional) }
function uploadImage(args, callback) {
  if (args.req === undefined) callback(cbs.cbMsg(true, 'no request object found'));

  let filename = uuidv1();
  if (args.name !== undefined) filename = args.name;
  const file = storage.bucket(bucketName).file(filename);

  // Verify that uploaded file is image
  if (args.req.files.image.mimetype.split('/')[0] !== 'image') {
    callback(cbs.cbMsg(true, 'File must be an image!'));
  } else {
    const metadata = {
      contentType: args.req.files.image.mimetype,
    };

    // Upload file to gcs and mongodb.
    // To get link to file, use:
    // http://storage.googleapis.com/bikeini/filename (uuid)
    file.save(args.req.files.image.data, {
      public: true,
      metadata,
    }, (err) => {
      if (err) callback(cbs.cbMsg(true, err));
      else callback(cbs.cbMsg(false, filename));
    });
  }
}

module.exports = {
  uploadImage,
};
