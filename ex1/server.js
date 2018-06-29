// @ts-check
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var path = require('path');


// /static/<filename> - returns the <filename> from the “www” directory that you should create



// parse the body (populates req.body)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// parse cookies (populates req.cookies)
app.use(cookieParser());
//  if session is in progress, update the cookies
app.use(function (req, res, next) {
    if (Object.keys(req.cookies).length > 0) {
        res.cookie('username', req.cookies.username, {
            maxAge: 1800000
        });
    }
    next();
});
// serves public content
app.use(express.static('www'));
// error drain
// @ts-ignore
app.use(function (err, req, res, next) {
    if (err) {
        res.status(500);
        res.end();
        console.error(err);
    }

    res.status(404);
    res.end();
    console.log("error while trying to serve: ");
    console.log(req.url);
});

// register endpoint
app.post('/users/register', function (req, res) {
    console.log('create req');
    var username = req.body.username;
    var password = req.body.pass;
    // @ts-ignore
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    if (!DB.hasOwnProperty(username)) {
        console.log('undef');
        DB[username] = {
            pw: password,
            ideas: {
                1: 'get friends to use this app',
                2: 'contribute to society'
            }
        };
        fs.writeFileSync('DB.txt', JSON.stringify(DB));
        res.cookie('username', username, {
            maxAge: 1000 * 60 * 30
        });
        res.status(200);
        res.sendFile(path.join(__dirname, "priv", "ideas.html"));
    } else {
        console.log('def');
        res.redirect("/login.html");
    }

});

// login end-point
app.post('/users/login', function (req, res) {
    console.log("login request");
    var username = req.body.username;
    var password = req.body.pass;
    // @ts-ignore
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    if (typeof DB[username] !== undefined) {
        var usr = DB[username];
        if (password == usr.pw) {
            console.log("pw matches");
            res.cookie('username', username, {
                maxAge: 1000 * 60 * 30
            });
            res.status(200);
            res.sendFile(path.join(__dirname, "priv", "ideas.html"));
        } else {
            console.log("pw doesn't match");
            res.status(401);
            res.redirect('/login.html');
        }
    } else {
        console.log("no such user");
        res.status(401);
        res.redirect('/login.html');
    }


});



app.get('/', function (req, res) {

    if (Object.keys(req.cookies).length > 0) {
        res.status(200);
        res.sendFile(path.join(__dirname, "priv", "ideas.html"));
    } else {
        res.redirect('/login.html');
    }

});

app.post('/ideaup', function (req, res) {
    // /idea/<id> (POST) - update an idea (string)  by it’s id
    // @ts-ignore
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    var ideas = DB[req.cookies.username].ideas;
    var data = req.body;
    for (var key in data) {
        ideas[key] = data[key];
    }
    fs.writeFileSync('DB.txt', JSON.stringify(DB));
    res.status(200);
    res.send();

});


app.delete('/idead', function (req, res) {
    // /idea/<id> (DELETE) - delete an idea by it’s id (returns 0 if success, 1 otherwise)
    // @ts-ignore
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    var ideas = DB[req.cookies.username].ideas;
    var data = req.body;
    for (var key in data) {
        delete ideas[key];
    }
    fs.writeFileSync('DB.txt', JSON.stringify(DB));
    res.status(200);
    res.send();

});


app.put('/ideapu', function (req, res) {
    // /idea (PUT) - add new idea ( idea is just a string) returns the idead’s id
    // @ts-ignore
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    var ideas = DB[req.cookies.username].ideas;
    var data = req.body;
    for (var key in data) {
        ideas[key] = data[key];
    }
    fs.writeFileSync('DB.txt', JSON.stringify(DB));
    res.status(200);
    res.send();

});

app.get('/ideas', function (req, res) {
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    // @ts-ignore
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    var ideas = DB[req.cookies.username].ideas;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ideas));
});

var server = app.listen(8081, function () {
    // @ts-ignore
    var host = server.address().address;
    // @ts-ignore
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});