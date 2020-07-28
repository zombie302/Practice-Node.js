var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var port = process.env.port || 8080;

var server = app.listen(port, function(){
    console.log("Express server has started on port" + port);
});

// DB 연결
var db = mongoose.connection;
db.on("error", console.error);
db.once("open", function(){
    console.log("Connected to mongodb server");
});

mongoose.connect("mongodb://localhost/mongodb_tutorial");


var Book = require("./models/book");

var router = require("./routes") (app, Book);