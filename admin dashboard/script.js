$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

// SIDEBAR links SHOW/HIDE
// $(".sidebar-link").click(function () {
//     // if ($(".sidebar-link").hasClass("current")) {
//     //     $(".sidebar-link").removeClass("current");
//     //     $(".sidebar-link").children('ul').hide();
//     // }

//     // $("section").hide();

//     $(this).addClass("current");
//     $(this).children('ul').show();
//     let idval = $(this).children('a').attr("href");
//     // alert(idval);
//     $(idval).show();
//     $(idval + " div").first().show();

// });

// SUB-SIDEBAR links SHOW/HIDE
$(".sidebar-sub-link").click(function () {

    $(".sub-section").hide();    //not working on view parts though it does target it
    let idval = $(this).children('a').attr("href");
    $(idval).show();
});

//EDIT USER
$("#edit-profile").click( function() {
    $("#profile input").show();
});

// VIEW USER TABLE
$(".mydatatable").DataTable();


// UPDATE USER
$(".disable-basedon").change(function () {
    // alert("changed");
    $(".disable").removeAttr("disabled");
    // $('.disable').prop("disabled", false);    BTN NOT WORKING WITH DISABLE CLASS 
    if($(this).val()=='abc'){
        $("#update-users input[name=fname]").val("abc");
        $("#update-users input[name=user_type]").val(["general"]);
    }
    
});

// PENDING/ APPROVED BOOKING STATUS
$(".pending").click(function () {
    alert("Confirm Booking?");
    $(this).removeClass("btn-danger");
    $(this).removeClass("pending");
    $(this).addClass("btn-success");
    $(this).html("Approved");
});
//see if both cn be combined by using if case to check ancestor id name first before changing html
$(".pending-enquiry").click(function () { 
    alert("Has the enquiry been reviewed?");
    $(this).removeClass("btn-danger");
    $(this).removeClass("pending-enquiry");
    $(this).addClass("btn-success");
    $(this).html("Reviewed");
});


//SETTING MIN DATE
$(document).ready(function () {
let today = new Date(),
    day = today.getDate(),
    month = today.getMonth() + 1, //January is 0
    year = today.getFullYear();
if (day < 10) {
    day = '0' + day
}
if (month < 10) {
    month = '0' + month
}
today = year + '-' + month + '-' + day;

$(".date_open").attr("min", today);

});