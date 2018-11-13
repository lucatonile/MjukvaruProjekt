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

function getStolenBikes(data, callback) {
    models.bike.find({ type: 'STOLEN', active: true },
        function(err, bikes) {
            if (err) {
                callback(err);
                return console.error(err);
            }
            callback(bikes);
})}

function getFoundBikes(data, callback) {
    models.bike.find({ type: 'FOUND', active: true },
        function(err, bikes) {
            if (err) {
                callback(err);
                return console.error(err);
            }
            callback(bikes);
        }
    )
}

function getUserInfoEmail(req, res, callback) {
    models.user.find({ email: req.body.email },
        function(err, user) {
            if (err) {
                callback(err);
                return console.error(err);
            } else {
                callback(user);
            }
        }
    ).select('username email phone_number create_time game_score -_id')
}

function addUser(req, res, callback){
    var user = new models.user({
        username: req.query.username,
        password: req.query.password});

    user.save(function (err, user) {
        if (err) return console.error(err);
        callback("Success in adding user!");
    })
}

function addUserPost(req, res, callback){
    var user = new models.user({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number,   
    })

    user.save(function (err, user) {
        if (err) {
            callback("Error: " + err);
            return console.error(err);
        } else {
            callback("Success in adding user via POST!");
        }
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
    addUser: addUser,
    addUserPost: addUserPost,

    getBikes: getBikes,
    getStolenBikes, getStolenBikes,
    getFoundBikes, getFoundBikes,
    getUsers: getUsers,
    getUserInfoEmail: getUserInfoEmail,
}
