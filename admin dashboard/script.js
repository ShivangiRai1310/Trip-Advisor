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
    // alert(idval);
    $(idval).show();
});

//EDIT USER
$("#edit-profile").click( function() {
    $("#profile .hide").show();
});

function matchPassword()
{
	if(document.getElementById('r7').value!=document.getElementById('r4').value)
	{
		alert("Passwords don't match, Enter again" );
	}
}

// VIEW USER TABLE
$(".mydatatable").DataTable();


// UPDATE USER
$(".disable-basedon").change(function () {
    // alert("changed");
    $(".disable").removeAttr("disabled");
    // $('.disable').prop("disabled", false);    BTN NOT WORKING WITH DISABLE CLASS
    // if($(this).val()=='abc'){
    //     $("#update-users input[name=contact]").val("1234567891");
    //     $("#update-users input[name=user_type]").val(["general"]);
    // }

});

{/* <script>
    function autofill(users){
      $(".disable").removeAttr("disabled");
      var username = $("#update-users .disable-basedon").val();
      alert(username);
      for(var i=0; i<users.length;i++){ 
          if(users[i].user_name == username){
            $("#update-users input[name=contact]").val("<%= users[i].contact %>");
          }
      } 
    }
  </script> */}

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
