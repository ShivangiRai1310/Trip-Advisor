$(".form-values").hide();
$("#edit-profile").click(function(){
  $(".form-values").show();
});

function matchPassword()
{
	if(document.getElementById('r7').value!=document.getElementById('r4').value)
	{
		alert("Passwords don't match, Enter again" );
	}
}