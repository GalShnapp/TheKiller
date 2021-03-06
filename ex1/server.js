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
    console.log('');
    console.log('----------  login  ----------');
    console.log('a user requested /users/login');
    let username = req.body.username;
    let password = req.body.pass;
    console.log("user: " + username);
    console.log("password: " + password);
    var options = {
        // host to forward to
        host: '127.0.0.1',
        // port to forward to
        port: 8082,
        // path to forward to
        path: '/users/login?id=' + username + '&pw=' + password,
        // request method
        method: 'get'
    };
    let creq = http.request(options, function (cres) {

        // set encoding
        cres.setEncoding('utf8');

        // wait for data
        cres.on('data', function (chunk) {
            if (chunk.localeCompare('verified') == 0) {
                res.cookie('username', username, {
                    maxAge: 1000 * 60 * 30
                });
                res.sendFile(path.join(__dirname, "priv", "ideas.html"));
            } else {
                res.redirect('/login.html');
            }
            console.log(chunk.localeCompare('verified'));
            console.log(chunk.localeCompare('missMatch'));
        });

        cres.on('close', function () {
            console.log('close');
        });

        cres.on('end', function () {
            console.log('end');
        });

    }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log('err');
        console.log(e.message);
        res.writeHead(409);
        res.end();
    });
    console.log('banana');
    creq.end();

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

/**
 * kill a player endpoint
 */
app.delete('/kill', function (req, res) {
    console.log('');
    console.log('----------  kill!  ----------');
    console.log('a user requested /kill');
    let user = req.cookies.username;
    let data = req.body;

    console.log("user: " + user);
    console.log("datum: " + data);
    let index;
    for (let key in data) {
        index = key;
    }
    var options = {
        // host to forward to
        host: '127.0.0.1',
        // port to forward to
        port: 8082,
        // path to forward to
        path: '/kill?killer=' + user + '&mark=' + index,
        // request method
        method: 'get'
    };
    let creq = http.request(options, function (cres) {

        // set encoding
        cres.setEncoding('utf8');

        // wait for data
        cres.on('data', function (chunk) {
            res.status(200);
            res.send();
            console.log(chunk.localeCompare('verified'));
            console.log(chunk.localeCompare('missMatch'));
        });

        cres.on('close', function () {
            console.log('close');
        });

        cres.on('end', function () {
            console.log('end');
        });

    }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log('err');
        console.log(e.message);
        res.writeHead(409);
        res.end();
    });
    console.log('banana');
    creq.end();


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

/**
 * score endpoint
 */
app.get('/data/score', function (req, res) {
    console.log('');
    console.log('----------  score  ----------');
    console.log('a user requested /data/score');
    let user = req.query.id;
    console.log('query: id=' + user);
    var options = {
        // host to forward to
        host: '127.0.0.1',
        // port to forward to
        port: 8082,
        // path to forward to
        path: '/data/score?id=' + req.query.id,
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
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(cres.statusCode);
            console.log('data');
            res.write(chunk);
        });

        cres.on('close', function () {
            // closed, let's end client request as well
            console.log('close');
            res.end();
        });

        cres.on('end', function () {

            console.log('end');
            res.end();
        });

    }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log(e.message);
        res.writeHead(409);
        res.end();
    });
    creq.write(req.query.id);
    creq.end();


});

/**
 * rank endpoint
 */
app.get('/data/rank', function (req, res) {
    console.log('');
    console.log('----------- rank -----------');
    console.log('a user requested /data/rank');
    let user = req.query.id;
    console.log('query: id=' + user);
    var options = {
        // host to forward to
        host: '127.0.0.1',
        // port to forward to
        port: 8082,
        // path to forward to
        path: '/data/rank?id=' + req.query.id,
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
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(cres.statusCode);
            console.log('data');
            res.write(chunk);
        });

        cres.on('close', function () {
            // closed, let's end client request as well
            console.log('close');
            res.end();
        });

        cres.on('end', function () {

            console.log('end');
            res.end();
        });

    }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log(e.message);
        res.writeHead(409);
        res.end();
    });
    creq.write(req.query.id);
    creq.end();

});

/**
 * msg endpoint
 */
app.get('/data/msg', function (req, res) {
    console.log('');
    console.log('-----------  msg  -----------');
    console.log('a user requested /data/msg');
    let user = req.query.id;
    console.log('query: id=' + user);
    var options = {
        // host to forward to
        host: '127.0.0.1',
        // port to forward to
        port: 8082,
        // path to forward to
        path: '/data/msg?id=' + req.query.id,
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
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(cres.statusCode);
            console.log('data');
            res.write(chunk);
        });

        cres.on('close', function () {
            // closed, let's end client request as well
            console.log('close');
            res.end();
        });

        cres.on('end', function () {

            console.log('end');
            res.end();
        });

    }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log(e.message);
        res.writeHead(409);
        res.end();
    });
    creq.write(req.query.id);
    creq.end();


});

app.get('/data/highScores', function (req, res) {
    console.log('');
    console.log('----------  score  ----------');
    console.log('a user requested /data/highScores');
    var options = {
        // host to forward to
        host: '127.0.0.1',
        // port to forward to
        port: 8082,
        // path to forward to
        path: '/data/highScores',
        // request method
        method: 'get',
        // headers to send
        headers: req.headers,
        // query
    };
    let creq = http.request(options, function (cres) {

        // set encoding
        cres.setEncoding('utf8');

        // wait for data
        cres.on('data', function (chunk) {
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(cres.statusCode);
            console.log('data');
            res.write(chunk);
        });

        cres.on('close', function () {
            // closed, let's end client request as well
            console.log('close');
            res.end();
        });

        cres.on('end', function () {

            console.log('end');
            res.end();
        });

    }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log(e.message);
        res.writeHead(409);
        res.end();
    });
    creq.end();
});

/**
 * mark-list endpoint
 */
app.get('/marks', function (req, res) {
    console.log('');
    console.log('----------  marks  ----------');
    console.log('a user requested /marks');

    console.log('coockie: ' + req.cookies.username);
    var options = {
        // host to forward to
        host: '127.0.0.1',
        // port to forward to
        port: 8082,
        // path to forward to
        path: '/marks?id=' + req.cookies.username,
        // request method
        method: 'get',
        // headers to send
        headers: req.headers,
    };
    let creq = http.request(options, function (cres) {

        // set encoding
        cres.setEncoding('utf8');

        // wait for data
        cres.on('data', function (chunk) {
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(cres.statusCode);
            console.log('data');
            console.log(chunk);
            res.write(chunk);
        });

        cres.on('close', function () {
            // closed, let's end client request as well
            console.log('close');
            res.end();
        });

        cres.on('end', function () {

            console.log('end');
            res.end();
        });

    }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log(e.message);
        res.writeHead(409);
        res.end();
    });
    creq.end();
});

let server = app.listen(8081, function () {
    // @ts-ignore
    let host = server.address().address;
    // @ts-ignore
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});