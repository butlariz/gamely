var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*?)&/)[1];

$(document).ready(function(){
  loadNameUser();
});

//Carregar nome 
function loadNameUser(){
  database.ref("users/" + USER_ID).once('value')
  .then(function(snapshot) {
    var username = (snapshot.val().name) || "Anonymous"
    console.log(username);
    $(".a-user-profile").text("Olá, " + username);
  });
}

// Links do menu
$(".a-home").click(function() {
  window.location = "home.html?id=" + USER_ID + "&";
});

$(".a-user-profile").click(function() {
  window.location = "profile.html?id=" + USER_ID + "&";
});