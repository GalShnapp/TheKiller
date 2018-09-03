window.onload = function () {
    var profileName = getUrlVars()["id"];
    document.getElementById("nameProfile").innerHTML = "Name: \t" + profileName;
    document.getElementById("imgProfile").src = "" + profileName + ".jpg";
    fetch("http://127.0.0.1:8081/data/score?id=" + profileName, {
        // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/json'
        },
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (obj) {
            console.log(obj);
            //alert(obj["score"]);
            document.getElementById("scoreProfile").innerHTML = "Score: \t" + obj["score"];

        });

    //alert("1");

    fetch("http://127.0.0.1:8081/data/rank?id=" + profileName, {
        // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/json'
        },
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (obj) {
            console.log(obj);
            //alert(obj["rank"]);
            document.getElementById("rank").innerHTML = "Rank: \t" + obj["rank"];

        });

    //alert("2");

    fetch("http://127.0.0.1:8081/data/msg?id=" + profileName, {
        // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/json'
        },
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (obj) {
            console.log(obj);
      //      alert(obj["msg"]);
            document.getElementById("secretMessage").innerHTML = "Secret Message: \t" + obj["msg"];

        });
};


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


function backBTN(){
    window.location.href = "http://127.0.0.1:8081/";
}