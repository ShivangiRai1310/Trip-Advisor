$(document).ready(function(){
    $(this).scrollTop(0);
});

$(".liked").click( function() {
    $(this).css("color", "red");
    let place_name = $(this).attr("place-name");
    $("#add-bookmark input[name=place_name]").val(place_name);
    $("#add-bookmark").submit();
});