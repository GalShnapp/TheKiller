console.log('a');
$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    console.log('a');
});
console.log('b');

$(document).ready(function(){
    $("a").click(function(){
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });
    $("#regBTN").click(function(){
        alert("FCK VANILA JS");
    });
    $("#logBTN").click(function(){
        login();
        document.location = "http://127.0.0.1:8081/ideas.html";
        return false;
    });     
});

function login(){
    let data ={
        username: $('#Lusername').val(),
        pass: $('#Lpass').val()
    };
    fetch("http://127.0.0.1:8081/users/login", {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
    .then(function(response) {
        return response.json();
    })
    .then(function(obj) {
        for (var key in obj) {
            var idea = ideaFactory(key, obj[key]);
            list.insertBefore(idea, list.childNodes[0]);    
        }

    });
}