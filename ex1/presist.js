const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const gameOBJ = require('./lib/game.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// error drain
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

// *********************************************
//  **************** Endpoints ****************
// *********************************************


/**
 * Register New User endpoint
 */
app.post('/users/register', function (req, res) {
    console.log('----------  regist  ----------');
    console.log('a user requested /users/register');
    let username = req.body.username;
    let password = req.body.pass;
    console.log('user name: ' + username + 'password: ' + password);
    // @ts-ignore
    if (gameSingleton.addUser(username, password)) {
        console.log('rightful termination on registering ' + username);
        res.status(200);
        res.send('created');
    } else {
        res.status(409);
        console.log('wrongful termination on registering ' + username);
        res.send('This username is taken');
    }
});

/**
 * Login endpoint
 */
app.post('/users/login', function (req, res) {
    console.log('----------  login  ----------');
    console.log('a user requested /users/login');
    let username = req.body.username;
    let password = req.body.pass;
    console.log('user name: ' + username + 'password: ' + password);
    // @ts-ignore
    if (gameSingleton.loginUser(username, password)) {
        console.log('rightful termination on logging ' + username);
        res.status(200);
        res.send('verified');
    } else {
        res.status(409);
        console.log('wrongful termination on logging ' + username);
        res.send('missMatch');
    }
});

app.get('/data/score', function (req, res) {
    console.log('----------  score  ----------');
    console.log('a user requested /data/score');
    //TODO: query string params
    let user = req.params.id;
    // @ts-ignore
    if (gameSingleton.userExists(user)) {

    }

    res.send(JSON.stringify(ideas));
});

app.get('/data/rank', function (req, res) {
    //TODO: query string params
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    // @ts-ignore
    console.log('yolo');
    let DB = JSON.parse(fs.readFileSync('DB.txt').toString());
    let ideas = DB[req.cookies.username].ideas;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ideas));
});

app.get('/data/msg', function (req, res) {
    //TODO: query string params
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    // @ts-ignore
    console.log('yolo');
    let DB = JSON.parse(fs.readFileSync('DB.txt').toString());
    let ideas = DB[req.cookies.username].ideas;
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



// *********************************************
//  *************** Server-Init ***************
// *********************************************

let server = app.listen(8082, function () {
    // @ts-ignore
    let host = server.address().address;
    // @ts-ignore
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});
// @ts-ignore
console.log(gameSingleton.kill('roy', 'gal'));