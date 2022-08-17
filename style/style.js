function about(){
    $(".about").click(function () {
        $("#coin-template").empty();
        $("#coin-template").load("About.html");
    });
}