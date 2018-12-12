require('dotenv').config();

const uuidv1 = require('uuid/v1');
const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');
const cbs = require('./cbs');

const storage = new Storage({
  projectId: process.env.GCS_PROJECTID,
  keyFilename: process.env.GCS_KEYFILENAME,
});

const bucketName = process.env.GCS_PROJECTID;

/*
  args = {
    req: http request(json),
    imgName: explicit filename of img (optional)
    thumbnail: {name, width, height } (optional)
  }
*/
function uploadImage(args, callback) {
  if (args.req === undefined) callback(cbs.cbMsg(true, 'no request object found'));

  let filename = uuidv1();
  if (args.imgName !== undefined) filename = args.imgName;

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
      else if (args.thumbnail !== undefined) {
        // If thumbnail is to be generated, resize input imgbuffer and upload to GCS as well
        sharp(args.req.files.image.data)
          .resize(args.thumbnail.width, args.thumbnail.height)
          .toBuffer({ resolveWithObject: true })
          .then(({ data, info }) => {
            const thumbnailFile = storage.bucket(bucketName).file(args.thumbnail.name);

            // update mimetype to the one generated from sharp
            metadata.contentType = `image/${info.format}`;

            thumbnailFile.save((data), {
              public: true,
              metadata,
            }, (err__) => {
              if (err__) callback(cbs.cbMsg(true, err__));
              else callback(cbs.cbMsg(false, { img: filename, thumbnail: `${args.thumbnail.name}` }));
            });
          })
          .catch((err_) => {
            callback(cbs.cbMsg(true, err_));
          });
      } else callback(cbs.cbMsg(false, { img: filename }));
    });
  }
}

// Generates image and thumbnail ID and uploads dummy data to GCS
function generateUrlIds(callback) {
  const img = uuidv1();
  const thumbnail = `${img}_t`;

  const file = storage.bucket(bucketName).file(img);
  const thumbnailFile = storage.bucket(bucketName).file(thumbnail);

  file.save('', {
    public: true,
    // metadata: ?
  }, (err) => {
    if (err) callback(cbs.cbMsg(true, err));
    else {
      thumbnailFile.save('', {
        public: true,
      }, (err_) => {
        if (err_) callback(cbs.cbMsg(true, err_));
        else callback(cbs.cbMsg(false, { img, thumbnail }));
      });
    }
  });
}
module.exports = {
  uploadImage,
  generateUrlIds,
};
