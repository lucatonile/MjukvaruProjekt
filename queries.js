var mongoose = require('mongoose');
var models = require('./models.js');

function addBike(data, callback){
    var bike = new models.bike({brand: "nike", color: "red"});

    bike.save(function (err, bike) {
        if (err) return console.error(err);
        callback("Success in adding bike!");
    });
}

function getBikes(data, callback){
    models.bike.find(function (err, bikes) {
        if (err) return console.error(err);
        callback(bikes);
    })
}

function addUser(data, callback){
    var user = new models.user({username: "jakob", password: "lucas<3"});
    user.save(function (err, user) {
        if (err) return console.error(err);
        callback("Success in adding user!");
    })
}

function getUsers(data, callback){
    models.user.find(function (err, users) {
        if (err) return console.error(err);
        callback(users);
    })
}

module.exports = {
    addBike: addBike,
    getBikes: getBikes,
    addUser: addUser,
    getUsers: getUsers
}