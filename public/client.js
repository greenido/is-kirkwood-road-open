//
// @author: Ido Green | greenido.wordpress.com | @greenido
// @update: SEP 2020
//
$(function() {
  console.log("== Start the JS ==");
  let height = $(window).height() / 2 + 40;
  $(".dialogdlow").css("height", height + "px");

  $.get("/getText", function(data) {
    $("#curStatus").html(data);
  });

  //var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
});
