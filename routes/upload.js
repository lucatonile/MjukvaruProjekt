// Imports the Google Cloud client library
let express = require('express');
const {Storage} = require('@google-cloud/storage');

let router = express.Router();
let path = require('path');
let queries = require('../queries.js');
let fs = require('fs');
const uuidv1 = require('uuid/v1');
const bucketName = 'bikeini';

// Creates a client
const storage = new Storage({  
    projectId: 'bikeini',  
    keyFilename: './bikeini-1542130432563-745c86847ce9.json'
});

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
                    queries.addImage({name: filename}, function(result){
                        res.end(filename+" uploaded to gcs and mongodb");
                        storage.bucket(bucketName).file(filename).download({destination: './'+filename});
                    });
                }
     });          
    
});

module.exports = router;