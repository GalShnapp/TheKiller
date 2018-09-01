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

app.post('/', function (req, res) {

});

/**
 * Register New User endpoint
 */
app.post('/users/register', function (req, res) {
    console.log('create req');
    let username = req.body.username;
    let password = req.body.pass;
    // @ts-ignore
    if (gameSingleton.addUser(username, password)) {
        res.status(200);
        res.send('created');
    } else {
        res.status(409);
        res.send('This username is taken');
    }
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