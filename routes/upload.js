require('dotenv').config();

let express = require('express');
let router = express.Router();
let imageQueries = require('../queries/imageQueries');

const uuidv1 = require('uuid/v1');
const {Storage} = require('@google-cloud/storage');

const storage = new Storage({  
    projectId: process.env.GCS_PROJECTID,  
    keyFilename: process.env.GCS_KEYFILENAME
});

const bucketName = process.env.GCS_PROJECTID;

router.post('/', function(req, res, next){
    let filename = uuidv1();
    let file = storage.bucket(bucketName).file(filename);
    
    //Verify that uploaded file is image
    if(req.files.image.mimetype.split("/")[0] != 'image'){
        res.end("File must be an image!");
        return;
    }

    const metadata = {
        contentType: req.files.image.mimetype
    };

    //Upload file to gsc and mongodb.
    //To get link to file, use:
    //http://storage.googleapis.com/bikeini/filename (uuid)
    file.save(req.files.image.data, {
            public: true,
            metadata: metadata
            }, function(err) {
                if (!err) {
                // File written successfully.
                    imageQueries.addImage({name: filename}, function(result){
                        res.end(filename+" uploaded to gcs and mongodb");
                    });
                }
     });          
    
});

module.exports = router;