var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var fs = require("fs");

// html 위치 정의
app.set("views", __dirname + '/views');
// ejs 사용 설정
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

var server = app.listen(8080, function(){
  console.log("Express server has started on port 8080");  
});

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
  secret: "@#@$MYSIGN#@$#$",
  resave: false,
  saveUninitialized: true
}));

// 라우터 모듈 불러오기
var router = require("./router/main")(app, fs);