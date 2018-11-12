var db = require("./db.js");

function addBike(data, callback){
    db.query("INSERT INTO bike () VALUES ()", function (err, res) {
        if(err) {
            console.log("error: ", err);
            // result(null, err);
        }
        else{
            console.log('res : ', res);  
            return callback(res);
        //  result(null, res);
        }
     });  
}

function getBikes(data, callback){
    db.query("SELECT * FROM bike", function (err, res) {
        if(err) {
            console.log("error: ", err);
            // result(null, err);
        }
        else{
            console.log('res : ', res);  
            return callback(res);
        //  result(null, res);
        }
     });  
}

module.exports = {
    addBike: addBike,
    getBikes: getBikes
}