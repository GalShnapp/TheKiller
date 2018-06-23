var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var path = require('path');


// /static/<filename> - returns the <filename> from the “www” directory that you should create




app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('www'));
app.use(function(err,req,res,next){
    if(err){
        res.status(500);
        res.end();
        console.error(err);
    }
    res.status(404);
    console.log("error while trying to server: ");
    console.log(req.url);
    res.end();
});


app.post('/users/register', function(req,res){
    //var username = req.body.username;
    //var password = req.body.pass;
    console.log('create req');
    res.cookie('username', username, {maxAge : 1000*60*30});
});

app.post('/users/login',function(req,res){
    var username = req.body.username;
    var password = req.body.pass;
    res.cookie('username', username, {maxAge : 1000*60*30});
    res.status(200);
    res.end('we good');

});



app.get('/', function (req, res) {
//    console.log(req.cookies);
    if(typeof req.cookies.username !== undefined){   
        res.sendFile(path.join(__dirname,"priv","ideas.html"));    
    }
    res.redirect('/login.html');
});

app.post('/ideaup', function(req,res){
    // /idea/<id> (POST) - update an idea (string)  by it’s id
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    var ideas = DB.req.body.username.ideas;
    var data = req.body;
    for(var key in data){
        ideas[key] = data[key];
    }
});


app.delete('/idead', function(req,res){
    // /idea/<id> (DELETE) - delete an idea by it’s id (returns 0 if success, 1 otherwise)
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    var ideas = DB.req.body.username.ideas;
    var data = req.body;
    for(var key in data){
        delete ideas[key];
    }
});


app.put('/ideapu', function(req,res) {
    // /idea (PUT) - add new idea ( idea is just a string) returns the idead’s id
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    var ideas = DB.req.body.username.ideas;
    var data = req.body;
    for(var key in data){
        ideas[key] = data[key];
    }
});

app.get('/ideas', function (req, res) {
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    var DB = JSON.parse(fs.readFileSync('DB.txt'));
    console.log(req.cookies);
//    console.log(DB['gal']);
    var ideas = DB[username].ideas;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ideas)); 
});

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});


