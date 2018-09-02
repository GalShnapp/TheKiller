// @ts-check
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const http = require('http');

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
    let username = req.body.username;
    let password = req.body.pass;
    // @ts-ignore
    let DB = JSON.parse(fs.readFileSync('DB.txt'));
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
    let username = req.body.username;
    let password = req.body.pass;
    // @ts-ignore
    let DB = JSON.parse(fs.readFileSync('DB.txt'));
    if (typeof DB[username] !== undefined) {
        let usr = DB[username];
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

// redirecting
app.get('/', function (req, res) {

    if (Object.keys(req.cookies).length > 0) {
        res.status(200);
        res.sendFile(path.join(__dirname, "priv", "ideas.html"));
    } else {
        res.redirect('/login.html');
    }

});

// update an exsisting idea()
app.post('/ideaup', function (req, res) {
    // /idea/<id> (POST) - update an idea (string)  by it’s id
    // @ts-ignore
    let DB = JSON.parse(fs.readFileSync('DB.txt'));
    let ideas = DB[req.cookies.username].ideas;
    let data = req.body;
    for (let key in data) {
        ideas[key] = data[key];
    }
    fs.writeFileSync('DB.txt', JSON.stringify(DB));
    res.status(200);
    res.send();

});

// delete a
app.delete('/idead', function (req, res) {
    // /idea/<id> (DELETE) - delete an idea by it’s id (returns 0 if success, 1 otherwise)
    // @ts-ignore
    let DB = JSON.parse(fs.readFileSync('DB.txt'));
    let ideas = DB[req.cookies.username].ideas;
    let data = req.body;
    for (let key in data) {
        delete ideas[key];
    }
    fs.writeFileSync('DB.txt', JSON.stringify(DB));
    res.status(200);
    res.send();

});


app.put('/ideapu', function (req, res) {
    // /idea (PUT) - add new idea ( idea is just a string) returns the idead’s id
    // @ts-ignore
    let DB = JSON.parse(fs.readFileSync('DB.txt'));
    let ideas = DB[req.cookies.username].ideas;
    let data = req.body;
    for (let key in data) {
        ideas[key] = data[key];
    }
    fs.writeFileSync('DB.txt', JSON.stringify(DB));
    res.status(200);
    res.send();

});

app.get('/data/score', function (req, res) {
    console.log('data/score');
    let user = req.query.id;
    var options = {
        // host to forward to
        host: '127.0.0.2',
        // port to forward to
        port: 8082,
        // path to forward to
        path: '/data/score',
        // request method
        method: 'get',
        // headers to send
        headers: req.headers,
        // query
        query: {
            id: req.query.id
        }
    };
    let creq = http.request(options, function (cres) {

        // set encoding
        cres.setEncoding('utf8');

        // wait for data
        cres.on('data', function (chunk) {
            res.write(chunk);
        });

        cres.on('close', function () {
            // closed, let's end client request as well 
            res.writeHead(cres.statusCode);
            res.end();
        });

        cres.on('end', function () {
            // finished, let's finish client request as well 
            // res.writeHead(cres.statusCode);
            res.end();
        });

    }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log(e.message);
        res.writeHead(500);
        res.end();
    });
    creq.write(req.query.id);
    creq.end();

    res.setHeader('Content-Type', 'application/json');
    res.send(200);
});

app.get('/data/rank', function (req, res) {
    //TODO: query string params
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    // @ts-ignore
    let user = req.query.id;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ideas));
});

app.get('/data/msg', function (req, res) {
    //TODO: query string params
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    // @ts-ignore
    let user = req.query.id;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ideas));
});

app.get('/data/highScores', function (req, res) {
    // { 'name' : 'score'}  <== model. names as keys, ranks as values.
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    // @ts-ignore
    console.log('yolo');
    let DB = JSON.parse(fs.readFileSync('DB.txt').toString());
    let ideas = DB[req.cookies.username].ideas;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ideas));
});

app.get('/ideas', function (req, res) {
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    // @ts-ignore
    console.log('yolo');
    let DB = JSON.parse(fs.readFileSync('DB.txt').toString());
    let ideas = DB[req.cookies.username].ideas;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ideas));
});

let server = app.listen(8081, function () {
    // @ts-ignore
    let host = server.address().address;
    // @ts-ignore
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});