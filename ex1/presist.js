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

/**
 * Single User Score endpoint
 */
app.get('/data/score', function (req, res) {
    console.log('');
    console.log('----------  score  ----------');
    console.log('a user requested /data/score');
    let user = req.query.id;
    console.log('query: id=' + user);
    // @ts-ignore
    let score = gameSingleton.getUserScore(user);
    if (score == 1) {
        res.status(409);
        res.send('user does not exist');
    } else {
        res.status(200);
        let obj = {
            'score': score
        };
        res.json(obj);
    }
});

/**
 * Single User Rank endpoint
 */
app.get('/data/rank', function (req, res) {
    console.log('');
    console.log('----------  ranks  ----------');
    console.log('a user requested /data/rank');
    let user = req.query.id;
    console.log('query: id=' + user);
    let rank = {
        //@ts-ignore
        'rank': gameSingleton.getUserRank(user)
    };
    if (!rank['rank']) {
        res.status(409);
        res.send('user does not exist');
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.json(rank);
    }
});

/**
 * Single User Msg endpoint
 */
app.get('/data/msg', function (req, res) {
    console.log('');
    console.log('-----------  msg  -----------');
    console.log('a user requested /data/msg');
    let user = req.query.id;
    console.log('query: id=' + user);

    let msg = {
        //@ts-ignore
        'msg': gameSingleton.getUserMsg(user)
    };
    if (msg['msg'] == -1) {
        res.status(409);
        res.send('user does not exist');
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.json(msg);
    }

});

/**
 * HighScores endpoint
 */
app.get('/data/highScores', function (req, res) {
    console.log('');
    console.log('-----------  HiScore  -----------');
    console.log('a user requested /data/highScores');

    let highScores = {
        //@ts-ignore
        'highScores': gameSingleton.getScoreMap()
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(highScores);


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

gameSingleton.getScoreMap();
console.log('gal is number ' + gameSingleton.getUserRank('gal'));