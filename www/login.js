console.log('a');
$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    console.log('a');
});
console.log('b');

$(document).ready(function(){
    setCookie("username", "jhon");
    $("a").click(function(){
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });
     
});

