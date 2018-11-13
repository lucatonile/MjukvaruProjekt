var express = require('express');
var router = express.Router();
var db = require("../db.js");
var queries = require("../queries.js");
/* GET home page. */

router.get('/', function(req, res, next) {
    res.send('handle db tasks');
});

router.get('/addbike/', function(req, res, next) {
    queries.addBike(req, function(result){
        console.log(result);
    })
});

router.get('/removebike/', function(req, res, next) {
    res.send('remove bike from db');
});

router.get('/getbikes/', function(req, res, next) {
    queries.getBikes(res, function(result){
        res.send(result);
    })
});

router.get('/getstolenbikes/', function(req, res, next) {
    queries.getStolenBikes(res, function(result){
        res.send(result);
    })
});

router.get('/getfoundbikes/', function(req, res, next) {
    queries.getFoundBikes(res, function(result){
        res.send(result);
    })
});

router.get('/adduser/', function(req, res, next) {
    queries.addUser(req, res, function(result){
        res.send(result);
    })
});

router.post('/adduser/', function(req, res) {
    queries.addUserPost(req, res, function(result){
        res.send(result);
    })
})

router.get('/getusers/', function(req, res, next) {
    queries.getUsers(res, function(result){
        res.send(result);
    })
});

router.post('/getuserinfoemail/', function(req, res) {
    queries.getUserInfoEmail(req, res, function(result){
        res.send(result);
    })
})

module.exports = router;
