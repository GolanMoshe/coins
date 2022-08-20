$(document).ready(function(){
    $("#about").click(function(){
        $("#coin-list-container").empty();
        $("#coin-list-container").load("about.html");
    });
    
});

