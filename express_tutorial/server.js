var express = require("express");
var app = express();
// 라우터 모듈 불러오기
var router = require("./router/main")(app);

// html 위치 정의
app.set("views", __dirname + '/views');
// ejs 사용 설정
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

var server = app.listen(8080, function(){
  console.log("Express server has started on port 8080");  
});

app.use(express.static("public"));