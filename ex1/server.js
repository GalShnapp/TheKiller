var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');



var ideas = {
    1 : "A Logo...",
    2 : "Tons of cat's gifs!!!!!!"
};
function logReq(req,res,next){
//    console.log("**************************** BODY *************************");
//    console.log("**************************** BODY *************************");
//    console.log("**************************** BODY *************************");
//    console.log(req.body);

//    console.log("**************************** COOKIE *************************");
//    console.log("**************************** COOKIE *************************");
//    console.log("**************************** COOKIE *************************");
//   console.log(req.cookies);
//    console.log("**************************** URL *************************");
//    console.log("**************************** URL *************************");
//    console.log("**************************** URL *************************");
   console.log(req.url);
    next();
}

// /static/<filename> - returns the <filename> from the “www” directory that you should create

app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logReq);
app.use(express.static('www'));


app.post('/users/register', function(req,res){
    var username = req.body.username;
    var password = req.body.pass;
    res.redirect('/ideas.html');
});

app.post('/users/login',function(req,res){
    var username = req.body.username;
    var password = req.body.pass;
    console.log('ll');
    res.redirect('/ideas.html');
});



app.get('/', function (req, res) {
//    console.log(req.cookies);
    console.log('we here');
    res.redirect('/ideas.html');
});

app.post('/ideaup', function(req,res){
    // /idea/<id> (POST) - update an idea (string)  by it’s id
    var data = req.body;
    for(var key in data){
        ideas[key] = data[key];
    }
});


app.delete('/idead', function(req,res){
    // /idea/<id> (DELETE) - delete an idea by it’s id (returns 0 if success, 1 otherwise)
    var data = req.body;
    for(var key in data){
        delete ideas[key];
    }
});


app.put('/ideapu', function(req,res) {
    // /idea (PUT) - add new idea ( idea is just a string) returns the idead’s id
    var data = req.body;
    for(var key in data){
        ideas[key] = data[key];
    }
});

app.get('/ideas', function (req, res) {
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ideas)); 
});

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});


