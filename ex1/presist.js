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

app.post('/', function (req, res) {

});

let server = app.listen(8082, function () {
    // @ts-ignore
    let host = server.address().address;
    // @ts-ignore
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});

console.log(gameSingelton.kill('roy', 'gal'));