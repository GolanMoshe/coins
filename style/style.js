$(document).ready(function(){
    $("#about").click(function(){
        $("#coin-list-container").empty();
        $("#coin-list-container").load("about.html");
    });
    
});

function pageLoad(finish) {
    finish
      ? $(".screen").fadeOut(2000)
      // the div screen is from the div of the load
      : $("#coin-list-container").append(
        // append on body the progress bar
        `<div class="screen">
            <div class="loadimg-screens">
                <img src="/img/0x gold coin.gif" alt="">
            </div>
        </div>`
      );
  }




