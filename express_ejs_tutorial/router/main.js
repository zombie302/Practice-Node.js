const { json } = require("body-parser");
const e = require("express");

// 모듈화
module.exports = function(app, fs)
{
    // 메인 페이지
    app.get("/", function(req, res){
        var sess = req.session;

        res.render("index", {
            title: "My HomePage",
            length: 5,
            name : sess.name,
            username : sess.username
        });
    });

    app.get("/about", function(req, res){
        res.render("about.html");
    });

    // 전체 리스트 가져오기
    app.get("/user", function(req, res){
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            console.log(data);
            res.end(data);
        });
    });

    //특정 유저 가져오기
    app.get("/user/:username", function(req, res){
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
        });
    });

    // 유저 추가
    app.post("/user/:username", function(req, res){
        var result = {};
        var username = req.params.username;

        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            users[username] = req.body;

            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, "\t"), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            });
        });
    });

    // 유저 수정
    app.put("/user/:username", function(req, res){
        var result = {};
        var username = req.params.username;

        if(!req.body["password"] || !req.body["name"]){
            result = {
                success : 0,
                error : "invalid request"
            };
            res.json(result);
            return;
        }

        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            if(!users[username]){
                result = {
                    success : 0,
                    error : "No Data"
                };

                res.json(result);
                return;
            }

            var user = users[username];
            user.password = req.body["password"];
            user.name = req.body["name"];

            users[username] = user;

            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, "\t"), "utf8", function(err, data){
                result = {success : 1};
                res.json(result);
            });
        });
    });

    // 유저 삭제
    app.delete("/user/:username", function(req, res){
        var result = {};
        var username = req.params.username;

        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            if(!users[username]){
                result = {
                    success : 0,
                    error : "No Data"
                }
                res.json(result);
                return;
            }

            delete users[username];

            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, "\t"), "utf8", function(err, data){
                result = { success : 1 }
                res.json(result);
            });
        });
    });

    // 로그인
    app.post("/login/", function(req, res){
        var sess;
        sess = req.session;

        if(!req.body.password || !req.body.username){
            result = {
                success : 0,
                error : "invalid request"
            };
            res.json(result);
            return;
        }

        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            var username = req.body.username;
            var password = req.body.password;
            var result = {};

            if(!users[username]){
                result = {
                    success : 0,
                    error : "No Data"
                }
                res.json(result);
                return;
            }

            if(users[username].password == password){
                result = { success : 1 };
                sess.username = username;
                sess.name = users[username].name;
                res.json(result);
            } else {
                result = {
                    success : 0,
                    error : "incorrect"
                };
                res.json(result);
            }
        });
    });

    // 로그아웃
    app.get("/logout", function (req, res){
        sess = req.session;
        if(sess.username){
            req.session.destroy(function(err){
                if(err){
                    console.error(err);
                } else {
                    res.redirect("/");
                }
            });
        } else {
            res.redirect("/");
        }
    });
}