var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var ideas = {
    1 : "A Logo...",
    2 : "Tons of cat's gifs!!!!!!"
};

app.get('/', function (req, res) {
   res.send('Hello! \nI welcome you to my humble server.\nIf you wanna see the cool stuff, try and get some ideas ;)');
});

// /static/<filename> - returns the <filename> from the “www” directory that you should create
app.use(express.static('www'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/ideaup', function(req,res){
    // /idea/<id> (POST) - update an idea (string)  by it’s id
    console.log("post");
    console.log(ideas);
    var data = req.body;
    for(var key in data){
        ideas[key] = data[key];
    }
    console.log(ideas);
});

app.delete('/idead', function(req,res){
    // /idea/<id> (DELETE) - delete an idea by it’s id (returns 0 if success, 1 otherwise)
    console.log("delete");
    console.log(ideas);
    var data = req.body;
    for(var key in data){
        delete ideas[key];
    }
    console.log(ideas);   
});


app.put('/ideapu', function(req,res) {
    // /idea (PUT) - add new idea ( idea is just a string) returns the idead’s id
    console.log("put");
    console.log(ideas);
    var data = req.body;
    for(var key in data){
        ideas[key] = data[key];
    }
    console.log(ideas);
});

app.get('/ideas', function (req, res) {
    // /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ideas)); 
    console.log("get");
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
});