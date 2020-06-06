
$(".select-city").change(function(){
    // alert("changed");
    $(".get-location").removeAttr("disabled");
    // console.log($(this).val());
});

$(".get-location").click(function () {
    // alert("changed");
    $(".disable").removeAttr("disabled");
    // if($(this).val()=='abc'){
    //     $("#update-users input[name=contact]").val("1234567891");
    //     $("#update-users input[name=user_type]").val(["general"]);
    // }

});

// $(".show-basedon").click(function(){
//     $("#hidden").show();
// });
