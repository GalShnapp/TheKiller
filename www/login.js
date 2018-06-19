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
    $("#createButton").click(function(){
        alert('create');
    });

    $("#loginButton").click(function() {
        url = "http://127.0.0.1:8081/ideas.html";
        $(location).attr("href", url);
        return false;
    }); 
});

